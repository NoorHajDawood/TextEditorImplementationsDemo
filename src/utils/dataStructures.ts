import type { ITextEditor, IMemoryTrackedEditor } from '../types'

// 1. Array-based text editor
export class ArrayBasedEditor implements ITextEditor {
  private content: string[] = []
  private cursor: number = 0

  constructor(initialText: string = '') {
    this.content = initialText.split('')
  }

  insert(char: string): void {
    this.content.splice(this.cursor, 0, char)
    this.cursor++
  }

  delete(): void {
    if (this.cursor > 0) {
      this.content.splice(this.cursor - 1, 1)
      this.cursor--
    }
  }

  moveLeft(): void {
    if (this.cursor > 0) {
      this.cursor--
    }
  }

  moveRight(): void {
    if (this.cursor < this.content.length) {
      this.cursor++
    }
  }

  getText(): string {
    return this.content.join('')
  }

  getCursor(): number {
    return this.cursor
  }

  getOperations(): string[] {
    const result: string[] = []
    const maxLength = Math.max(this.content.length, 100) // Show 100 slots
    
    for (let i = 0; i < maxLength; i++) {
      if (i < this.content.length) {
        if (i === this.cursor) {
          result.push(`[${this.content[i]}]`)
        } else {
          result.push(this.content[i])
        }
      } else {
        result.push('_') // Empty slot
      }
    }
    return result
  }

  clear(): void {
    this.content = []
    this.cursor = 0
  }
}

// 2. Linked List-based text editor
export class ListNode {
  char: string
  next: ListNode | null = null
  prev: ListNode | null = null

  constructor(char: string) {
    this.char = char
  }
}

export class LinkedListEditor implements IMemoryTrackedEditor {
  private head: ListNode | null = null
  private tail: ListNode | null = null
  private cursor: ListNode | null = null
  private size: number = 0

  constructor(initialText: string = '') {
    if (initialText) {
      for (const char of initialText) {
        this.insert(char)
      }
    }
  }

  insert(char: string): void {
    const newNode = new ListNode(char)
    
    if (!this.head) {
      this.head = newNode
      this.tail = newNode
      this.cursor = newNode
    } else if (!this.cursor) {
      // Insert at beginning
      newNode.next = this.head
      this.head.prev = newNode
      this.head = newNode
      this.cursor = newNode
    } else {
      // Insert after cursor
      newNode.next = this.cursor.next
      newNode.prev = this.cursor
      if (this.cursor.next) {
        this.cursor.next.prev = newNode
      } else {
        this.tail = newNode
      }
      this.cursor.next = newNode
      this.cursor = newNode
    }
    this.size++
  }

  delete(): void {
    if (!this.cursor) return
    
    if (this.cursor.prev) {
      this.cursor.prev.next = this.cursor.next
    } else {
      this.head = this.cursor.next
    }
    
    if (this.cursor.next) {
      this.cursor.next.prev = this.cursor.prev
    } else {
      this.tail = this.cursor.prev
    }
    
    const prevNode = this.cursor.prev
    this.cursor = prevNode
    this.size--
  }

  moveLeft(): void {
    if (this.cursor && this.cursor.prev) {
      this.cursor = this.cursor.prev
    }
  }

  moveRight(): void {
    if (this.cursor && this.cursor.next) {
      this.cursor = this.cursor.next
    }
  }

  getText(): string {
    let result = ''
    let current = this.head
    while (current) {
      result += current.char
      current = current.next
    }
    return result
  }

  getCursor(): number {
    let count = 0
    let current = this.head
    while (current && current !== this.cursor) {
      count++
      current = current.next
    }
    return count
  }

  getOperations(): string[] {
    const result: string[] = []
    let current = this.head
    
    while (current) {
      // Add the character (with cursor highlighting)
      if (current === this.cursor) {
        result.push(`[${current.char}]`)
      } else {
        result.push(current.char)
      }
      
      // Add pointer to next node (if not the last node)
      if (current.next) {
        result.push('→')
      }
      
      current = current.next
    }
    
    // Add empty array indices to show the full structure
    const totalLength = result.length
    const maxLength = Math.max(totalLength, 100) // Show 100 slots like array
    
    for (let i = totalLength; i < maxLength; i++) {
      result.push('_') // Empty array slot
    }
    
    return result
  }

