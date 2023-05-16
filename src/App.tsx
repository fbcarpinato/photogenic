import React from 'react'

import Toolbar from './components/Toolbar/Toolbar'
import Canvas from './components/Canvas/Canvas'
import Layers from './components/Layers/Layers'

const App: React.FC = () => {
  return (
    <div className="flex h-screen">
      <Toolbar />
      <Canvas />
      <Layers />
    </div>
  )
}

export default App
