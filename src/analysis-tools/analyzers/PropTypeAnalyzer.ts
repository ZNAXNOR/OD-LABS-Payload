/**
 * Prop Type Analyzer
 * Analyzes React component prop types for type safety issues
 * Detects missing types, weak types, and usage of 'any' or 'unknown' without guards
 */

import * as ts from 'typescript'
import type { Component, PropDefinition, TypingIssue } from '../types'

export class PropTypeAnalyzer {
  /**
   * Analyze prop types in a component
   */
  checkPropTypes(component: Component): TypingIssue[] {
    const issues: TypingIssue[] = []

    // Check if component has any props defined
    if (component.props.length === 0) {
      // Check if component actually uses props
      if (this.componentUsesProps(component)) {
        issues.push({
          type: 'weak-typing',
          location: `Component: ${component.name}`,
          suggestion:
            'Component appears to use props but has no prop type definitions. Define a Props interface or type.',
        })
      }
    }

    // Check each prop for type issues
    component.props.forEach((prop) => {
      const propIssues = this.analyzePropType(prop, component.name)
      issues.push(...propIssues)
    })

    // Check for 'any' usage in the AST
    if (component.ast) {
      const anyUsageIssues = this.findAnyUsage(component.ast, component.name)
      issues.push(...anyUsageIssues)
    }

    return issues
  }

  /**
   * Analyze a single prop type
   */
  private analyzePropType(prop: PropDefinition, componentName: string): TypingIssue[] {
    const issues: TypingIssue[] = []

    // Check for 'any' type
    if (prop.type === 'any') {
      issues.push({
        type: 'any-type',
        location: `${componentName}.${prop.name}`,
        suggestion: `Prop '${prop.name}' uses 'any' type. Specify a concrete type for better type safety.`,
      })
    }

    // Check for 'unknown' without type guards
    if (prop.type === 'unknown') {
      issues.push({
        type: 'weak-typing',
        location: `${componentName}.${prop.name}`,
        suggestion: `Prop '${prop.name}' uses 'unknown' type. Ensure proper type guards are used when accessing this prop.`,
      })
    }

    // Check for weak object types
    if (prop.type === 'object' || prop.type === 'Object') {
      issues.push({
        type: 'weak-typing',
        location: `${componentName}.${prop.name}`,
        suggestion: `Prop '${prop.name}' uses generic 'object' type. Define a specific interface or type for better type safety.`,
      })
    }

    // Check for Function type (should use specific function signature)
    if (prop.type === 'Function' || prop.type === 'function') {
      issues.push({
        type: 'weak-typing',
        location: `${componentName}.${prop.name}`,
        suggestion: `Prop '${prop.name}' uses generic 'Function' type. Define a specific function signature like '(arg: Type) => ReturnType'.`,
      })
    }

    // Check for array without element type
    if (prop.type === 'Array' || prop.type === 'array' || prop.type === '[]') {
      issues.push({
        type: 'weak-typing',
        location: `${componentName}.${prop.name}`,
        suggestion: `Prop '${prop.name}' uses untyped array. Specify element type like 'string[]' or 'Array<Type>'.`,
      })
    }

    return issues
  }

  /**
   * Check if component uses props (looks for destructuring or props parameter)
   */
  private componentUsesProps(component: Component): boolean {
    if (!component.ast) return false

    let usesProps = false

    const visit = (node: ts.Node) => {
      // Check function declarations and arrow functions
      if (
        (ts.isFunctionDeclaration(node) ||
          ts.isArrowFunction(node) ||
          ts.isFunctionExpression(node)) &&
        node.parameters.length > 0
      ) {
        const firstParam = node.parameters[0]

        // Check if parameter is named 'props' or uses destructuring
        if (firstParam && ts.isIdentifier(firstParam.name)) {
          if (firstParam.name.text === 'props') {
            usesProps = true
          }
        } else if (firstParam && ts.isObjectBindingPattern(firstParam.name)) {
          // Component uses destructured props
          usesProps = true
        }
      }

      ts.forEachChild(node, visit)
    }

    visit(component.ast)
    return usesProps
  }

