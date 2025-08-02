import React from 'react'
import { ImplementationSummary } from './ImplementationSummary'
import { IMPLEMENTATION_SUMMARIES } from '../utils/implementationSummaries'

export const ImplementationSummaries: React.FC = () => {
  const implementations = ['array', 'linkedlist', 'gapbuffer'] as const

  return (
    <div className="implementation-summaries">
      <h2>Implementation Overview</h2>
      <p className="summaries-intro">
        Each data structure has different trade-offs. Click on any implementation to see a detailed overview:
      </p>
      
      <div className="summaries-grid">
        {implementations.map((type) => {
          const summary = IMPLEMENTATION_SUMMARIES[type]
          return (
            <div key={type} className="summary-card">
              <ImplementationSummary
                type={summary.type}
                title={summary.title}
                description={summary.description}
                gifUrl={summary.gifUrl}
                complexity={summary.complexity}
                pros={summary.pros}
                cons={summary.cons}
                useCases={summary.useCases}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
} 