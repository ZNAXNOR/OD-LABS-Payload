/**
 * Block Configuration Parser
 * Loads and parses Payload CMS block configuration files
 */

import * as ts from 'typescript'
import * as fs from 'fs/promises'
// import * as path from 'path'
import type { Block } from '../types'

export interface ParsedBlockConfig {
  block: Block
  filePath: string
  sourceCode: string
  ast: ts.SourceFile
  dependencies: string[]
}

export interface ParseError {
  file: string
  message: string
  line?: number
  column?: number
}

export class BlockConfigParser {
  // private compilerOptions: ts.CompilerOptions

  constructor() {
    // this.compilerOptions = {
    //   target: ts.ScriptTarget.ESNext,
    //   module: ts.ModuleKind.ESNext,
    //   moduleResolution: ts.ModuleResolutionKind.NodeNext,
    //   esModuleInterop: true,
    //   skipLibCheck: true,
    //   allowSyntheticDefaultImports: true,
    //   strict: true,
    //   jsx: ts.JsxEmit.React,
    // }
  }

  /**
   * Parse a block configuration file
   */
  async parseBlockConfig(filePath: string): Promise<ParsedBlockConfig> {
    try {
      // Read the file
      const sourceCode = await fs.readFile(filePath, 'utf-8')

      // Parse into AST
      const ast = ts.createSourceFile(
        filePath,
        sourceCode,
        ts.ScriptTarget.ESNext,
        true,
        ts.ScriptKind.TS,
      )

      // Extract block configuration
      const block = this.extractBlockFromAST(ast, filePath)

      // Extract dependencies
      const dependencies = this.extractDependencies(ast)

      return {
        block,
        filePath,
        sourceCode,
        ast,
        dependencies,
      }
    } catch (error) {
      throw new Error(`Failed to parse block config at ${filePath}: ${(error as Error).message}`)
    }
  }

  /**
   * Extract block configuration from AST
   */
  private extractBlockFromAST(ast: ts.SourceFile, filePath: string): Block {
    let blockConfig: Block | null = null

    // Find the block configuration object
    const visit = (node: ts.Node) => {
      // Look for variable declarations or exports
      if (ts.isVariableStatement(node)) {
        node.declarationList.declarations.forEach((declaration) => {
          if (ts.isVariableDeclaration(declaration) && declaration.initializer) {
            const config = this.extractBlockObject(declaration.initializer)
            if (config && config.slug) {
              blockConfig = config
            }
          }
        })
      }

      // Look for export assignments
      if (ts.isExportAssignment(node)) {
        const config = this.extractBlockObject(node.expression)
        if (config && config.slug) {
          blockConfig = config
        }
      }

      // Look for named exports
      if (ts.isExportDeclaration(node) && node.exportClause) {
        // Handle named exports
      }

      ts.forEachChild(node, visit)
    }

    visit(ast)

    if (!blockConfig) {
      throw new Error(`No valid block configuration found in ${filePath}`)
    }

    return blockConfig
  }

  /**
   * Extract block object from an expression
   */
  private extractBlockObject(node: ts.Expression): Block | null {
    if (!ts.isObjectLiteralExpression(node)) {
      return null
    }

    const block: Partial<Block> = {
      fields: [],
    }

    node.properties.forEach((prop) => {
      if (!ts.isPropertyAssignment(prop)) return

      const name = this.getPropertyName(prop.name)
      if (!name) return

      switch (name) {
        case 'slug':
          if (ts.isStringLiteral(prop.initializer)) {
            block.slug = prop.initializer.text
          }
          break

        case 'interfaceName':
          if (ts.isStringLiteral(prop.initializer)) {
            block.interfaceName = prop.initializer.text
          }
          break

        case 'labels':
          if (ts.isObjectLiteralExpression(prop.initializer)) {
            block.labels = this.extractLabels(prop.initializer)
          }
          break

        case 'fields':
          if (ts.isArrayLiteralExpression(prop.initializer)) {
            block.fields = this.extractFields(prop.initializer)
          }
          break

        case 'access':
          if (ts.isObjectLiteralExpression(prop.initializer)) {
            block.access = this.extractAccessControl(prop.initializer)
          }
          break

        case 'admin':
          if (ts.isObjectLiteralExpression(prop.initializer)) {
            block.admin = this.extractAdminConfig(prop.initializer)
          }
          break

        case 'hooks':
          if (ts.isObjectLiteralExpression(prop.initializer)) {
            block.hooks = this.extractHooks(prop.initializer)
          }
          break
      }
    })

    return block.slug ? (block as Block) : null
  }

