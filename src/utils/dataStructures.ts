import type { ITextEditor, IMemoryTrackedEditor } from '../types'

// 1. Array-based text editor
export class ArrayBasedEditor implements ITextEditor {
  private content: string[] = []
  private cursor: number = 0
  private operationCount: number = 0
  private lastOperation: string = ''

  constructor(initialText: string = '') {
    this.content = initialText.split('')
  }

  insert(char: string): void {
    this.content.splice(this.cursor, 0, char)
    this.cursor++
    this.addOperation(`Inserted '${char}'`)
  }

  delete(): void {
    if (this.cursor > 0) {
      this.content.splice(this.cursor - 1, 1)
      this.cursor--
      this.addOperation('Deleted character')
    }
  }

  deleteRight(): void {
    if (this.cursor < this.content.length) {
      this.content.splice(this.cursor, 1)
      this.addOperation('Deleted character to the right')
    }
  }

  moveLeft(): void {
    if (this.cursor > 0) {
      this.cursor--
      this.addOperation('Moved cursor left')
    }
  }

  moveRight(): void {
    if (this.cursor < this.content.length) {
      this.cursor++
      this.addOperation('Moved cursor right')
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
    this.operationCount++
    this.lastOperation = 'Cleared all text'
  }

  getOperationCount(): number {
    return this.operationCount
  }

  getLastOperation(): string {
    return this.lastOperation
  }

  resetOperationTracking(): void {
    this.operationCount = 0
    this.lastOperation = ''
  }

  private addOperation(description: string): void {
    this.operationCount++
    this.lastOperation = description
  }
}

// 2. Linked List-based text editor with multi-character nodes
export class ListNode {
  chars: string[] = []
  next: ListNode | null = null
  prev: ListNode | null = null
  private maxChars: number = 5 // Maximum characters per node

  constructor(initialChars: string = '') {
    this.chars = initialChars.split('')
  }

  addChar(char: string): boolean {
    if (this.chars.length < this.maxChars) {
      this.chars.push(char)
      return true
    }
    return false // Node is full
  }

  insertCharAt(char: string, index: number): void {
    this.chars.splice(index, 0, char)
  }

  deleteCharAt(index: number): string | null {
    if (index >= 0 && index < this.chars.length) {
      return this.chars.splice(index, 1)[0]
    }
    return null
  }

  isFull(): boolean {
    return this.chars.length >= this.maxChars
  }

  isEmpty(): boolean {
    return this.chars.length === 0
  }

  getLength(): number {
    return this.chars.length
  }

  getText(): string {
    return this.chars.join('')
  }
}

export class LinkedListEditor implements IMemoryTrackedEditor {
  private head: ListNode | null = null
  private tail: ListNode | null = null
  private cursorNode: ListNode | null = null
  private cursorIndex: number = 0 // Index within the current node
  private size: number = 0
  private operationCount: number = 0
  private lastOperation: string = ''

  constructor(initialText: string = '') {
    if (initialText) {
      for (const char of initialText) {
        this.insert(char)
      }
    }
  }

  private createNode(): ListNode {
    return new ListNode()
  }

  insert(char: string): void {
    if (!this.head) {
      // First node
      this.head = this.createNode()
      this.tail = this.head
      this.cursorNode = this.head
      this.cursorIndex = 0
    }

    if (!this.cursorNode) {
      // Cursor at beginning, create new head
      const newNode = this.createNode()
      newNode.next = this.head
      if (this.head) {
        this.head.prev = newNode
      }
      this.head = newNode
      this.cursorNode = newNode
      this.cursorIndex = 0
    }

    // Try to insert in current node
    if (!this.cursorNode.isFull()) {
      // Insert at cursor position within node
      this.cursorNode.insertCharAt(char, this.cursorIndex)
      this.cursorIndex++
      this.size++
      this.addOperation(`Inserted '${char}'`)
    } else {
      // Current node is full, need to split or create new node
      if (this.cursorIndex === this.cursorNode.getLength()) {
        // At end of node, create new node
        const newNode = this.createNode()
        newNode.addChar(char)
        
        // Link new node
        newNode.next = this.cursorNode.next
        newNode.prev = this.cursorNode
        if (this.cursorNode.next) {
          this.cursorNode.next.prev = newNode
        } else {
          this.tail = newNode
        }
        this.cursorNode.next = newNode
        
        // Move cursor to new node
        this.cursorNode = newNode
        this.cursorIndex = 1
        this.size++
        this.addOperation(`Inserted '${char}' (new node)`)
      } else {
        // Need to split the current node
        const newNode = this.createNode()
        const charsToMove = this.cursorNode.chars.slice(this.cursorIndex)
        this.cursorNode.chars = this.cursorNode.chars.slice(0, this.cursorIndex)
        
        // Add new character and remaining chars to new node
        newNode.chars = [char, ...charsToMove]
        
        // Link new node
        newNode.next = this.cursorNode.next
        newNode.prev = this.cursorNode
        if (this.cursorNode.next) {
          this.cursorNode.next.prev = newNode
        } else {
          this.tail = newNode
        }
        this.cursorNode.next = newNode
        
        // Move cursor to new node
        this.cursorNode = newNode
        this.cursorIndex = 1
        this.size++
      }
    }
  }

