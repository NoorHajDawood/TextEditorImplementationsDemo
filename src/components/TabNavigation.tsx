import React, { useState, useEffect } from 'react'
import type { EditorType, TabConfig } from '../types'

interface TabNavigationProps {
  tabs: TabConfig[]
  activeTab: EditorType
  onTabChange: (tab: EditorType) => void
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange
}) => {
  const [visitedTabs, setVisitedTabs] = useState<Set<EditorType>>(new Set([activeTab]))

  useEffect(() => {
    setVisitedTabs(prev => new Set([...prev, activeTab]))
  }, [activeTab])

  const handleTabClick = (tabId: EditorType) => {
    setVisitedTabs(prev => new Set([...prev, tabId]))
    onTabChange(tabId)
  }

  return (
    <div className="tabs-header">
      {tabs.map((tab) => {
        const isVisited = visitedTabs.has(tab.id)
        return (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''} ${isVisited ? 'visited' : ''}`}
            onClick={() => handleTabClick(tab.id)}
          >
            <span className="tab-title">{tab.title}</span>
            <span className="tab-mask">???</span>
          </button>
        )
      })}
    </div>
  )
} 