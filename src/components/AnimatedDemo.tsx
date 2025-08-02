import React, { useState, useEffect } from 'react'
import type { EditorType } from '../types'

interface AnimatedDemoProps {
  type: EditorType
  title: string
}

export const AnimatedDemo: React.FC<AnimatedDemoProps> = ({ type, title }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [demoData, setDemoData] = useState<string[]>([])
  const [cursorPosition, setCursorPosition] = useState(0)
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null)

  const getDemoSteps = () => {
    switch (type) {
      case 'array':
        return [
          { text: ['H', 'e', 'l', 'l', 'o'], cursor: 2, highlight: null, description: 'Initial state: "Hello" with cursor at position 2' },
          { text: ['H', 'e', 'l', 'l', 'o'], cursor: 2, highlight: 2, description: 'Inserting "X" at cursor position...' },
          { text: ['H', 'e', 'l', 'l', 'o'], cursor: 2, highlight: 3, description: 'Shifting "l" to make room (O(n) operation)' },
          { text: ['H', 'e', 'l', 'l', 'o'], cursor: 2, highlight: 4, description: 'Shifting "l" to make room...' },
          { text: ['H', 'e', 'l', 'l', 'o'], cursor: 2, highlight: 5, description: 'Shifting "o" to make room...' },
          { text: ['H', 'e', 'X', 'l', 'l', 'o'], cursor: 3, highlight: null, description: 'Result: "X" inserted, all 3 characters shifted right' }
        ]
      case 'linkedlist':
        return [
          { text: ['H', 'e', 'l', 'l', 'o'], cursor: 2, highlight: null, description: 'Initial state: "Hello" in linked list nodes' },
          { text: ['H', 'e', 'l', 'l', 'o'], cursor: 2, highlight: 2, description: 'Inserting "X" at cursor position...' },
          { text: ['H', 'e', 'X', 'l', 'l', 'o'], cursor: 3, highlight: null, description: 'Result: "X" inserted, no shifting needed! (O(1) operation)' }
        ]
      case 'gapbuffer':
        return [
          { text: ['H', 'e', 'l', 'l', 'o'], cursor: 2, highlight: null, description: 'Initial state: "Hello" with gap at cursor' },
          { text: ['H', 'e', '_', '_', '_', 'l', 'l', 'o'], cursor: 2, highlight: 2, description: 'Gap buffer: characters before and after gap' },
          { text: ['H', 'e', 'X', '_', '_', 'l', 'l', 'o'], cursor: 3, highlight: null, description: 'Result: "X" inserted into gap, no shifting! (O(1) operation)' }
        ]
      default:
        return []
    }
  }

  const steps = getDemoSteps()

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1)
      }, 1500)
      return () => clearTimeout(timer)
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false)
    }
  }, [isPlaying, currentStep, steps.length])

  useEffect(() => {
    if (steps[currentStep]) {
      setDemoData(steps[currentStep].text)
      setCursorPosition(steps[currentStep].cursor)
      setHighlightedIndex(steps[currentStep].highlight)
    }
  }, [currentStep, steps])

  const handlePlay = () => {
    setCurrentStep(0)
    setIsPlaying(true)
  }

  const handleStep = (direction: 'next' | 'prev') => {
    setIsPlaying(false)
    if (direction === 'next' && currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else if (direction === 'prev' && currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const getCharClass = (index: number) => {
    let className = 'demo-char'
    if (index === cursorPosition) className += ' cursor'
    if (index === highlightedIndex) className += ' highlighted'
    if (demoData[index] === '_') className += ' gap'
    return className
  }

  return (
    <div className="animated-demo">
      <div className="demo-header">
        <h4>{title} Animation</h4>
        <div className="demo-controls">
          <button 
            className="demo-btn"
            onClick={() => handleStep('prev')}
            disabled={currentStep === 0}
          >
            ⏮
          </button>
          <button 
            className="demo-btn play-btn"
            onClick={handlePlay}
            disabled={isPlaying}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button 
            className="demo-btn"
            onClick={() => handleStep('next')}
            disabled={currentStep === steps.length - 1}
          >
            ⏭
          </button>
        </div>
      </div>

      <div className="demo-content">
        <div className="demo-text">
          {demoData.map((char, index) => (
            <span key={index} className={getCharClass(index)}>
              {char === '_' ? '□' : char}
            </span>
          ))}
        </div>
        
        <div className="demo-description">
          {steps[currentStep]?.description}
        </div>

        <div className="demo-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          <span className="progress-text">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
      </div>

      <div className="demo-legend">
        <div className="legend-item">
          <span className="legend-char cursor">H</span>
          <span>Cursor position</span>
        </div>
        <div className="legend-item">
          <span className="legend-char highlighted">X</span>
          <span>Currently shifting</span>
        </div>
        <div className="legend-item">
          <span className="legend-char gap">□</span>
          <span>Gap/Empty space</span>
        </div>
      </div>
    </div>
  )
} 