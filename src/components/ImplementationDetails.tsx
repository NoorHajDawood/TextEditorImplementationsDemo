import React from 'react'
import type { EditorType } from '../types'

interface ImplementationDetailsProps {
  type: EditorType
}

export const ImplementationDetails: React.FC<ImplementationDetailsProps> = ({ type }) => {
  const getDetails = () => {
    switch (type) {
      case 'array':
        return {
          dataStructure: 'Simple array with shifting operations',
          insertDelete: 'O(n) - requires shifting elements',
          cursorMovement: 'O(1) - direct index access',
          memory: 'Minimal overhead'
        }
      case 'linkedlist':
        return {
          dataStructure: 'Doubly linked list with pointers',
          insertDelete: 'O(1) - pointer manipulation',
          cursorMovement: 'O(1) - follow pointers',
          memory: 'Higher overhead due to pointers'
        }
      case 'gapbuffer':
        return {
          dataStructure: 'Gap buffer with before/after arrays',
          insertDelete: 'O(1) - at gap position',
          cursorMovement: 'O(1) - move gap boundaries',
          memory: 'Efficient with gap management'
        }
    }
  }

  const details = getDetails()

  return (
    <div className="implementation-details">
      <h4>Implementation Details:</h4>
      <div className="detail-content">
        <p><strong>Data Structure:</strong> {details.dataStructure}</p>
        <p><strong>Insert/Delete:</strong> {details.insertDelete}</p>
        <p><strong>Cursor Movement:</strong> {details.cursorMovement}</p>
        <p><strong>Memory:</strong> {details.memory}</p>
      </div>
    </div>
  )
} 