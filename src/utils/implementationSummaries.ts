import type { EditorType } from '../types'

export interface ImplementationSummaryData {
  type: EditorType
  title: string
  description: string
  gifUrl: string
  complexity: {
    insert: string
    delete: string
    move: string
    memory: string
  }
  pros: string[]
  cons: string[]
  useCases: string[]
}

export const IMPLEMENTATION_SUMMARIES: Record<EditorType, ImplementationSummaryData> = {
  introduction: {
    type: 'introduction',
    title: 'Introduction',
    description: 'Welcome to the Text Editor Data Structure Demo!',
    gifUrl: '/gifs/intro.gif',
    complexity: {
      insert: 'N/A',
      delete: 'N/A',
      move: 'N/A',
      memory: 'N/A'
    },
    pros: [],
    cons: [],
    useCases: []
  },
  array: {
    type: 'array',
    title: 'Array-Based Implementation',
    description: 'A simple array where each character is stored in a contiguous block of memory. Insertions and deletions require shifting all subsequent characters.',
    gifUrl: '/gifs/array-insertion.gif',
    complexity: {
      insert: 'O(n)',
      delete: 'O(n)',
      move: 'O(1)',
      memory: 'O(n)'
    },
    pros: [
      'Simple and intuitive implementation',
      'Fast random access to any character',
      'Memory efficient for small texts',
      'Easy to understand and debug'
    ],
    cons: [
      'Slow insertions and deletions (O(n))',
      'Requires shifting characters for every edit',
      'Poor performance with large texts',
      'Memory reallocation on growth'
    ],
    useCases: [
      'Small text documents',
      'Read-heavy applications',
      'Educational purposes',
      'Simple text processing'
    ]
  },
  linkedlist: {
    type: 'linkedlist',
    title: 'Linked List Implementation',
    description: 'A doubly-linked list of nodes, where each node contains multiple characters. Insertions and deletions are fast, but traversal can be slower.',
    gifUrl: '/gifs/linkedlist-insertion.gif',
    complexity: {
      insert: 'O(1)',
      delete: 'O(1)',
      move: 'O(n)',
      memory: 'O(n) + overhead'
    },
    pros: [
      'Fast insertions and deletions (O(1))',
      'No shifting required for edits',
      'Dynamic memory allocation',
      'Efficient for frequent edits'
    ],
    cons: [
      'Slower traversal (O(n))',
      'Memory overhead from pointers',
      'No random access',
      'More complex implementation'
    ],
    useCases: [
      'Frequently edited documents',
      'Real-time text editors',
      'Collaborative editing',
      'Large documents with many edits'
    ]
  },
  gapbuffer: {
    type: 'gapbuffer',
    title: 'Gap Buffer Implementation',
    description: 'Two arrays separated by a gap. The cursor position is at the gap, making insertions and deletions very efficient at the cursor location.',
    gifUrl: '/gifs/gapbuffer-insertion.gif',
    complexity: {
      insert: 'O(1)',
      delete: 'O(1)',
      move: 'O(1) amortized',
      memory: 'O(n) + gap'
    },
    pros: [
      'Very fast insertions and deletions at cursor',
      'Efficient cursor movement',
      'Good balance of performance and memory',
      'Used in many real text editors'
    ],
    cons: [
      'Gap expansion overhead',
      'Memory waste from gap',
      'Complex implementation',
      'Poor performance when gap is exhausted'
    ],
    useCases: [
      'Professional text editors',
      'Code editors (VS Code, Sublime)',
      'Large document editing',
      'High-performance text processing'
    ]
  }
} 