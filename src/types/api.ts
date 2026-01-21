// API-related types
// This file will contain type definitions for API requests and responses

// Common API response structure
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}

// Additional API-specific types will be defined here