  /**
   * Find usage of 'any' type in the component
   */
  private findAnyUsage(ast: ts.SourceFile, componentName: string): TypingIssue[] {
    const issues: TypingIssue[] = []

    const visit = (node: ts.Node) => {
      // Check for 'any' keyword in type annotations
      if (node.kind === ts.SyntaxKind.AnyKeyword) {
        const parent = node.parent
        let location = componentName

        // Try to get more specific location
        if (parent) {
          if (ts.isParameter(parent) && parent.name && ts.isIdentifier(parent.name)) {
            location = `${componentName}.${parent.name.text}`
          } else if (
            ts.isVariableDeclaration(parent) &&
            parent.name &&
            ts.isIdentifier(parent.name)
          ) {
            location = `${componentName}.${parent.name.text}`
          } else if (ts.isPropertySignature(parent) && parent.name) {
            location = `${componentName}.${parent.name.getText()}`
          }
        }

        issues.push({
          type: 'any-type',
          location,
          suggestion: `Replace 'any' type with a specific type for better type safety.`,
        })
      }

      ts.forEachChild(node, visit)
    }

    visit(ast)
    return issues
  }

  /**
   * Suggest improvements for prop types
   */
  suggestImprovements(component: Component): string[] {
    const suggestions: string[] = []

    // Suggest adding prop interface if missing
    if (component.props.length === 0 && this.componentUsesProps(component)) {
      suggestions.push(
        `Define a Props interface for ${component.name}:\n` +
          `interface ${component.name}Props {\n` +
          `  // Define your props here\n` +
          `}`,
      )
    }

    // Suggest using TypeScript utility types
    const hasOptionalProps = component.props.some((p) => !p.required)
    const hasRequiredProps = component.props.some((p) => p.required)

    if (hasOptionalProps && hasRequiredProps) {
      suggestions.push(
        `Consider using TypeScript utility types like Partial<T> or Required<T> for flexible prop definitions.`,
      )
    }

    // Suggest using discriminated unions for variant props
    const hasVariantLikeProps = component.props.some(
      (p) => p.name === 'variant' || p.name === 'type' || p.name === 'kind',
    )
    if (hasVariantLikeProps) {
      suggestions.push(
        `Consider using discriminated unions for variant props to ensure type safety across different component states.`,
      )
    }

    return suggestions
  }

  /**
   * Check for missing prop validation in runtime
   */
  checkRuntimeValidation(component: Component): TypingIssue[] {
    const issues: TypingIssue[] = []

    // Check if component has required props but no runtime validation
    const requiredProps = component.props.filter((p) => p.required)

    if (requiredProps.length > 0 && !this.hasRuntimeValidation(component)) {
      issues.push({
        type: 'weak-typing',
        location: component.name,
        suggestion:
          `Component has ${requiredProps.length} required props but no runtime validation. ` +
          `Consider adding PropTypes or runtime checks for production safety.`,
      })
    }

    return issues
  }

  /**
   * Check if component has runtime validation (PropTypes, zod, etc.)
   */
  private hasRuntimeValidation(component: Component): boolean {
    // Check imports for validation libraries
    const validationLibraries = ['prop-types', 'zod', 'yup', 'joi', 'io-ts']

    return component.imports.some((imp) =>
      validationLibraries.some((lib) => imp.source.includes(lib)),
    )
  }

  /**
   * Detect complex prop types that might benefit from extraction
   */
  detectComplexTypes(component: Component): string[] {
    const suggestions: string[] = []

    component.props.forEach((prop) => {
      // Check for inline union types with many options
      if (prop.type.includes('|')) {
        const unionCount = prop.type.split('|').length
        if (unionCount > 3) {
          suggestions.push(
            `Prop '${prop.name}' has a complex union type with ${unionCount} options. ` +
              `Consider extracting to a named type for better readability.`,
          )
        }
      }

      // Check for nested object types
      if (prop.type.includes('{') && prop.type.includes('}')) {
        suggestions.push(
          `Prop '${prop.name}' has an inline object type. ` +
            `Consider extracting to a named interface for better reusability.`,
        )
      }

      // Check for function types with many parameters
      if (prop.type.includes('=>') && prop.type.split(',').length > 3) {
        suggestions.push(
          `Prop '${prop.name}' has a complex function signature. ` +
            `Consider extracting to a named type for better readability.`,
        )
      }
    })

    return suggestions
  }
}
