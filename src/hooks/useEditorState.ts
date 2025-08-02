import { useState, useCallback } from 'react'
import type { ITextEditor, EditorType } from '../types'

interface UseEditorStateProps {
  editor: ITextEditor
  type: EditorType
  textState: string
  setTextState: (text: string) => void
}

export const useEditorState = ({ editor, type, setTextState }: UseEditorStateProps) => {
  const [cursor, setCursor] = useState(0)
  const [operations, setOperations] = useState<string[]>([])
  const [memoryUsage, setMemoryUsage] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [operationCount, setOperationCount] = useState(0)
  const [lastOperation, setLastOperation] = useState<string>('')
  const [isAnimating, setIsAnimating] = useState(false)
  const [shiftingIndex, setShiftingIndex] = useState<number | null>(null)
  const [operationType, setOperationType] = useState<'insert' | 'delete' | null>(null)
  const [gapSize, setGapSize] = useState<number>(10)
  const [gapUsed, setGapUsed] = useState<number>(0)

  const updateDisplay = useCallback((operation?: string) => {
    const currentText = editor.getText()
    setTextState(currentText)
    setCursor(editor.getCursor())
    setOperations(editor.getOperations())
    // Type guard and call for getMemoryUsage
    if (
      typeof (editor as any).getMemoryUsage === 'function'
    ) {
      setMemoryUsage((editor as any).getMemoryUsage())
    }

    // Type guard and call for getGapInfo
    if (
      typeof (editor as any).getGapInfo === 'function'
    ) {
      const gapInfo = (editor as any).getGapInfo()
      setGapSize(gapInfo.gapSize)
      setGapUsed(gapInfo.gapUsed)
    }
    
    if (operation) {
      setLastOperation(operation) 
      setOperationCount(prev => prev + 1)
    }
  }, [editor, setTextState])

  const animateArrayInsertion = useCallback(async (char: string) => {
    setIsAnimating(true)
    setOperationType('insert')
    setInputValue('')
    
    const currentContent = editor.getText()
    const currentCursor = editor.getCursor()
    
    // Show the shifting animation
    for (let i = currentContent.length; i > currentCursor; i--) {
      setShiftingIndex(i)
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    editor.insert(char)
    setShiftingIndex(null)
    setOperationType(null)
    
    updateDisplay(`Inserted '${char}' (with shifting)`)
    setIsAnimating(false)
  }, [editor, updateDisplay])

  const animateGapBufferInsertion = useCallback(async (char: string) => {
    setIsAnimating(true)
    setOperationType('insert')
    setInputValue('')
    
    // Get current state before insertion
    const currentOperations = editor.getOperations()
    const currentCursor = editor.getCursor()
    
    // Check if the gap is exhausted using the actual gap info from the editor
    let currentGapSize = 10
    let currentGapUsed = currentCursor
    
    if (
      typeof (editor as any).getGapInfo === 'function'
    ) {
      const gapInfo = (editor as any).getGapInfo()
      currentGapSize = gapInfo.gapSize
      currentGapUsed = gapInfo.gapUsed
    }
    
    if (currentGapUsed >= currentGapSize) {
      // Gap is exhausted, show shifting animation
      const gapStartIndex = currentCursor
      
      // Animate characters shifting to make room in the gap
      // Show shifting animation for characters that need to move
      for (let i = gapStartIndex; i < currentOperations.length; i++) {
        if (currentOperations[i] !== '_') {
          setShiftingIndex(i)
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      }
      
      editor.insert(char)
      setShiftingIndex(null)
      setOperationType(null)
      
      updateDisplay(`Inserted '${char}' (gap expanded and shifted)`)
    } else {
      // Gap has space, no shifting needed
      editor.insert(char)
      setOperationType(null)
      
      updateDisplay(`Inserted '${char}' (no shifting needed)`)
    }
    
    setIsAnimating(false)
  }, [editor, updateDisplay])

  const animateLinkedListInsertion = useCallback(async (char: string) => {
    setIsAnimating(true)
    setOperationType('insert')
    setInputValue('')
    
    const currentOperations = editor.getOperations()
    const currentCursor = editor.getCursor()
    
    // Find the current node and animate characters shifting within it
    let nodeStartIndex = -1
    let nodeEndIndex = -1
    let bracketCount = 0
    
    // Find the node containing the cursor
    for (let i = 0; i < currentOperations.length; i++) {
      if (currentOperations[i] === '[') {
        bracketCount++
        if (bracketCount === 1) {
          nodeStartIndex = i + 1 // Start after opening bracket
        }
      } else if (currentOperations[i] === ']') {
        bracketCount--
        if (bracketCount === 0) {
          nodeEndIndex = i - 1 // End before closing bracket
          break
        }
      }
    }
    
    // Animate characters shifting within the current node
    if (nodeStartIndex !== -1 && nodeEndIndex !== -1) {
      for (let i = currentCursor; i <= nodeEndIndex; i++) {
        if (currentOperations[i] && currentOperations[i] !== '[' && currentOperations[i] !== ']' && currentOperations[i] !== '→') {
          setShiftingIndex(i)
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      }
    }
    
    editor.insert(char)
    setShiftingIndex(null)
    setOperationType(null)
    
    updateDisplay(`Inserted '${char}' (characters shifted within node)`)
    setIsAnimating(false)
  }, [editor, updateDisplay])

  const animateArrayDeletion = useCallback(async () => {
    setIsAnimating(true)
    setOperationType('delete')
    
    const currentContent = editor.getText()
    const currentCursor = editor.getCursor()
    
    if (currentCursor > 0) {
      // Show the shifting animation from left to right
      for (let i = currentCursor; i < currentContent.length; i++) {
        setShiftingIndex(i)
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
      editor.delete()
      setShiftingIndex(null)
      setOperationType(null)
      
      updateDisplay('Deleted character (with shifting)')
    } else {
      setOperationType(null)
      updateDisplay('Cannot delete at beginning')
    }
    
    setIsAnimating(false)
  }, [editor, updateDisplay])

  const animateArrayDeletionRight = useCallback(async () => {
    setIsAnimating(true)
    setOperationType('delete')
    
    const currentContent = editor.getText()
    const currentCursor = editor.getCursor()
    
    if (currentCursor < currentContent.length) {
      // Show the shifting animation from right to left
      for (let i = currentContent.length - 1; i >= currentCursor; i--) {
        setShiftingIndex(i)
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
      editor.deleteRight()
      setShiftingIndex(null)
      setOperationType(null)
      
      updateDisplay('Deleted character to the right (with shifting)')
    } else {
      setOperationType(null)
      updateDisplay('Cannot delete at end')
    }
    
    setIsAnimating(false)
  }, [editor, updateDisplay])

  const handleInsert = useCallback(() => {
    if (inputValue && !isAnimating) {
      if (type === 'array') {
        animateArrayInsertion(inputValue)
      } else if (type === 'linkedlist') {
        animateLinkedListInsertion(inputValue)
      } else if (type === 'gapbuffer') {
        // Check if gap is exhausted before deciding to animate
        let currentGapSize = 10
        let currentGapUsed = 0
        if (
          typeof (editor as any).getGapInfo === 'function'
        ) {
          const gapInfo = (editor as any).getGapInfo();
          currentGapSize = gapInfo.gapSize;
          currentGapUsed = gapInfo.gapUsed;
        }
        if (currentGapUsed >= currentGapSize) {
          animateGapBufferInsertion(inputValue)
        } else {
          editor.insert(inputValue)
          setInputValue('')
          updateDisplay(`Inserted '${inputValue}' (no shifting needed)`)
        }
      } else {
        editor.insert(inputValue)
        setInputValue('')
        updateDisplay(`Inserted '${inputValue}'`)
      }
    }
  }, [inputValue, isAnimating, type, editor, updateDisplay, animateArrayInsertion, animateLinkedListInsertion, animateGapBufferInsertion])

  const handleDelete = useCallback(() => {
    if (!isAnimating) {
      if (type === 'array') {
        animateArrayDeletion()
      } else {
        editor.delete()
        updateDisplay('Deleted character')
      }
    }
  }, [isAnimating, type, editor, updateDisplay, animateArrayDeletion])

  const handleDeleteRight = useCallback(() => {
    if (!isAnimating) {
      if (type === 'array') {
        animateArrayDeletionRight()
      } else {
        editor.deleteRight()
        updateDisplay('Deleted character to the right')
      }
    }
  }, [isAnimating, type, editor, updateDisplay, animateArrayDeletionRight])

  const handleMoveLeft = useCallback(() => {
    editor.moveLeft()
    updateDisplay('Moved cursor left')
  }, [editor, updateDisplay])

  const handleMoveRight = useCallback(() => {
    editor.moveRight()
    updateDisplay('Moved cursor right')
  }, [editor, updateDisplay])

  const handleClearText = useCallback(() => {
    if ('clear' in editor) {
      editor.clear()
      updateDisplay('Cleared all text')
    }
  }, [editor, updateDisplay])

  const handleInsertPreset = useCallback((presetText: string) => {
    if (!isAnimating) {
      for (const char of presetText) {
        editor.insert(char)
      }
      updateDisplay(`Inserted preset text: "${presetText}"`)
    }
  }, [isAnimating, editor, updateDisplay])

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    // Prevent default behavior for keys that might cause scrolling
    if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'PageUp' || e.key === 'PageDown' || e.key === 'Home' || e.key === 'End') {
      e.preventDefault()
    }
    
    if (e.key === 'Enter') {
      handleInsert()
    } else if (e.key === 'Backspace') {
      if (type === 'array' && !isAnimating) {
        animateArrayDeletion()
      } else if (!isAnimating) {
        handleDelete()
      }
    } else if (e.key === 'Delete') {
      if (type === 'array' && !isAnimating) {
        animateArrayDeletionRight()
      } else if (!isAnimating) {
        handleDeleteRight()
      }
    } else if (e.key === 'ArrowLeft') {
      handleMoveLeft()
    } else if (e.key === 'ArrowRight') {
      handleMoveRight()
    } else if (e.key.length === 1) {
      if (type === 'array' && !isAnimating) {
        animateArrayInsertion(e.key)
      } else if (type === 'gapbuffer' && !isAnimating) {
        // Check if gap is exhausted before deciding to animate
        let currentGapSize = 10
        let currentGapUsed = 0
        
        if (
          typeof (editor as any).getGapInfo === 'function'
        ) {
          const gapInfo = (editor as any).getGapInfo()
          currentGapSize = gapInfo.gapSize
          currentGapUsed = gapInfo.gapUsed
        }
        
        if (currentGapUsed >= currentGapSize) {
          animateGapBufferInsertion(e.key)
        } else {
          editor.insert(e.key)
          updateDisplay(`Inserted '${e.key}' (no shifting needed)`)
        }
      } else if (!isAnimating) {
        editor.insert(e.key)
        updateDisplay(`Inserted '${e.key}'`)
      }
    }
  }, [type, isAnimating, handleInsert, handleDelete, handleDeleteRight, handleMoveLeft, handleMoveRight, editor, updateDisplay, animateArrayInsertion, animateArrayDeletion, animateArrayDeletionRight, animateGapBufferInsertion])

  return {
    // State
    cursor,
    operations,
    memoryUsage,
    inputValue,
    operationCount,
    lastOperation,
    isAnimating,
    shiftingIndex,
    operationType,
    
    // Setters
    setInputValue,
    
    // Handlers
    handleInsert,
    handleDelete,
    handleDeleteRight,
    handleMoveLeft,
    handleMoveRight,
    handleClearText,
    handleInsertPreset,
    handleKeyPress,
    
    // Utilities
    updateDisplay,
    
    // Gap buffer specific
    gapSize,
    gapUsed
  }
} 