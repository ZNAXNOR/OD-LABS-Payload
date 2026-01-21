/**
 * Parallel processing utilities for performance optimization
 */

import { Worker } from 'worker_threads'
// import { isMainThread, parentPort, workerData } from 'worker_threads' // Unused - commented out
import { cpus } from 'os'
// import { join } from 'path' // Unused - commented out

export interface ParallelOptions {
  maxWorkers?: number
  timeout?: number
  retries?: number
}

export interface WorkerTask<T, R> {
  id: string
  data: T
  resolve: (result: R) => void
  reject: (error: Error) => void
}

export class ParallelProcessor<T, R> {
  private workers: Worker[] = []
  private taskQueue: WorkerTask<T, R>[] = []
  private activeTasks = new Map<string, WorkerTask<T, R>>()
  private options: Required<ParallelOptions>

  constructor(
    private workerScript: string,
    options: ParallelOptions = {},
  ) {
    this.options = {
      maxWorkers: options.maxWorkers || Math.max(1, cpus().length - 1),
      timeout: options.timeout || 30000, // 30 seconds
      retries: options.retries || 2,
    }
  }

  /**
   * Process multiple tasks in parallel
   */
  async processAll(tasks: T[]): Promise<R[]> {
    if (tasks.length === 0) {
      return []
    }

    // Initialize workers
    await this.initializeWorkers()

    // Create promises for all tasks
    const promises = tasks.map((task, index) => this.processTask(`task-${index}`, task))

    try {
      const results = await Promise.all(promises)
      return results
    } finally {
      await this.cleanup()
    }
  }

  /**
   * Process tasks in batches to control memory usage
   */
  async processBatches(tasks: T[], batchSize: number = 10): Promise<R[]> {
    const results: R[] = []

    for (let i = 0; i < tasks.length; i += batchSize) {
      const batch = tasks.slice(i, i + batchSize)
      const batchResults = await this.processAll(batch)
      results.push(...batchResults)

      // Small delay to allow garbage collection
      await new Promise((resolve) => setTimeout(resolve, 10))
    }

    return results
  }

  /**
   * Process a single task
   */
  private async processTask(id: string, data: T): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      const task: WorkerTask<T, R> = { id, data, resolve, reject }

      // Add timeout
      const timeoutId = setTimeout(() => {
        this.activeTasks.delete(id)
        reject(new Error(`Task ${id} timed out after ${this.options.timeout}ms`))
      }, this.options.timeout)

      // Wrap resolve/reject to clear timeout
      const wrappedResolve = (result: R) => {
        clearTimeout(timeoutId)
        resolve(result)
      }

      const wrappedReject = (error: Error) => {
        clearTimeout(timeoutId)
        reject(error)
      }

      task.resolve = wrappedResolve
      task.reject = wrappedReject

      this.queueTask(task)
    })
  }

  private async initializeWorkers(): Promise<void> {
    const workerPromises = []

    for (let i = 0; i < this.options.maxWorkers; i++) {
      workerPromises.push(this.createWorker())
    }

    this.workers = await Promise.all(workerPromises)
  }

  private async createWorker(): Promise<Worker> {
    const worker = new Worker(this.workerScript, {
      transferList: [],
    })

    worker.on('message', (message) => {
      this.handleWorkerMessage(worker, message)
    })

    worker.on('error', (error) => {
      this.handleWorkerError(worker, error)
    })

    worker.on('exit', (code) => {
      if (code !== 0) {
        console.warn(`Worker exited with code ${code}`)
      }
    })

    return worker
  }

  private queueTask(task: WorkerTask<T, R>): void {
    this.activeTasks.set(task.id, task)

    // Try to assign to available worker
    const availableWorker = this.findAvailableWorker()
    if (availableWorker) {
      this.assignTaskToWorker(availableWorker, task)
    } else {
      this.taskQueue.push(task)
    }
  }

  private findAvailableWorker(): Worker | null {
    // Simple round-robin assignment
    // In a more sophisticated implementation, we'd track worker load
    return this.workers.find((worker) => !this.isWorkerBusy(worker)) || null
  }

  private isWorkerBusy(_worker: Worker): boolean {
    // Check if worker has active tasks
    // This is a simplified implementation
    return false // For now, assume workers are always available
  }

  private assignTaskToWorker(worker: Worker, task: WorkerTask<T, R>): void {
    worker.postMessage({
      type: 'task',
      id: task.id,
      data: task.data,
    })
  }

  private handleWorkerMessage(worker: Worker, message: any): void {
    const { type, id, result, error } = message

    if (type === 'result') {
      const task = this.activeTasks.get(id)
      if (task) {
        this.activeTasks.delete(id)
        task.resolve(result)
        this.processNextTask(worker)
      }
    } else if (type === 'error') {
      const task = this.activeTasks.get(id)
      if (task) {
        this.activeTasks.delete(id)
        task.reject(new Error(error))
        this.processNextTask(worker)
      }
    }
  }

  private handleWorkerError(_worker: Worker, error: Error): void {
    console.error('Worker error:', error)

    // Find and reject all tasks assigned to this worker
    for (const [id, task] of this.activeTasks.entries()) {
      task.reject(new Error(`Worker error: ${error.message}`))
      this.activeTasks.delete(id)
    }
  }

  private processNextTask(worker: Worker): void {
    const nextTask = this.taskQueue.shift()
    if (nextTask) {
      this.assignTaskToWorker(worker, nextTask)
    }
  }

  private async cleanup(): Promise<void> {
    const terminationPromises = this.workers.map((worker) => worker.terminate())

    await Promise.all(terminationPromises)
    this.workers = []
    this.taskQueue = []
    this.activeTasks.clear()
  }
}

