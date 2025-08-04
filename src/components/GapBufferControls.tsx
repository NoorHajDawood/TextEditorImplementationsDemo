import React, { useState } from 'react'

interface GapBufferControlsProps {
  expansionFactor: number
  onExpansionFactorChange: (factor: number) => void
  isAnimating: boolean
}

export const GapBufferControls: React.FC<GapBufferControlsProps> = ({
  expansionFactor,
  onExpansionFactorChange,
  isAnimating
}) => {
  const [inputValue, setInputValue] = useState(expansionFactor.toString())

  const handleFactorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    
    const factor = parseFloat(value)
    if (!isNaN(factor) && factor >= 1) {
      onExpansionFactorChange(factor)
    }
  }

  const handleBlur = () => {
    const factor = parseFloat(inputValue)
    if (isNaN(factor) || factor < 1) {
      setInputValue(expansionFactor.toString())
    }
  }

  return (
    <div className="gap-buffer-controls">
      <div className="control-group">
        <label htmlFor="expansion-factor">
          <strong>Gap Expansion Factor:</strong>
        </label>
        <div className="input-group">
          <input
            id="expansion-factor"
            type="number"
            min="1"
            max="10"
            step="0.5"
            value={inputValue}
            onChange={handleFactorChange}
            onBlur={handleBlur}
            disabled={isAnimating}
            className="expansion-factor-input"
            title="Multiplication factor for gap buffer expansion (1-10)"
          />
          <small className="input-help">
            Current: {expansionFactor}x (Gap size × {expansionFactor})
          </small>
        </div>
      </div>
      
      <div className="factor-info">
        <small>
          <strong>How it works:</strong> When the gap is exhausted, 
          it expands by multiplying the current gap size by this factor.
          <br />
          <strong>Example:</strong> With factor {expansionFactor}, a 10-slot gap becomes {10 * expansionFactor} slots.
        </small>
      </div>
    </div>
  )
} 