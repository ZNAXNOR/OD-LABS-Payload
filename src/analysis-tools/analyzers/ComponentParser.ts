/**
 * Component Parser
 * Parses React component files using TypeScript compiler API
 * Extracts component metadata, props, imports, exports, and JSX structure
 */

import * as ts from 'typescript'
import * as fs from 'fs'
import * as path from 'path'
import type { Component, PropDefinition, Import, Export, JSXElement, ReactHook } from '../types'

export interface ParsedComponent {
  component: Component
  errors: ParseError[]
}

export interface ParseError {
  message: string
  line?: number
  column?: number
}

export class ComponentParser {
  /**
   * Parse a React component file
   */
  async parseComponent(componentPath: string): Promise<ParsedComponent> {
    const errors: ParseError[] = []

    try {
      // Read the file
      const source = fs.readFileSync(componentPath, 'utf-8')

      // Create TypeScript source file
      const sourceFile = ts.createSourceFile(
        componentPath,
        source,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TSX,
      )

      // Extract component metadata
      const componentName = this.extractComponentName(sourceFile, componentPath)
      const componentType = this.detectComponentType(source)
      const props = this.extractProps(sourceFile)
      const imports = this.extractImports(sourceFile)
      const exports = this.extractExports(sourceFile)
      const jsx = this.extractJSXElements(sourceFile)
      const hooks = this.extractReactHooks(sourceFile)

      const component: Component = {
        path: componentPath,
        name: componentName,
        type: componentType,
        props,
        imports,
        exports,
        jsx,
        hooks,
        ast: sourceFile,
      }

      return {
        component,
        errors,
      }
    } catch (error) {
      errors.push({
        message: `Failed to parse component: ${(error as Error).message}`,
      })

      // Return minimal component structure
      return {
        component: {
          path: componentPath,
          name: path.basename(componentPath, path.extname(componentPath)),
          type: 'server',
          props: [],
          imports: [],
          exports: [],
          jsx: [],
          hooks: [],
          ast: null,
        },
        errors,
      }
    }
  }

