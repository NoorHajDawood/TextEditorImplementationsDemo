import React from 'react'
import type { EditorType } from '../types'

interface EditorInfoProps {
  text: string
  cursor: number
  operationCount: number
  lastOperation: string
  memoryUsage: number
  type: EditorType
}

export const EditorInfo: React.FC<EditorInfoProps> = ({
  text,
  cursor,
  operationCount,
  lastOperation,
  memoryUsage,
  type
}) => {
  return (
    <div className="info">
      <div className="info-item">
        <strong>Text:</strong> "{text}"
      </div>
      <div className="info-item">
        <strong>Cursor:</strong> {cursor}
      </div>
      <div className="info-item">
        <strong>Operations:</strong> {operationCount}
      </div>
      {lastOperation && (
        <div className="info-item last-operation">
          <strong>Last Operation:</strong> {lastOperation}
        </div>
      )}
      {(type === 'linkedlist' || type === 'gapbuffer') && (
        <div className="info-item">
          <strong>Memory Usage:</strong> ~{memoryUsage} units
        </div>
      )}
    </div>
  )
} 