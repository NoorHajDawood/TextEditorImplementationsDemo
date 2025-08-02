import React from 'react'
import type { EditorType } from '../types'

interface EditorInfoProps {
  text: string
  cursor: number
  operationCount: number
  lastOperation: string
  memoryUsage: number
  type: EditorType
  gapSize?: number
  gapUsed?: number
  detailedOperations?: Array<{
    type: 'insert' | 'delete' | 'shift' | 'move' | 'clear' | 'preset'
    description: string
    timestamp: number
    characterCount?: number
    shiftCount?: number
  }>
}

export const EditorInfo: React.FC<EditorInfoProps> = ({
  text,
  cursor,
  operationCount,
  lastOperation,
  memoryUsage,
  type,
  gapSize,
  gapUsed,
  detailedOperations = []
}) => {
  const getTextStats = () => {
    const charCount = text.length
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0
    const lineCount = text ? text.split('\n').length : 0
    return { charCount, wordCount, lineCount }
  }

  const getPerformanceMetrics = () => {
    const { charCount } = getTextStats()
    let insertComplexity = 'O(1)'
    let deleteComplexity = 'O(1)'
    let moveComplexity = 'O(1)'
    let memoryComplexity = 'O(n)'

    switch (type) {
      case 'array':
        insertComplexity = 'O(n)'
        deleteComplexity = 'O(n)'
        moveComplexity = 'O(1)'
        memoryComplexity = 'O(n)'
        break
      case 'linkedlist':
        insertComplexity = 'O(1)'
        deleteComplexity = 'O(1)'
        moveComplexity = 'O(n)'
        memoryComplexity = 'O(n) + overhead'
        break
      case 'gapbuffer':
        insertComplexity = 'O(1)'
        deleteComplexity = 'O(1)'
        moveComplexity = 'O(1) amortized'
        memoryComplexity = 'O(n) + gap'
        break
    }

    return { insertComplexity, deleteComplexity, moveComplexity, memoryComplexity }
  }

  const getOperationAnalysis = () => {
    const totalShifts = detailedOperations
      .filter(op => op.type === 'shift')
      .reduce((sum, op) => sum + (op.shiftCount || 0), 0)
    
    const totalInserts = detailedOperations
      .filter(op => op.type === 'insert')
      .reduce((sum, op) => sum + (op.characterCount || 0), 0)
    
    const totalDeletes = detailedOperations
      .filter(op => op.type === 'delete')
      .reduce((sum, op) => sum + (op.characterCount || 0), 0)
    
    const totalMoves = detailedOperations
      .filter(op => op.type === 'move')
      .length
    
    const shiftPercentage = operationCount > 0 ? Math.round((totalShifts / operationCount) * 100) : 0
    
    return {
      totalShifts,
      totalInserts,
      totalDeletes,
      totalMoves,
      shiftPercentage
    }
  }

  const getMemoryBreakdown = () => {
    switch (type) {
      case 'array':
        return `Characters: ${text.length} | Total: ${text.length} units`
      case 'linkedlist':
        const nodeCount = Math.ceil(text.length / 10) // 10 chars per node
        const pointerOverhead = nodeCount * 2 // next + prev pointers
        return `Characters: ${text.length} | Nodes: ${nodeCount} | Pointers: ${pointerOverhead} | Total: ${memoryUsage} units`
      case 'gapbuffer':
        const gapOverhead = gapSize || 10
        const actualChars = text.length
        return `Characters: ${actualChars} | Gap: ${gapSize || 10} | Used: ${gapUsed || 0} | Total: ${memoryUsage} units`
      default:
        return `Characters: ${text.length} units`
    }
  }

  const { charCount, wordCount, lineCount } = getTextStats()
  const { insertComplexity, deleteComplexity, moveComplexity, memoryComplexity } = getPerformanceMetrics()
  const { totalShifts, totalInserts, totalDeletes, totalMoves, shiftPercentage } = getOperationAnalysis()

  return (
    <div className="info">
      <div className="info-section">
        <h4>Text Statistics</h4>
        <div className="info-item">
          <strong>Characters:</strong> {charCount}
        </div>
        <div className="info-item">
          <strong>Words:</strong> {wordCount}
        </div>
        <div className="info-item">
          <strong>Lines:</strong> {lineCount}
        </div>
        <div className="info-item">
          <strong>Cursor Position:</strong> {cursor} / {charCount}
        </div>
      </div>

      <div className="info-section">
        <h4>Performance Analysis</h4>
        <div className="info-item">
          <strong>Insert:</strong> <span className="complexity">{insertComplexity}</span>
        </div>
        <div className="info-item">
          <strong>Delete:</strong> <span className="complexity">{deleteComplexity}</span>
        </div>
        <div className="info-item">
          <strong>Cursor Move:</strong> <span className="complexity">{moveComplexity}</span>
        </div>
        <div className="info-item">
          <strong>Memory:</strong> <span className="complexity">{memoryComplexity}</span>
        </div>
      </div>

      <div className="info-section">
        <h4>Memory Usage</h4>
        <div className="info-item">
          <strong>Breakdown:</strong> {getMemoryBreakdown()}
        </div>
        {type === 'gapbuffer' && gapSize && (
          <div className="info-item">
            <strong>Gap Efficiency:</strong> {gapUsed}/{gapSize} ({Math.round((gapUsed || 0) / gapSize * 100)}% used)
          </div>
        )}
      </div>

      <div className="info-section">
        <h4>Operation Analysis</h4>
        <div className="info-item">
          <strong>Total Operations:</strong> {operationCount}
        </div>
        <div className="info-item">
          <strong>Character Shifts:</strong> {totalShifts} ({shiftPercentage}% of operations)
        </div>
        <div className="info-item">
          <strong>Inserts:</strong> {totalInserts} | <strong>Deletes:</strong> {totalDeletes}
        </div>
        <div className="info-item">
          <strong>Cursor Moves:</strong> {totalMoves}
        </div>
        {lastOperation && (
          <div className="info-item last-operation">
            <strong>Last Operation:</strong> {lastOperation}
          </div>
        )}
      </div>
    </div>
  )
} 