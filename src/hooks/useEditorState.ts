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
  const [isAnimating, setIsAnimating] = useState(false)
  const [shiftingIndex, setShiftingIndex] = useState<number | null>(null)
  const [operationType, setOperationType] = useState<'insert' | 'delete' | null>(null)
  const [gapSize, setGapSize] = useState<number>(10)
  const [gapUsed, setGapUsed] = useState<number>(0)
  const [expansionFactor, setExpansionFactor] = useState<number>(2)
  
  // Enhanced operation tracking
  const [detailedOperations, setDetailedOperations] = useState<Array<{
    type: 'insert' | 'delete' | 'shift' | 'move' | 'clear' | 'preset'
    description: string
    timestamp: number
    characterCount?: number
    shiftCount?: number
  }>>([])

  const addOperation = useCallback((operation: {
    type: 'insert' | 'delete' | 'shift' | 'move' | 'clear' | 'preset'
    description: string
    characterCount?: number
    shiftCount?: number
  }) => {
    const newOperation = {
      ...operation,
      timestamp: Date.now()
    }
    setDetailedOperations(prev => [...prev, newOperation])
  }, [])

  const updateDisplay = useCallback(() => {
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
      setExpansionFactor(gapInfo.expansionFactor || 2)
    }
  }, [editor, setTextState])

  const animateArrayInsertion = useCallback(async (char: string) => {
    setIsAnimating(true)
    setOperationType('insert')
    setInputValue('')
    
    const currentContent = editor.getText()
    const currentCursor = editor.getCursor()
    const shiftCount = currentContent.length - currentCursor
    
    // Count each shift operation
    for (let i = currentContent.length; i > currentCursor; i--) {
      setShiftingIndex(i)
      addOperation({
        type: 'shift',
        description: `Shifted character at position ${i}`,
        shiftCount: 1
      })
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    editor.insert(char)
    setShiftingIndex(null)
    setOperationType(null)
    
    addOperation({
      type: 'insert',
      description: `Inserted '${char}' (with ${shiftCount} shifts)`,
      characterCount: 1,
      shiftCount
    })
    updateDisplay()
    setIsAnimating(false)
  }, [editor, updateDisplay, addOperation])

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
      let shiftCount = 0
      
      // Animate characters shifting to make room in the gap
      // Show shifting animation for characters that need to move
      for (let i = gapStartIndex; i < currentOperations.length; i++) {
        if (currentOperations[i] !== '_') {
          setShiftingIndex(i)
          addOperation({
            type: 'shift',
            description: `Shifted character at position ${i} (gap expansion)`,
            shiftCount: 1
          })
          shiftCount++
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      }
      
      editor.insert(char)
      setShiftingIndex(null)
      setOperationType(null)
      
      addOperation({
        type: 'insert',
        description: `Inserted '${char}' (gap expanded with ${shiftCount} shifts)`,
        characterCount: 1,
        shiftCount
      })
      updateDisplay()
    } else {
      // Gap has space, no shifting needed
      editor.insert(char)
      setOperationType(null)
      
      addOperation({
        type: 'insert',
        description: `Inserted '${char}' (no shifting needed)`,
        characterCount: 1,
        shiftCount: 0
      })
      updateDisplay()
    }
    
    setIsAnimating(false)
  }, [editor, updateDisplay, addOperation])

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
    
    let shiftCount = 0
    // Animate characters shifting within the current node
    if (nodeStartIndex !== -1 && nodeEndIndex !== -1) {
      for (let i = currentCursor; i <= nodeEndIndex; i++) {
        if (currentOperations[i] && currentOperations[i] !== '[' && currentOperations[i] !== ']' && currentOperations[i] !== '→') {
          setShiftingIndex(i)
          addOperation({
            type: 'shift',
            description: `Shifted character within node at position ${i}`,
            shiftCount: 1
          })
          shiftCount++
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      }
    }
    
    editor.insert(char)
    setShiftingIndex(null)
    setOperationType(null)
    
    addOperation({
      type: 'insert',
      description: `Inserted '${char}' (${shiftCount} shifts within node)`,
      characterCount: 1,
      shiftCount
    })
    updateDisplay()
    setIsAnimating(false)
  }, [editor, updateDisplay, addOperation])

  const animateArrayDeletion = useCallback(async () => {
    setIsAnimating(true)
    setOperationType('delete')
    
    const currentContent = editor.getText()
    const currentCursor = editor.getCursor()
    
    if (currentCursor > 0) {
      const shiftCount = currentContent.length - currentCursor
      
      // Show the shifting animation from left to right
      for (let i = currentCursor; i < currentContent.length; i++) {
        setShiftingIndex(i)
        addOperation({
          type: 'shift',
          description: `Shifted character at position ${i} (deletion)`,
          shiftCount: 1
        })
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
      editor.delete()
      setShiftingIndex(null)
      setOperationType(null)
      
      addOperation({
        type: 'delete',
        description: `Deleted character (with ${shiftCount} shifts)`,
        characterCount: 1,
        shiftCount
      })
      updateDisplay()
    } else {
      setOperationType(null)
      addOperation({
        type: 'delete',
        description: 'Cannot delete at beginning',
        characterCount: 0,
        shiftCount: 0
      })
      updateDisplay()
    }
    
    setIsAnimating(false)
  }, [editor, updateDisplay, addOperation])

  const animateArrayDeletionRight = useCallback(async () => {
    setIsAnimating(true)
    setOperationType('delete')
    
    const currentContent = editor.getText()
    const currentCursor = editor.getCursor()
    
    if (currentCursor < currentContent.length) {
      const shiftCount = currentContent.length - currentCursor - 1
      
      // Show the shifting animation from right to left
      for (let i = currentContent.length - 1; i >= currentCursor; i--) {
        setShiftingIndex(i)
        addOperation({
          type: 'shift',
          description: `Shifted character at position ${i} (right deletion)`,
          shiftCount: 1
        })
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
      editor.deleteRight()
      setShiftingIndex(null)
      setOperationType(null)
      
      addOperation({
        type: 'delete',
        description: `Deleted character to the right (with ${shiftCount} shifts)`,
        characterCount: 1,
        shiftCount
      })
      updateDisplay()
    } else {
      setOperationType(null)
      addOperation({
        type: 'delete',
        description: 'Cannot delete at end',
        characterCount: 0,
        shiftCount: 0
      })
      updateDisplay()
    }
    
    setIsAnimating(false)
  }, [editor, updateDisplay, addOperation])

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
          addOperation({
            type: 'insert',
            description: `Inserted '${inputValue}' (no shifting needed)`,
            characterCount: 1,
            shiftCount: 0
          })
          updateDisplay()
        }
      } else {
        editor.insert(inputValue)
        setInputValue('')
        addOperation({
          type: 'insert',
          description: `Inserted '${inputValue}'`,
          characterCount: 1,
          shiftCount: 0
        })
        updateDisplay()
      }
    }
  }, [inputValue, isAnimating, type, editor, updateDisplay, animateArrayInsertion, animateLinkedListInsertion, animateGapBufferInsertion, addOperation])

  const handleDelete = useCallback(() => {
    if (!isAnimating) {
      if (type === 'array') {
        animateArrayDeletion()
      } else {
        editor.delete()
        addOperation({
          type: 'delete',
          description: 'Deleted character',
          characterCount: 1,
          shiftCount: 0
        })
        updateDisplay()
      }
    }
  }, [isAnimating, type, editor, updateDisplay, animateArrayDeletion, addOperation])

  const handleDeleteRight = useCallback(() => {
    if (!isAnimating) {
      if (type === 'array') {
        animateArrayDeletionRight()
      } else {
        editor.deleteRight()
        addOperation({
          type: 'delete',
          description: 'Deleted character to the right',
          characterCount: 1,
          shiftCount: 0
        })
        updateDisplay()
      }
    }
  }, [isAnimating, type, editor, updateDisplay, animateArrayDeletionRight, addOperation])

  const handleMoveLeft = useCallback(() => {
    editor.moveLeft()
    addOperation({
      type: 'move',
      description: 'Moved cursor left',
      characterCount: 0,
      shiftCount: 0
    })
    updateDisplay()
  }, [editor, updateDisplay, addOperation])

  const handleMoveRight = useCallback(() => {
    editor.moveRight()
    addOperation({
      type: 'move',
      description: 'Moved cursor right',
      characterCount: 0,
      shiftCount: 0
    })
    updateDisplay()
  }, [editor, updateDisplay, addOperation])

  const handleClearText = useCallback(() => {
    if ('clear' in editor) {
      const charCount = editor.getText().length
      editor.clear()
      addOperation({
        type: 'clear',
        description: 'Cleared all text',
        characterCount: charCount,
        shiftCount: 0
      })
      updateDisplay()
    }
  }, [editor, updateDisplay, addOperation])

  const handleInsertPreset = useCallback((presetText: string) => {
    if (!isAnimating) {
      for (const char of presetText) {
        editor.insert(char)
      }
      addOperation({
        type: 'preset',
        description: `Inserted preset text: "${presetText}"`,
        characterCount: presetText.length,
        shiftCount: 0
      })
      updateDisplay()
    }
  }, [isAnimating, editor, updateDisplay, addOperation])

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
          addOperation({
            type: 'insert',
            description: `Inserted '${e.key}' (no shifting needed)`,
            characterCount: 1,
            shiftCount: 0
          })
          updateDisplay()
        }
      } else if (!isAnimating) {
        editor.insert(e.key)
        addOperation({
          type: 'insert',
          description: `Inserted '${e.key}'`,
          characterCount: 1,
          shiftCount: 0
        })
        updateDisplay()
      }
    }
  }, [type, isAnimating, handleInsert, handleDelete, handleDeleteRight, handleMoveLeft, handleMoveRight, editor, updateDisplay, animateArrayInsertion, animateArrayDeletion, animateArrayDeletionRight, animateGapBufferInsertion, addOperation])

  const handleExpansionFactorChange = useCallback((factor: number) => {
    if (type === 'gapbuffer' && typeof (editor as any).setExpansionFactor === 'function') {
      (editor as any).setExpansionFactor(factor)
      setExpansionFactor(factor)
      addOperation({
        type: 'preset',
        description: `Changed expansion factor to ${factor}x`,
        characterCount: 0,
        shiftCount: 0
      })
    }
  }, [type, editor, addOperation])

  return {
    // State
    cursor,
    operations,
    memoryUsage,
    inputValue,
    operationCount: editor.getOperationCount(),
    lastOperation: editor.getLastOperation(),
    isAnimating,
    shiftingIndex,
    operationType,
    detailedOperations,
    
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
    gapUsed,
    expansionFactor,
    handleExpansionFactorChange
  }
} 