export interface PreviewModeIndicatorProps {
  className?: string
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  showMetrics?: boolean
  showErrors?: boolean
  compact?: boolean
}

export interface ConnectionStatus {
  text: string
  color: string
  bgColor: string
}