  /**
   * Extract labels from object literal
   */
  private extractLabels(node: ts.ObjectLiteralExpression): { singular: string; plural: string } {
    const labels: any = {}

    node.properties.forEach((prop) => {
      if (!ts.isPropertyAssignment(prop)) return

      const name = this.getPropertyName(prop.name)
      if (name && ts.isStringLiteral(prop.initializer)) {
        labels[name] = prop.initializer.text
      }
    })

    return labels
  }

  /**
   * Extract fields array from array literal
   */
  private extractFields(node: ts.ArrayLiteralExpression): any[] {
    const fields: any[] = []

    node.elements.forEach((element) => {
      if (ts.isObjectLiteralExpression(element)) {
        const field = this.extractFieldObject(element)
        if (field) {
          fields.push(field)
        }
      }
    })

    return fields
  }

  /**
   * Extract a single field object
   */
  private extractFieldObject(node: ts.ObjectLiteralExpression): any {
    const field: any = {}

    node.properties.forEach((prop) => {
      if (!ts.isPropertyAssignment(prop)) return

      const name = this.getPropertyName(prop.name)
      if (!name) return

      // Extract basic properties
      if (ts.isStringLiteral(prop.initializer)) {
        field[name] = prop.initializer.text
      } else if (ts.isNumericLiteral(prop.initializer)) {
        field[name] = Number(prop.initializer.text)
      } else if (prop.initializer.kind === ts.SyntaxKind.TrueKeyword) {
        field[name] = true
      } else if (prop.initializer.kind === ts.SyntaxKind.FalseKeyword) {
        field[name] = false
      } else if (ts.isArrayLiteralExpression(prop.initializer)) {
        // Handle nested fields (for array, group, blocks types)
        if (name === 'fields') {
          field[name] = this.extractFields(prop.initializer)
        } else if (name === 'blocks') {
          field[name] = this.extractBlocks(prop.initializer)
        } else if (name === 'options') {
          field[name] = this.extractOptions(prop.initializer)
        } else {
          field[name] = this.extractArrayLiteral(prop.initializer)
        }
      } else if (ts.isObjectLiteralExpression(prop.initializer)) {
        // Handle nested objects (admin, access, etc.)
        if (name === 'admin') {
          field[name] = this.extractFieldAdminConfig(prop.initializer)
        } else if (name === 'access') {
          field[name] = this.extractFieldAccessControl(prop.initializer)
        } else if (name === 'labels') {
          field[name] = this.extractLabels(prop.initializer)
        } else {
          field[name] = this.extractObjectLiteral(prop.initializer)
        }
      } else if (
        ts.isArrowFunction(prop.initializer) ||
        ts.isFunctionExpression(prop.initializer)
      ) {
        // Mark that a function exists (we don't execute it)
        field[name] = '<function>'
      }
    })

    return field
  }

  /**
   * Extract blocks array (for blocks field type)
   */
  private extractBlocks(node: ts.ArrayLiteralExpression): any[] {
    const blocks: any[] = []

    node.elements.forEach((element) => {
      if (ts.isObjectLiteralExpression(element)) {
        const block = this.extractBlockObject(element)
        if (block) {
          blocks.push(block)
        }
      }
    })

    return blocks
  }

  /**
   * Extract options array (for select, radio fields)
   */
  private extractOptions(node: ts.ArrayLiteralExpression): any[] {
    const options: any[] = []

    node.elements.forEach((element) => {
      if (ts.isStringLiteral(element)) {
        options.push(element.text)
      } else if (ts.isObjectLiteralExpression(element)) {
        options.push(this.extractObjectLiteral(element))
      }
    })

    return options
  }