  delete(): void {
    if (!this.cursorNode || this.cursorIndex === 0) {
      // Try to move to previous node
      if (this.cursorNode && this.cursorNode.prev) {
        this.cursorNode = this.cursorNode.prev
        this.cursorIndex = this.cursorNode.getLength()
        this.delete()
      }
      return
    }

    const deletedChar = this.cursorNode.deleteCharAt(this.cursorIndex - 1)
    if (deletedChar) {
      this.cursorIndex--
      this.size--
      this.addOperation('Deleted character')
      
      // If node becomes empty and it's not the only node, remove it
      if (this.cursorNode.isEmpty() && this.head !== this.tail) {
        if (this.cursorNode.prev) {
          this.cursorNode.prev.next = this.cursorNode.next
        } else {
          this.head = this.cursorNode.next
        }
        
        if (this.cursorNode.next) {
          this.cursorNode.next.prev = this.cursorNode.prev
        } else {
          this.tail = this.cursorNode.prev
        }
        
        // Move cursor to previous node
        if (this.cursorNode.prev) {
          this.cursorNode = this.cursorNode.prev
          this.cursorIndex = this.cursorNode.getLength()
        } else if (this.cursorNode.next) {
          this.cursorNode = this.cursorNode.next
          this.cursorIndex = 0
        } else {
          this.cursorNode = null
          this.cursorIndex = 0
        }
      }
    }
  }

  deleteRight(): void {
    if (!this.cursorNode || this.cursorIndex >= this.cursorNode.getLength()) {
      // Try to move to next node
      if (this.cursorNode && this.cursorNode.next) {
        this.cursorNode = this.cursorNode.next
        this.cursorIndex = 0
        this.deleteRight()
      }
      return
    }

    const deletedChar = this.cursorNode.deleteCharAt(this.cursorIndex)
    if (deletedChar) {
      this.size--
      this.addOperation('Deleted character to the right')
      
      // If node becomes empty and it's not the only node, remove it
      if (this.cursorNode.isEmpty() && this.head !== this.tail) {
        if (this.cursorNode.prev) {
          this.cursorNode.prev.next = this.cursorNode.next
        } else {
          this.head = this.cursorNode.next
        }
        
        if (this.cursorNode.next) {
          this.cursorNode.next.prev = this.cursorNode.prev
        } else {
          this.tail = this.cursorNode.prev
        }
        
        // Move cursor to next node
        if (this.cursorNode.next) {
          this.cursorNode = this.cursorNode.next
          this.cursorIndex = 0
        } else if (this.cursorNode.prev) {
          this.cursorNode = this.cursorNode.prev
          this.cursorIndex = this.cursorNode.getLength()
        } else {
          this.cursorNode = null
          this.cursorIndex = 0
        }
      }
    }
  }

  moveLeft(): void {
    if (this.cursorIndex > 0) {
      this.cursorIndex--
      this.addOperation('Moved cursor left')
    } else if (this.cursorNode && this.cursorNode.prev) {
      this.cursorNode = this.cursorNode.prev
      this.cursorIndex = this.cursorNode.getLength()
      this.addOperation('Moved cursor left (to previous node)')
    }
  }

