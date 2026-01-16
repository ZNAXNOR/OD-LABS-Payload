import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createAuditTrailHook } from '@/pages/shared/hooks/createAuditTrailHook'

/**
 * Unit tests for createAuditTrailHook
 *
 * These tests verify that the audit trail hook correctly populates
 * createdBy and updatedBy fields based on operation type and user context.
 *
 * **Validates: Requirements 8.1**
 */
describe('createAuditTrailHook', () => {
  // Mock logger
  const mockLogger = {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  }

  // Mock payload
  const mockPayload = {
    logger: mockLogger,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('create operation', () => {
    it('should set createdBy on create operation with user', () => {
      const hook = createAuditTrailHook()
      const data = {}
      const req = {
        user: { id: 'user-123', email: 'test@example.com' },
        payload: mockPayload,
      }

      const result = hook({
        data,
        req: req as any,
        operation: 'create',
        collection: undefined as any,
        context: {},
      })

      expect(result.createdBy).toBe('user-123')
      expect(result.updatedBy).toBeUndefined()
      expect(mockLogger.info).toHaveBeenCalledWith('Audit trail: Set createdBy to user-123')
    })

    it('should not set createdBy on create operation without user', () => {
      const hook = createAuditTrailHook()
      const data = {}
      const req = {
        user: null,
        payload: mockPayload,
      }

      const result = hook({
        data,
        req: req as any,
        operation: 'create',
        collection: undefined as any,
        context: {},
      })

      expect(result.createdBy).toBeUndefined()
      expect(result.updatedBy).toBeUndefined()
      expect(mockLogger.info).not.toHaveBeenCalled()
    })

    it('should not set createdBy on create operation with undefined user', () => {
      const hook = createAuditTrailHook()
      const data = {}
      const req = {
        user: undefined,
        payload: mockPayload,
      }

      const result = hook({
        data,
        req: req as any,
        operation: 'create',
        collection: undefined as any,
        context: {},
      })

      expect(result.createdBy).toBeUndefined()
      expect(mockLogger.info).not.toHaveBeenCalled()
    })

    it('should preserve existing data on create', () => {
      const hook = createAuditTrailHook()
      const data = {
        title: 'Test Post',
        content: 'Test content',
        status: 'draft',
      }
      const req = {
        user: { id: 'user-456' },
        payload: mockPayload,
      }

      const result = hook({
        data,
        req: req as any,
        operation: 'create',
        collection: undefined as any,
        context: {},
      })

      expect(result.title).toBe('Test Post')
      expect(result.content).toBe('Test content')
      expect(result.status).toBe('draft')
      expect(result.createdBy).toBe('user-456')
    })
  })

  describe('update operation', () => {
    it('should set updatedBy on update operation with user', () => {
      const hook = createAuditTrailHook()
      const data = { title: 'Updated Title' }
      const req = {
        user: { id: 'user-789', email: 'updater@example.com' },
        payload: mockPayload,
      }

      const result = hook({
        data,
        req: req as any,
        operation: 'update',
        collection: undefined as any,
        context: {},
      })

      expect(result.updatedBy).toBe('user-789')
      expect(result.createdBy).toBeUndefined()
      expect(mockLogger.info).toHaveBeenCalledWith('Audit trail: Set updatedBy to user-789')
    })

    it('should not set updatedBy on update operation without user', () => {
      const hook = createAuditTrailHook()
      const data = { title: 'Updated Title' }
      const req = {
        user: null,
        payload: mockPayload,
      }

      const result = hook({
        data,
        req: req as any,
        operation: 'update',
        collection: undefined as any,
        context: {},
      })

      expect(result.updatedBy).toBeUndefined()
      expect(mockLogger.info).not.toHaveBeenCalled()
    })

    it('should preserve existing data on update', () => {
      const hook = createAuditTrailHook()
      const data = {
        title: 'Updated Title',
        content: 'Updated content',
        createdBy: 'original-user',
      }
      const req = {
        user: { id: 'user-999' },
        payload: mockPayload,
      }

      const result = hook({
        data,
        req: req as any,
        operation: 'update',
        collection: undefined as any,
        context: {},
      })

      expect(result.title).toBe('Updated Title')
      expect(result.content).toBe('Updated content')
      expect(result.createdBy).toBe('original-user')
      expect(result.updatedBy).toBe('user-999')
    })

    it('should overwrite existing updatedBy on update', () => {
      const hook = createAuditTrailHook()
      const data = {
        title: 'Updated Title',
        updatedBy: 'old-user',
      }
      const req = {
        user: { id: 'new-user' },
        payload: mockPayload,
      }

      const result = hook({
        data,
        req: req as any,
        operation: 'update',
        collection: undefined as any,
        context: {},
      })

      expect(result.updatedBy).toBe('new-user')
    })
  })

  describe('edge cases', () => {
    it('should handle empty data object', () => {
      const hook = createAuditTrailHook()
      const data = {}
      const req = {
        user: { id: 'user-123' },
        payload: mockPayload,
      }

      const result = hook({
        data,
        req: req as any,
        operation: 'create',
        collection: undefined as any,
        context: {},
      })

      expect(result).toEqual({ createdBy: 'user-123' })
    })

    it('should handle user with only id property', () => {
      const hook = createAuditTrailHook()
      const data = {}
      const req = {
        user: { id: 'minimal-user' },
        payload: mockPayload,
      }

      const result = hook({
        data,
        req: req as any,
        operation: 'create',
        collection: undefined as any,
        context: {},
      })

      expect(result.createdBy).toBe('minimal-user')
    })

    it('should not modify data for other operations', () => {
      const hook = createAuditTrailHook()
      const data = { title: 'Test' }
      const req = {
        user: { id: 'user-123' },
        payload: mockPayload,
      }

      const result = hook({
        data,
        req: req as any,
        operation: 'read' as any,
        collection: undefined as any,
        context: {},
      })

      expect(result.createdBy).toBeUndefined()
      expect(result.updatedBy).toBeUndefined()
      expect(mockLogger.info).not.toHaveBeenCalled()
    })

    it('should handle numeric user IDs', () => {
      const hook = createAuditTrailHook()
      const data = {}
      const req = {
        user: { id: 12345 },
        payload: mockPayload,
      }

      const result = hook({
        data,
        req: req as any,
        operation: 'create',
        collection: undefined as any,
        context: {},
      })

      expect(result.createdBy).toBe(12345)
    })

    it('should return the same data object reference', () => {
      const hook = createAuditTrailHook()
      const data = { title: 'Test' }
      const req = {
        user: { id: 'user-123' },
        payload: mockPayload,
      }

      const result = hook({
        data,
        req: req as any,
        operation: 'create',
        collection: undefined as any,
        context: {},
      })

      expect(result).toBe(data)
    })
  })

  describe('multiple operations', () => {
    it('should handle sequential create and update operations', () => {
      const hook = createAuditTrailHook()

      // Create operation
      const createData = { title: 'New Post' }
      const createReq = {
        user: { id: 'creator-user' },
        payload: mockPayload,
      }

      const createResult = hook({
        data: createData,
        req: createReq as any,
        operation: 'create',
        collection: undefined as any,
        context: {},
      })

      expect(createResult.createdBy).toBe('creator-user')
      expect(createResult.updatedBy).toBeUndefined()

      // Update operation
      const updateData = { ...createResult, title: 'Updated Post' }
      const updateReq = {
        user: { id: 'updater-user' },
        payload: mockPayload,
      }

      const updateResult = hook({
        data: updateData,
        req: updateReq as any,
        operation: 'update',
        collection: undefined as any,
        context: {},
      })

      expect(updateResult.createdBy).toBe('creator-user')
      expect(updateResult.updatedBy).toBe('updater-user')
    })

    it('should handle multiple updates by different users', () => {
      const hook = createAuditTrailHook()
      let data: any = { title: 'Post', createdBy: 'original-creator' }

      // First update
      const req1 = {
        user: { id: 'updater-1' },
        payload: mockPayload,
      }

      data = hook({
        data,
        req: req1 as any,
        operation: 'update',
        collection: undefined as any,
        context: {},
      })

      expect(data.updatedBy).toBe('updater-1')

      // Second update
      const req2 = {
        user: { id: 'updater-2' },
        payload: mockPayload,
      }

      data = hook({
        data,
        req: req2 as any,
        operation: 'update',
        collection: undefined as any,
        context: {},
      })

      expect(data.updatedBy).toBe('updater-2')
      expect(data.createdBy).toBe('original-creator')
    })
  })
})