  /**
   * Extract generic array literal
   */
  private extractArrayLiteral(node: ts.ArrayLiteralExpression): any[] {
    const array: any[] = []

    node.elements.forEach((element) => {
      if (ts.isStringLiteral(element)) {
        array.push(element.text)
      } else if (ts.isNumericLiteral(element)) {
        array.push(Number(element.text))
      } else if (element.kind === ts.SyntaxKind.TrueKeyword) {
        array.push(true)
      } else if (element.kind === ts.SyntaxKind.FalseKeyword) {
        array.push(false)
      } else if (ts.isObjectLiteralExpression(element)) {
        array.push(this.extractObjectLiteral(element))
      }
    })

    return array
  }

  /**
   * Extract generic object literal
   */
  private extractObjectLiteral(node: ts.ObjectLiteralExpression): any {
    const obj: any = {}

    node.properties.forEach((prop) => {
      if (!ts.isPropertyAssignment(prop)) return

      const name = this.getPropertyName(prop.name)
      if (!name) return

      if (ts.isStringLiteral(prop.initializer)) {
        obj[name] = prop.initializer.text
      } else if (ts.isNumericLiteral(prop.initializer)) {
        obj[name] = Number(prop.initializer.text)
      } else if (prop.initializer.kind === ts.SyntaxKind.TrueKeyword) {
        obj[name] = true
      } else if (prop.initializer.kind === ts.SyntaxKind.FalseKeyword) {
        obj[name] = false
      } else if (ts.isObjectLiteralExpression(prop.initializer)) {
        obj[name] = this.extractObjectLiteral(prop.initializer)
      } else if (ts.isArrayLiteralExpression(prop.initializer)) {
        obj[name] = this.extractArrayLiteral(prop.initializer)
      }
    })

    return obj
  }

  /**
   * Extract access control configuration
   */
  private extractAccessControl(node: ts.ObjectLiteralExpression): any {
    const access: any = {}

    node.properties.forEach((prop) => {
      if (!ts.isPropertyAssignment(prop)) return

      const name = this.getPropertyName(prop.name)
      if (name) {
        // Mark that access control exists for this operation
        access[name] = '<function>'
      }
    })

    return access
  }

  /**
   * Extract field-level access control
   */
  private extractFieldAccessControl(node: ts.ObjectLiteralExpression): any {
    return this.extractAccessControl(node)
  }

  /**
   * Extract admin configuration
   */
  private extractAdminConfig(node: ts.ObjectLiteralExpression): any {
    return this.extractObjectLiteral(node)
  }

  /**
   * Extract field admin configuration
   */
  private extractFieldAdminConfig(node: ts.ObjectLiteralExpression): any {
    return this.extractObjectLiteral(node)
  }

  /**
   * Extract hooks configuration
   */
  private extractHooks(node: ts.ObjectLiteralExpression): any {
    const hooks: any = {}

    node.properties.forEach((prop) => {
      if (!ts.isPropertyAssignment(prop)) return

      const name = this.getPropertyName(prop.name)
      if (name && ts.isArrayLiteralExpression(prop.initializer)) {
        hooks[name] = prop.initializer.elements.map(() => '<function>')
      }
    })

    return hooks
  }

  /**
   * Extract dependencies (imports) from AST
   */
  private extractDependencies(ast: ts.SourceFile): string[] {
    const dependencies: string[] = []

    const visit = (node: ts.Node) => {
      if (ts.isImportDeclaration(node)) {
        const moduleSpecifier = node.moduleSpecifier
        if (ts.isStringLiteral(moduleSpecifier)) {
          dependencies.push(moduleSpecifier.text)
        }
      }

      ts.forEachChild(node, visit)
    }

    visit(ast)

    return dependencies
  }

  /**
   * Get property name from property name node
   */
  private getPropertyName(name: ts.PropertyName): string | null {
    if (ts.isIdentifier(name)) {
      return name.text
    } else if (ts.isStringLiteral(name)) {
      return name.text
    }
    return null
  }

  /**
   * Extract block metadata (slug, interfaceName, labels)
   */
  extractBlockMetadata(block: Block): {
    slug: string
    interfaceName?: string
    labels?: { singular: string; plural: string }
  } {
    return {
      slug: block.slug,
      interfaceName: block.interfaceName,
      labels: block.labels,
    }
  }
}
