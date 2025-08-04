import React from 'react'

interface EditorControlsProps {
  inputValue: string
  setInputValue: (value: string) => void
  isAnimating: boolean
  onInsert: () => void
  onDelete: () => void
  onMoveLeft: () => void
  onMoveRight: () => void
  onClear: () => void
  onInsertPreset: (text: string) => void
}

export const EditorControls: React.FC<EditorControlsProps> = ({
  inputValue,
  setInputValue,
  isAnimating,
  onInsert,
  onDelete,
  onMoveLeft,
  onMoveRight,
  onClear,
  onInsertPreset
}) => {
  return (
    <>
      <div className="controls">
        <div className="input-group">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a character..."
            disabled={isAnimating}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                onInsert()
              }
            }}
          />
          <button onClick={onInsert} disabled={isAnimating || !inputValue}>
            Insert
          </button>
        </div>
        
        <div className="button-group">
          <button onClick={onMoveLeft} disabled={isAnimating}>
            ←
          </button>
          <button onClick={onDelete} disabled={isAnimating}>
            Delete
          </button>
          <button onClick={onMoveRight} disabled={isAnimating}>
            →
          </button>
        </div>
      </div>
      
      <div className="utility-buttons">
        <button onClick={onClear} disabled={isAnimating} className="clear-button">
          {isAnimating ? 'Animating...' : 'Clear Text'}
        </button>
      </div>
      
      <div className="preset-buttons">
        <small>Quick insert:</small>
        <div className="preset-group">
          <button 
            onClick={() => onInsertPreset('Hello')} 
            disabled={isAnimating}
            className="preset-button"
          >
            Hello
          </button>
          <button 
            onClick={() => onInsertPreset('World')} 
            disabled={isAnimating}
            className="preset-button"
          >
            World
          </button>
          <button 
            onClick={() => onInsertPreset('Data Structures')} 
            disabled={isAnimating}
            className="preset-button"
          >
            Data Structures
          </button>
        </div>
      </div>
    </>
  )
} 