  /**
   * Detect if component is Server or Client Component
   * Client components have 'use client' directive at the top
   */
  detectComponentType(source: string): 'server' | 'client' {
    // Check for 'use client' directive at the beginning of the file
    const lines = source.split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      // Skip empty lines and comments
      if (trimmed === '' || trimmed.startsWith('//') || trimmed.startsWith('/*')) {
        continue
      }
      // Check for 'use client' directive
      if (trimmed === "'use client'" || trimmed === '"use client"') {
        return 'client'
      }
      // If we hit any other code, stop looking
      break
    }
    return 'server'
  }

  /**
   * Extract component name from file
   */
  private extractComponentName(sourceFile: ts.SourceFile, filePath: string): string {
    let componentName = path.basename(filePath, path.extname(filePath))

    // Try to find the main component export
    const visit = (node: ts.Node) => {
      // Look for default export function/arrow function
      if (ts.isFunctionDeclaration(node) && node.name) {
        const modifiers = ts.getModifiers(node)
        if (modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) {
          componentName = node.name.text
        }
      }

      // Look for export default
      if (ts.isExportAssignment(node) && !node.isExportEquals) {
        if (ts.isIdentifier(node.expression)) {
          componentName = node.expression.text
        }
      }

      // Look for named exports
      if (ts.isVariableStatement(node)) {
        const modifiers = ts.getModifiers(node)
        if (modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) {
          node.declarationList.declarations.forEach((decl) => {
            if (ts.isIdentifier(decl.name)) {
              // Prefer component-like names (PascalCase)
              const name = decl.name.text
              if (name[0] === name[0]?.toUpperCase()) {
                componentName = name
              }
            }
          })
        }
      }

      ts.forEachChild(node, visit)
    }

    visit(sourceFile)
    return componentName
  }

  /**
   * Extract prop definitions from TypeScript interfaces
   */
  private extractProps(sourceFile: ts.SourceFile): PropDefinition[] {
    const props: PropDefinition[] = []
    const propInterfaces = new Set<string>()

    // Find prop interface names (commonly named ComponentProps, ComponentNameProps, Props)
    const visit = (node: ts.Node) => {
      // Look for interface declarations
      if (ts.isInterfaceDeclaration(node)) {
        const name = node.name.text
        if (name.endsWith('Props') || name === 'Props') {
          propInterfaces.add(name)
          this.extractPropsFromInterface(node, props)
        }
      }

      // Look for type aliases
      if (ts.isTypeAliasDeclaration(node)) {
        const name = node.name.text
        if (name.endsWith('Props') || name === 'Props') {
          propInterfaces.add(name)
          if (ts.isTypeLiteralNode(node.type)) {
            this.extractPropsFromTypeLiteral(node.type, props)
          }
        }
      }

      // Look for function parameters with inline types
      if (ts.isFunctionDeclaration(node) || ts.isArrowFunction(node)) {
        if (node.parameters.length > 0) {
          const firstParam = node.parameters[0]
          if (firstParam?.type && ts.isTypeLiteralNode(firstParam.type)) {
            this.extractPropsFromTypeLiteral(firstParam.type, props)
          }
        }
      }

      ts.forEachChild(node, visit)
    }

    visit(sourceFile)
    return props
  }

  /**
   * Extract props from interface declaration
   */
  private extractPropsFromInterface(node: ts.InterfaceDeclaration, props: PropDefinition[]) {
    node.members.forEach((member) => {
      if (ts.isPropertySignature(member) && member.name) {
        const propName = member.name.getText()
        const propType = member.type ? member.type.getText() : 'any'
        const required = !member.questionToken
        const defaultValue = this.extractDefaultValue(member)

        props.push({
          name: propName,
          type: propType,
          required,
          defaultValue,
        })
      }
    })
  }

  /**
   * Extract props from type literal
   */
  private extractPropsFromTypeLiteral(node: ts.TypeLiteralNode, props: PropDefinition[]) {
    node.members.forEach((member) => {
      if (ts.isPropertySignature(member) && member.name) {
        const propName = member.name.getText()
        const propType = member.type ? member.type.getText() : 'any'
        const required = !member.questionToken
        const defaultValue = this.extractDefaultValue(member)

        props.push({
          name: propName,
          type: propType,
          required,
          defaultValue,
        })
      }
    })
  }

  /**
   * Extract default value from property signature
   */
  private extractDefaultValue(_member: ts.PropertySignature): any {
    // TypeScript interfaces don't have default values
    // This would need to be extracted from destructuring in function parameters
    return undefined
  }

  /**
   * Extract imports from the file
   */
  private extractImports(sourceFile: ts.SourceFile): Import[] {
    const imports: Import[] = []

    const visit = (node: ts.Node) => {
      if (ts.isImportDeclaration(node)) {
        const moduleSpecifier = node.moduleSpecifier
        if (ts.isStringLiteral(moduleSpecifier)) {
          const source = moduleSpecifier.text
          const specifiers: string[] = []
          let isDefault = false

          if (node.importClause) {
            // Default import
            if (node.importClause.name) {
              specifiers.push(node.importClause.name.text)
              isDefault = true
            }

            // Named imports
            if (node.importClause.namedBindings) {
              if (ts.isNamedImports(node.importClause.namedBindings)) {
                node.importClause.namedBindings.elements.forEach((element) => {
                  specifiers.push(element.name.text)
                })
              }
              // Namespace import
              if (ts.isNamespaceImport(node.importClause.namedBindings)) {
                specifiers.push(node.importClause.namedBindings.name.text)
              }
            }
          }

          imports.push({
            source,
            specifiers,
            isDefault,
          })
        }
      }

      ts.forEachChild(node, visit)
    }

    visit(sourceFile)
    return imports
  }

  /**
   * Extract exports from the file
   */
  private extractExports(sourceFile: ts.SourceFile): Export[] {
    const exports: Export[] = []

    const visit = (node: ts.Node) => {
      // Default export
      if (ts.isExportAssignment(node) && !node.isExportEquals) {
        if (ts.isIdentifier(node.expression)) {
          exports.push({
            name: node.expression.text,
            isDefault: true,
          })
        } else {
          exports.push({
            name: 'default',
            isDefault: true,
          })
        }
      }

      // Named exports
      if (ts.isFunctionDeclaration(node) && node.name) {
        const modifiers = ts.getModifiers(node)
        if (modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) {
          const isDefault = modifiers.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword)
          exports.push({
            name: node.name.text,
            isDefault,
          })
        }
      }

      // Variable exports
      if (ts.isVariableStatement(node)) {
        const modifiers = ts.getModifiers(node)
        if (modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) {
          node.declarationList.declarations.forEach((decl) => {
            if (ts.isIdentifier(decl.name)) {
              exports.push({
                name: decl.name.text,
                isDefault: false,
              })
            }
          })
        }
      }

      ts.forEachChild(node, visit)
    }

    visit(sourceFile)
    return exports
  }

  /**
   * Extract JSX elements from the component
   */
  private extractJSXElements(sourceFile: ts.SourceFile): JSXElement[] {
    const elements: JSXElement[] = []

    const extractJSXElement = (node: ts.JsxElement | ts.JsxSelfClosingElement): JSXElement => {
      let type = ''
      let props: Record<string, any> = {}
      let children: JSXElement[] = []
      const line = sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1

      if (ts.isJsxElement(node)) {
        type = node.openingElement.tagName.getText()
        props = this.extractJSXProps(node.openingElement.attributes)
        children = node.children
          .filter((child) => ts.isJsxElement(child) || ts.isJsxSelfClosingElement(child))
          .map((child) => extractJSXElement(child as ts.JsxElement | ts.JsxSelfClosingElement))
      } else if (ts.isJsxSelfClosingElement(node)) {
        type = node.tagName.getText()
        props = this.extractJSXProps(node.attributes)
      }

      return {
        type,
        props,
        children,
        line,
      }
    }

    const visit = (node: ts.Node) => {
      if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
        elements.push(extractJSXElement(node))
      }
      ts.forEachChild(node, visit)
    }

    visit(sourceFile)
    return elements
  }

  /**
   * Extract props from JSX attributes
   */
  private extractJSXProps(attributes: ts.JsxAttributes): Record<string, any> {
    const props: Record<string, any> = {}

    attributes.properties.forEach((prop) => {
      if (ts.isJsxAttribute(prop) && prop.name) {
        const name = ts.isIdentifier(prop.name) ? prop.name.text : prop.name.getText()
        let value: any = true // Boolean attribute

        if (prop.initializer) {
          if (ts.isStringLiteral(prop.initializer)) {
            value = prop.initializer.text
          } else if (ts.isJsxExpression(prop.initializer)) {
            value = prop.initializer.expression?.getText() || null
          }
        }

        props[name] = value
      }
    })

    return props
  }

  /**
   * Extract React hooks usage
   */
  private extractReactHooks(sourceFile: ts.SourceFile): ReactHook[] {
    const hooks: ReactHook[] = []
    const hookNames = [
      'useState',
      'useEffect',
      'useContext',
      'useReducer',
      'useCallback',
      'useMemo',
      'useRef',
      'useImperativeHandle',
      'useLayoutEffect',
      'useDebugValue',
      'useTransition',
      'useDeferredValue',
      'useId',
    ]

    const visit = (node: ts.Node) => {
      if (ts.isCallExpression(node)) {
        const expression = node.expression
        if (ts.isIdentifier(expression)) {
          const name = expression.text
          if (hookNames.includes(name)) {
            const line = sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1
            hooks.push({
              name,
              line,
            })
          }
        }
      }
      ts.forEachChild(node, visit)
    }

    visit(sourceFile)
    return hooks
  }
}