/**
 * Utility function to create a worker script for block analysis
 */
export function createBlockAnalysisWorker(): string {
  return `
const { parentPort } = require('worker_threads');
const { BlockAnalyzer } = require('../analyzers/BlockAnalyzer.js');

const analyzer = new BlockAnalyzer();

parentPort.on('message', async (message) => {
  const { type, id, data } = message;
  
  if (type === 'task') {
    try {
      const result = await analyzer.analyzeBlock(data.blockPath);
      parentPort.postMessage({
        type: 'result',
        id,
        result
      });
    } catch (error) {
      parentPort.postMessage({
        type: 'error',
        id,
        error: error.message
      });
    }
  }
});
`
}

/**
 * Utility function to create a worker script for component analysis
 */
export function createComponentAnalysisWorker(): string {
  return `
const { parentPort } = require('worker_threads');
const { ComponentAnalyzer } = require('../analyzers/ComponentAnalyzer.js');

const analyzer = new ComponentAnalyzer();

parentPort.on('message', async (message) => {
  const { type, id, data } = message;
  
  if (type === 'task') {
    try {
      const result = await analyzer.analyzeComponent(data.componentPath);
      parentPort.postMessage({
        type: 'result',
        id,
        result
      });
    } catch (error) {
      parentPort.postMessage({
        type: 'error',
        id,
        error: error.message
      });
    }
  }
});
`
}

/**
 * Batch processor for handling large datasets efficiently
 */
export class BatchProcessor<T, R> {
  constructor(
    private processFn: (item: T) => Promise<R>,
    private batchSize: number = 10,
    private concurrency: number = 3,
  ) {}

  async processAll(items: T[]): Promise<R[]> {
    const results: R[] = []
    const batches = this.createBatches(items)

    // Process batches with limited concurrency
    for (let i = 0; i < batches.length; i += this.concurrency) {
      const concurrentBatches = batches.slice(i, i + this.concurrency)
      const batchPromises = concurrentBatches.map((batch) => this.processBatch(batch))

      const batchResults = await Promise.all(batchPromises)
      results.push(...batchResults.flat())

      // Progress reporting
      const processed = Math.min((i + this.concurrency) * this.batchSize, items.length)
      console.log(`Processed ${processed}/${items.length} items`)
    }

    return results
  }

  private createBatches(items: T[]): T[][] {
    const batches: T[][] = []
    for (let i = 0; i < items.length; i += this.batchSize) {
      batches.push(items.slice(i, i + this.batchSize))
    }
    return batches
  }

  private async processBatch(batch: T[]): Promise<R[]> {
    const promises = batch.map((item) => this.processFn(item))
    return Promise.all(promises)
  }
}

/**
 * Memory-efficient stream processor
 */
export class StreamProcessor<T, R> {
  private buffer: T[] = []
  private processing = false

  constructor(
    private processFn: (items: T[]) => Promise<R[]>,
    private bufferSize: number = 100,
    private onResults?: (results: R[]) => void,
  ) {}

  async add(item: T): Promise<void> {
    this.buffer.push(item)

    if (this.buffer.length >= this.bufferSize) {
      await this.flush()
    }
  }

  async flush(): Promise<R[]> {
    if (this.buffer.length === 0 || this.processing) {
      return []
    }

    this.processing = true
    const batch = this.buffer.splice(0, this.bufferSize)

    try {
      const results = await this.processFn(batch)

      if (this.onResults) {
        this.onResults(results)
      }

      return results
    } finally {
      this.processing = false

      // Process remaining items if buffer filled up during processing
      if (this.buffer.length >= this.bufferSize) {
        setImmediate(() => this.flush())
      }
    }
  }

  async finish(): Promise<R[]> {
    const results: R[] = []

    while (this.buffer.length > 0) {
      const batchResults = await this.flush()
      results.push(...batchResults)
    }

    return results
  }
}
