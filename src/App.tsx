import { useState } from 'react'
import { ArrayBasedEditor, LinkedListEditor, GapBufferEditor } from './utils/dataStructures'
import { EditorDemo } from './components/EditorDemo'
import { TabNavigation } from './components/TabNavigation'
import { TAB_CONFIG } from './utils/constants'
import type { EditorType } from './types'
import './styles/App.css'

function App() {
  // Initialize editors
  const [arrayEditor] = useState(() => new ArrayBasedEditor(''))
  const [linkedListEditor] = useState(() => new LinkedListEditor(''))
  const [gapBufferEditor] = useState(() => new GapBufferEditor(''))
  
  // Tab state
  const [activeTab, setActiveTab] = useState<EditorType>('array')
  
  // Text state for each implementation
  const [arrayText, setArrayText] = useState('')
  const [linkedListText, setLinkedListText] = useState('')
  const [gapBufferText, setGapBufferText] = useState('')

  // Get the appropriate editor instance
  const getEditor = (type: EditorType) => {
    switch (type) {
      case 'array': return arrayEditor
      case 'linkedlist': return linkedListEditor
      case 'gapbuffer': return gapBufferEditor
    }
  }

  // Get the appropriate text state and setter
  const getTextState = (type: EditorType) => {
    switch (type) {
      case 'array': return arrayText
      case 'linkedlist': return linkedListText
      case 'gapbuffer': return gapBufferText
    }
  }

  const getTextSetter = (type: EditorType) => {
    switch (type) {
      case 'array': return setArrayText
      case 'linkedlist': return setLinkedListText
      case 'gapbuffer': return setGapBufferText
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Text Editor Data Structure Demo</h1>
        <p>Explore how different data structures handle text editing operations</p>
      </header>
      
      <main className="main-content">
        <div className="tabs-container">
          <TabNavigation
            tabs={TAB_CONFIG}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          
          <div className="tab-content">
            <EditorDemo
              title={TAB_CONFIG.find(tab => tab.id === activeTab)?.title || ''}
              description={TAB_CONFIG.find(tab => tab.id === activeTab)?.description || ''}
              editor={getEditor(activeTab)}
              type={activeTab}
              textState={getTextState(activeTab)}
              setTextState={getTextSetter(activeTab)}
            />
          </div>
        </div>
      </main>
      
      <footer className="app-footer">
        <h3>How to Use:</h3>
        <ul>
          <li>Type characters to insert them at the cursor position</li>
          <li>Use arrow keys or buttons to move the cursor</li>
          <li>Press Backspace or click Delete to remove characters</li>
          <li>Watch how each implementation handles the operations differently</li>
        </ul>
        
        <h3>Key Differences:</h3>
        <ul>
          <li><strong>Array:</strong> Simple but inefficient for large texts due to shifting</li>
          <li><strong>Linked List:</strong> Fast insertions/deletions but memory overhead</li>
          <li><strong>Gap Buffer:</strong> Best of both worlds - efficient and memory-friendly</li>
        </ul>
      </footer>
    </div>
  )
}

export default App
