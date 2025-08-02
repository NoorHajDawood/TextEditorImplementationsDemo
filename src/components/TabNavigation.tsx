import React from 'react'
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
  return (
    <div className="tabs-header">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.title}
        </button>
      ))}
    </div>
  )
} 