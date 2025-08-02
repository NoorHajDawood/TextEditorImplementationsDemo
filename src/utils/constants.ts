import type { TabConfig } from '../types'

export const TAB_CONFIG: TabConfig[] = [
  {
    id: 'array',
    title: 'Array-Based Editor',
    description: 'Simple array implementation where insertions and deletions require shifting elements. O(n) time complexity for insertions/deletions in the middle.'
  },
  {
    id: 'linkedlist',
    title: 'Linked List-Based Editor',
    description: 'Linked list implementation with O(1) insertions/deletions but higher memory overhead due to pointer storage.'
  },
  {
    id: 'gapbuffer',
    title: 'Gap Buffer Editor',
    description: 'Efficient implementation using a gap buffer. O(1) insertions/deletions at cursor position, with amortized O(1) cursor movement.'
  }
]

export const PRESET_TEXTS = ['Hello', 'World', 'Data Structures'] as const

export const ANIMATION_DELAY = 100 // milliseconds 