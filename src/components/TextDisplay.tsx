import React from 'react'
import type { EditorType } from '../types'

interface TextDisplayProps {
  operations: string[]
  type: EditorType
  shiftingIndex: number | null
  operationType: 'insert' | 'delete' | null
  isAnimating: boolean
  cursor: number
  gapSize?: number
  gapUsed?: number
  onKeyDown: (e: React.KeyboardEvent) => void
}

export const TextDisplay: React.FC<TextDisplayProps> = ({
  operations,
  type,
  shiftingIndex,
  operationType,
  isAnimating,
  cursor,
  gapSize,
  gapUsed,
  onKeyDown
}) => {
  return (
    <div className="text-display" tabIndex={0} onKeyDown={onKeyDown}>
      <div className="text-content">
                 {operations.map((op, index) => (
           <span 
             key={index} 
             className={op && op.startsWith('[') ? 'cursor' : 'char'}
             data-gap={type === 'gapbuffer' && op === '_' && !isAnimating && gapSize && gapUsed !== undefined && index >= cursor && index < cursor + (gapSize - gapUsed) ? 'true' : 'false'}
             data-empty={op === '_' ? 'true' : 'false'}
             data-separator={op === '|' ? 'true' : 'false'}
             data-arrow={op === '→' ? 'true' : 'false'}
             data-shifting={shiftingIndex === index ? 'true' : 'false'}
             data-operation={operationType}
           >
             {op || '_'}
           </span>
         ))}
      </div>
      
      {type === 'array' && (
        <div className="array-indicator">
          <small>
            Array slots: Empty slots (_) show available space. 
            {shiftingIndex !== null ? (
              <span className="animating-text"> Insertions/deletions shift characters (animating...)</span>
            ) : (
              ' Insertions shift characters right, deletions shift characters left.'
            )}
          </small>
        </div>
      )}
      
      {type === 'linkedlist' && (
        <div className="linkedlist-indicator">
          <small>Linked List: No shifting! Characters are connected by pointers (|).</small>
        </div>
      )}
      
                    {type === 'gapbuffer' && (
          <div className="gapbuffer-indicator">
            <small>
              Gap Buffer: Empty slots (_) show the gap. 
              {gapSize && gapUsed !== undefined && (
                <span> Gap: {gapUsed}/{gapSize} used. </span>
              )}
              {shiftingIndex !== null ? (
                <span className="animating-text"> Gap is shifting to accommodate insertion...</span>
              ) : (
                ' Insertions happen in gap, characters shift when gap moves.'
              )}
            </small>
          </div>
        )}
    </div>
  )
} 