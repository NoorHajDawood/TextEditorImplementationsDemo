import React, { useState } from 'react'

export const Introduction: React.FC = () => {
  const [revealedCards, setRevealedCards] = useState<Set<string>>(new Set())

  const handleCardClick = (cardId: string) => {
    setRevealedCards(prev => new Set([...prev, cardId]))
  }

  return (
    <div className="introduction">
      <div className="introduction-content">
        <h2>Welcome to the Text Editor Data Structure Demo! 🚀</h2>
        
        <div className="intro-section">
          <h3>What is this?</h3>
          <p>
            This interactive demo shows how different data structures handle text editing operations. 
            You'll see three different implementations of a text editor, each using a different underlying data structure.
          </p>
        </div>

        <div className="intro-section">
          <h3>What you'll learn:</h3>
          <ul>
            <li><strong>Time Complexity:</strong> How fast each operation is</li>
            <li><strong>Space Complexity:</strong> How much memory each approach uses</li>
            <li><strong>Trade-offs:</strong> Why we choose different data structures for different use cases</li>
            <li><strong>Visual Learning:</strong> See the algorithms in action with slowed-down animations</li>
          </ul>
        </div>

                 <div className="intro-section">
           <h3>The Three Implementations:</h3>
           <p>Click on each card to reveal what's inside...</p>
           <div className="implementation-previews">
             <div 
               className={`preview-card ${revealedCards.has('array') ? 'revealed' : 'blurred'}`}
               onClick={() => handleCardClick('array')}
             >
               <h4>Array-Based Editor</h4>
               <p>Simple but inefficient. Watch how characters shift when you insert in the middle!</p>
               <div className="complexity">O(n) insertions/deletions</div>
             </div>
             
             <div 
               className={`preview-card ${revealedCards.has('linkedlist') ? 'revealed' : 'blurred'}`}
               onClick={() => handleCardClick('linkedlist')}
             >
               <h4>Linked List Editor</h4>
               <p>Fast insertions but uses more memory. See how nodes connect with pointers!</p>
               <div className="complexity">O(1) insertions/deletions</div>
             </div>
             
             <div 
               className={`preview-card ${revealedCards.has('gapbuffer') ? 'revealed' : 'blurred'}`}
               onClick={() => handleCardClick('gapbuffer')}
             >
               <h4>Gap Buffer Editor</h4>
               <p>The best of both worlds! Efficient and memory-friendly.</p>
               <div className="complexity">O(1) insertions/deletions</div>
             </div>
           </div>
         </div>

        <div className="intro-section">
          <h3>How to use:</h3>
          <ol>
            <li>Click on any tab above to explore a different implementation</li>
            <li>Type characters to see how insertions work</li>
            <li>Use arrow keys or buttons to move the cursor</li>
            <li>Press Backspace or click Delete to see deletions</li>
            <li>Watch the visual indicators and operation counts</li>
            <li>Compare memory usage between implementations</li>
          </ol>
        </div>

        <div className="intro-section">
          <h3>Ready to explore? 🎯</h3>
          <p>
            Click on any of the tabs above to start exploring! Each implementation will show you 
            different aspects of how data structures work in practice.
          </p>
        </div>
      </div>
    </div>
  )
} 