  moveRight(): void {
    if (this.cursorNode && this.cursorIndex < this.cursorNode.getLength()) {
      this.cursorIndex++
      this.addOperation('Moved cursor right')
    } else if (this.cursorNode && this.cursorNode.next) {
      this.cursorNode = this.cursorNode.next
      this.cursorIndex = 0
      this.addOperation('Moved cursor right (to next node)')
    }
  }

  getText(): string {
    let result = ''
    let current = this.head
    while (current) {
      result += current.getText()
      current = current.next
    }
    return result
  }

  getCursor(): number {
    let count = 0
    let current = this.head
    
    while (current && current !== this.cursorNode) {
      count += current.getLength()
      current = current.next
    }
    
    if (this.cursorNode) {
      count += this.cursorIndex
    }
    
    return count
  }

  getOperations(): string[] {
    const result: string[] = []
    let current = this.head
    
    while (current) {
      // Add characters in the node
      for (let i = 0; i < current.chars.length; i++) {
        if (current === this.cursorNode && i === this.cursorIndex) {
          result.push(`[${current.chars[i]}]`) // Cursor position
        } else {
          result.push(current.chars[i])
        }
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
    let nodeCount = 0
    let current = this.head
    while (current) {
      nodeCount++
      current = current.next
    }
    return this.size + (nodeCount * 2) // chars + next/prev pointers per node
  }

  clear(): void {
    this.head = null
    this.tail = null
    this.cursorNode = null
    this.cursorIndex = 0
    this.size = 0
    this.operationCount++
    this.lastOperation = 'Cleared all text'
  }

  getOperationCount(): number {
    return this.operationCount
  }

  getLastOperation(): string {
    return this.lastOperation
  }

  resetOperationTracking(): void {
    this.operationCount = 0
    this.lastOperation = ''
  }

  private addOperation(description: string): void {
    this.operationCount++
    this.lastOperation = description
  }
}

// 3. Gap Buffer-based text editor
export class GapBufferEditor implements IMemoryTrackedEditor {
  private beforeGap: string[] = []
  private afterGap: string[] = []
  private gapSize: number = 10
  private gapUsed: number = 0 // How much of the gap has been used
  private operationCount: number = 0
  private lastOperation: string = ''
  private expansionFactor: number = 2 // Default multiplication factor

  constructor(initialText: string = '') {
    this.beforeGap = initialText.split('')
    this.afterGap = []
  }

  setExpansionFactor(factor: number): void {
    this.expansionFactor = Math.max(1, factor) // Ensure factor is at least 1
  }

  getExpansionFactor(): number {
    return this.expansionFactor
  }

  private expandGap(): void {
    const newGapSize = this.gapSize * this.expansionFactor
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
    this.addOperation(`Inserted '${char}'`)
  }

  delete(): void {
    if (this.beforeGap.length > 0) {
      this.beforeGap.pop()
      this.gapUsed--
      this.addOperation('Deleted character')
    }
  }

  deleteRight(): void {
    // Find the first non-undefined character in afterGap
    let charIndex = 0
    while (charIndex < this.afterGap.length && this.afterGap[charIndex] === undefined) {
      charIndex++
    }
    
    if (charIndex < this.afterGap.length) {
      // Remove the character from afterGap
      this.afterGap.splice(charIndex, 1)
      this.addOperation('Deleted character to the right')
    }
  }

  moveLeft(): void {
    if (this.beforeGap.length > 0) {
      const char = this.beforeGap.pop()!
      this.afterGap.unshift(char)
      // Moving left doesn't change gap usage - we're just moving the gap
      this.addOperation('Moved cursor left')
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
      this.addOperation('Moved cursor right')
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

  getGapInfo(): { gapSize: number; gapUsed: number; expansionFactor: number } {
    return { gapSize: this.gapSize, gapUsed: this.gapUsed, expansionFactor: this.expansionFactor }
  }

  clear(): void {
    this.beforeGap = []
    this.afterGap = []
    this.gapUsed = 0
    this.operationCount++
    this.lastOperation = 'Cleared all text'
  }

  getOperationCount(): number {
    return this.operationCount
  }

  getLastOperation(): string {
    return this.lastOperation
  }

  resetOperationTracking(): void {
    this.operationCount = 0
    this.lastOperation = ''
  }

  private addOperation(description: string): void {
    this.operationCount++
    this.lastOperation = description
  }
} 