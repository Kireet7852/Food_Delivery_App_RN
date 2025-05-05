import React, { FC } from 'react'
import UserBottomTab from './UserBottomTab';
import { SharedStateProvider } from './SharedContext';

const AnimatedTabs:FC = () => {
  return (
    <SharedStateProvider>
        <UserBottomTab />
    </SharedStateProvider>
  )
}

export default AnimatedTabs;