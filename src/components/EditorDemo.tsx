import React, { useEffect } from 'react'
import type { ITextEditor, EditorType } from '../types'
import { useEditorState } from '../hooks/useEditorState'
import { TextDisplay } from './TextDisplay'
import { EditorControls } from './EditorControls'
import { GapBufferControls } from './GapBufferControls'
import { EditorInfo } from './EditorInfo'
import { ImplementationDetails } from './ImplementationDetails'

interface EditorDemoProps {
  title: string
  description: string
  editor: ITextEditor
  type: EditorType
  textState: string
  setTextState: (text: string) => void
}

export const EditorDemo: React.FC<EditorDemoProps> = ({
  title,
  description,
  editor,
  type,
  textState,
  setTextState
}) => {
  const {
    cursor,
    operations,
    memoryUsage,
    inputValue,
    operationCount,
    lastOperation,
    isAnimating,
    shiftingIndex,
    operationType,
    gapSize,
    gapUsed,
    expansionFactor,
    detailedOperations,
    setInputValue,
    handleInsert,
    handleDelete,
    handleMoveLeft,
    handleMoveRight,
    handleClearText,
    handleInsertPreset,
    handleExpansionFactorChange,
    handleKeyPress,
    updateDisplay
  } = useEditorState({ editor, type, textState, setTextState })

  useEffect(() => {
    updateDisplay()
  }, [updateDisplay])

  return (
    <div className="editor-demo">
      <h2>{title}</h2>
      <p className="description">{description}</p>
      
      <div className="editor-container">
                 <TextDisplay
           operations={operations}
           type={type}
           shiftingIndex={shiftingIndex}
           operationType={operationType}
           isAnimating={isAnimating}
           cursor={cursor}
           gapSize={gapSize}
           gapUsed={gapUsed}
           onKeyDown={handleKeyPress}
         />
        
        <EditorControls
          inputValue={inputValue}
          setInputValue={setInputValue}
          isAnimating={isAnimating}
          onInsert={handleInsert}
          onDelete={handleDelete}
          onMoveLeft={handleMoveLeft}
          onMoveRight={handleMoveRight}
          onClear={handleClearText}
          onInsertPreset={handleInsertPreset}
        />
        
        {type === 'gapbuffer' && (
          <GapBufferControls
            expansionFactor={expansionFactor}
            onExpansionFactorChange={handleExpansionFactorChange}
            isAnimating={isAnimating}
          />
        )}
        
        <EditorInfo
          text={textState}
          cursor={cursor}
          operationCount={operationCount}
          lastOperation={lastOperation}
          memoryUsage={memoryUsage}
          type={type}
          gapSize={gapSize}
          gapUsed={gapUsed}
          detailedOperations={detailedOperations}
        />
        
        <ImplementationDetails type={type} />
      </div>
    </div>
  )
} 