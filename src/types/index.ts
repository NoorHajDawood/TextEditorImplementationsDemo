// Core editor types
export type EditorType = 'introduction' | 'array' | 'linkedlist' | 'gapbuffer'

// Base editor interface that all implementations must follow
export interface ITextEditor {
  insert(char: string): void
  delete(): void
  deleteRight(): void
  moveLeft(): void
  moveRight(): void
  getText(): string
  getCursor(): number
  getOperations(): string[]
  clear(): void
  getOperationCount(): number
  getLastOperation(): string
  resetOperationTracking(): void
}

// Extended interface for editors that track memory usage
export interface IMemoryTrackedEditor extends ITextEditor {
  getMemoryUsage(): number
}

// Tab configuration interface
export interface TabConfig {
  id: EditorType
  title: string
  description: string
}

// Operation tracking interface
export interface OperationState {
  count: number
  lastOperation: string
  isAnimating: boolean
  operationType: 'insert' | 'delete' | null
}

// Animation state interface
export interface AnimationState {
  isAnimating: boolean
  shiftingIndex: number | null
  operationType: 'insert' | 'delete' | null
} 