  getMemoryUsage(): number {
    return this.size * 3 // Rough estimate: char + next + prev pointers
  }

  clear(): void {
    this.head = null
    this.tail = null
    this.cursor = null
    this.size = 0
  }
}

// 3. Gap Buffer-based text editor
export class GapBufferEditor implements IMemoryTrackedEditor {
  private beforeGap: string[] = []
  private afterGap: string[] = []
  private gapSize: number = 10
  private gapUsed: number = 0 // How much of the gap has been used

  constructor(initialText: string = '') {
    this.beforeGap = initialText.split('')
    this.afterGap = []
  }

  private expandGap(): void {
    const newGapSize = this.gapSize * 2
    const newAfterGap = new Array(newGapSize)
    
    // Copy existing afterGap to new larger gap
    for (let i = 0; i < this.afterGap.length; i++) {
      newAfterGap[i] = this.afterGap[i]
    }
    
    this.afterGap = newAfterGap
    this.gapSize = newGapSize
    this.gapUsed = 0 // Reset gap usage after expansion
  }

  insert(char: string): void {
    if (this.gapUsed >= this.gapSize) {
      // Gap is exhausted, need to expand
      this.expandGap()
    }
    
    // Insert the character into the gap
    this.beforeGap.push(char)
    this.gapUsed++
  }

  delete(): void {
    if (this.beforeGap.length > 0) {
      this.beforeGap.pop()
      this.gapUsed--
    }
  }

  moveLeft(): void {
    if (this.beforeGap.length > 0) {
      const char = this.beforeGap.pop()!
      this.afterGap.unshift(char)
      // Moving left doesn't change gap usage - we're just moving the gap
    }
  }

  moveRight(): void {
    // Find the first non-undefined character in afterGap
    let charIndex = 0
    while (charIndex < this.afterGap.length && this.afterGap[charIndex] === undefined) {
      charIndex++
    }
    
    if (charIndex < this.afterGap.length) {
      const char = this.afterGap[charIndex]
      // Remove the character from afterGap
      this.afterGap.splice(charIndex, 1)
      this.beforeGap.push(char)
      // Moving right doesn't change gap usage - we're just moving the gap
    }
  }

  getText(): string {
    const beforeText = this.beforeGap.join('')
    const afterText = this.afterGap.filter(char => char !== undefined).join('')
    return beforeText + afterText
  }

  getCursor(): number {
    return this.beforeGap.length
  }

  getOperations(): string[] {
    const result: string[] = []
    
    // Add characters before gap
    for (let i = 0; i < this.beforeGap.length; i++) {
      result.push(this.beforeGap[i])
    }
    
    // Add remaining gap slots (empty slots to show the gap)
    const remainingGapSize = this.gapSize - this.gapUsed
    for (let i = 0; i < remainingGapSize; i++) {
      result.push('_') // Empty gap slot
    }
    
    // Add characters after gap (only non-undefined values)
    for (let i = 0; i < this.afterGap.length; i++) {
      if (this.afterGap[i] !== undefined) {
        result.push(this.afterGap[i])
      }
    }
    
    // Add empty array indices to show the full array structure
    const totalLength = this.beforeGap.length + remainingGapSize + this.afterGap.length
    const maxLength = Math.max(totalLength, 100) // Show 100 slots like array
    
    for (let i = totalLength; i < maxLength; i++) {
      result.push('_') // Empty array slot
    }
    
    return result
  }

  getMemoryUsage(): number {
    const afterGapUsed = this.afterGap.filter(char => char !== undefined).length
    return this.beforeGap.length + afterGapUsed + this.gapSize
  }

  getGapInfo(): { gapSize: number; gapUsed: number } {
    return { gapSize: this.gapSize, gapUsed: this.gapUsed }
  }

  clear(): void {
    this.beforeGap = []
    this.afterGap = []
    this.gapUsed = 0
  }
} 