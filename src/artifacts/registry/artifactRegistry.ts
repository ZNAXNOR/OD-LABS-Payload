import { stackListFields } from '../components/stackList/config'
import { processFlowFields } from '../components/processFlow/config'
import { codeSnippetFields } from '../components/codeSnippet/config'
import { architectureDiagramFields } from '../components/architectureDiagram/config'

import { StackListArtifact } from '../components/stackList/Component'
import { ProcessFlowArtifact } from '../components/processFlow/Component'
import { CodeSnippetArtifact } from '../components/codeSnippet/Component'
import { ArchitectureDiagramArtifact } from '../components/architectureDiagram/Component'

export const artifactRegistry = {
  stackList: {
    label: 'Stack List',
    component: StackListArtifact,
    fields: stackListFields,
  },

  processFlow: {
    label: 'Process Flow',
    component: ProcessFlowArtifact,
    fields: processFlowFields,
  },

  codeSnippet: {
    label: 'Code Snippet',
    component: CodeSnippetArtifact,
    fields: codeSnippetFields,
  },

  ad: {
    label: 'Architecture Diagram',
    component: ArchitectureDiagramArtifact,
    fields: architectureDiagramFields,
  },
}
