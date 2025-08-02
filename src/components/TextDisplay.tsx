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
  // Calculate node colors for linked list
  const getNodeColor = (index: number) => {
    if (type !== 'linkedlist') return null
    
    let nodeIndex = 0
    let charCount = 0
    
    for (let i = 0; i < operations.length && i < index; i++) {
      if (operations[i] === '→') {
        nodeIndex++
        charCount = 0
      } else if (operations[i] && !operations[i].startsWith('[') && operations[i] !== '_' && operations[i] !== '→') {
        charCount++
      }
    }
    
         // Color cycling: 8 different colors
     const colors = ['node-color-1', 'node-color-2', 'node-color-3', 'node-color-4', 'node-color-5', 'node-color-6', 'node-color-7', 'node-color-8']
     return colors[nodeIndex % colors.length]
  }

  return (
    <div className="text-display" tabIndex={0} onKeyDown={onKeyDown}>
      <div className="text-content">
                 {operations.map((op, index) => {
           const nodeColor = getNodeColor(index)
           return (
             <span 
               key={index} 
               className={`${op && op.startsWith('[') ? 'cursor' : 'char'} ${nodeColor || ''}`}
               data-gap={type === 'gapbuffer' && op === '_' && !isAnimating && gapSize && gapUsed !== undefined && index >= cursor && index < cursor + (gapSize - gapUsed) ? 'true' : 'false'}
               data-empty={op === '_' ? 'true' : 'false'}
               data-separator={op === '|' ? 'true' : 'false'}
               data-arrow={op === '→' ? 'true' : 'false'}
               data-pointer={type === 'linkedlist' && op === '→' ? 'true' : 'false'}
               data-node={type === 'linkedlist' && op && !op.startsWith('[') && op !== '_' && op !== '→' && op !== '[' && op !== ']' ? 'true' : 'false'}
               data-node-shifting={type === 'linkedlist' && shiftingIndex === index ? 'true' : 'false'}
               data-shifting={shiftingIndex === index ? 'true' : 'false'}
               data-operation={operationType}
             >
               {op || '_'}
             </span>
           )
         })}
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
           <small>
             Linked List: Multi-character nodes (color-coded) connected by pointers (→). 
             {shiftingIndex !== null ? (
               <span className="animating-text"> Characters shifting within nodes (like arrays), pointers update between nodes!</span>
             ) : (
               ' Insertions/deletions shift characters within nodes, create/split nodes when needed.'
             )}
           </small>
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