// App.tsx

import MapPage from '@pages/MapPage'
import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/maps' element={<MapPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
