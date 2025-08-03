import React from 'react'
import type { EditorType } from '../types'
import { AnimatedDemo } from './AnimatedDemo'

interface ImplementationSummaryProps {
  type: EditorType
  title: string
  description: string
  gifUrl: string
  complexity: {
    insert: string
    delete: string
    move: string
    memory: string
  }
  pros: string[]
  cons: string[]
  useCases: string[]
}

export const ImplementationSummary: React.FC<ImplementationSummaryProps> = ({
  type,
  title,
  description,
  complexity,
  pros,
  cons,
  useCases
}) => {
  return (
    <div className="implementation-summary">
      <div className="summary-header">
        <h3>{title}</h3>
        <p className="summary-description">{description}</p>
      </div>
      
      <div className="summary-content">
        <div className="summary-visual">
          <AnimatedDemo type={type} title={title} />
        </div>
        
        <div className="summary-details">
          <div className="complexity-section">
            <h4>Time Complexity</h4>
            <div className="complexity-grid">
              <div className="complexity-item">
                <span className="complexity-label">Insert:</span>
                <span className="complexity-value">{complexity.insert}</span>
              </div>
              <div className="complexity-item">
                <span className="complexity-label">Delete:</span>
                <span className="complexity-value">{complexity.delete}</span>
              </div>
              <div className="complexity-item">
                <span className="complexity-label">Move:</span>
                <span className="complexity-value">{complexity.move}</span>
              </div>
              <div className="complexity-item">
                <span className="complexity-label">Memory:</span>
                <span className="complexity-value">{complexity.memory}</span>
              </div>
            </div>
          </div>
          
          <div className="pros-cons-section">
            <div className="pros">
              <h4>✅ Advantages</h4>
              <ul>
                {pros.map((pro, index) => (
                  <li key={index}>{pro}</li>
                ))}
              </ul>
            </div>
            
            <div className="cons">
              <h4>❌ Disadvantages</h4>
              <ul>
                {cons.map((con, index) => (
                  <li key={index}>{con}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="use-cases-section">
            <h4>🎯 Best Use Cases</h4>
            <ul>
              {useCases.map((useCase, index) => (
                <li key={index}>{useCase}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 