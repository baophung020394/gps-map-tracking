import { withBaseLayout } from '@components/layouts/Base'
import PrivateRoute from '@components/PrivateRoute'
import PublicRoute from '@components/PublicRoute'
import ChatPage from '@pages/ChatPage'
import LoginPage from '@pages/LoginPage'
import MapDetailPage from '@pages/MapDetailPage'
import MapPage from '@pages/MapPage'
import { setUser } from '@stores/userSlice'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppDispatch } from './stores'

const App: React.FC = () => {
  const BaseMapPage = withBaseLayout(MapPage)
  const BaseMapDetailPage = withBaseLayout(MapDetailPage)
  const BaseMessagesPage = withBaseLayout(ChatPage)
  const isAuthenticated = localStorage.getItem('token')
  const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user') || '')
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (isAuthenticated != null && user?.atk === isAuthenticated) {
      dispatch(setUser(user))
    }
  }, [isAuthenticated, dispatch, user])

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<PublicRoute element={<LoginPage />} />} />
        <Route path='/maps' element={<PrivateRoute element={<BaseMapPage />} />} />
        <Route path='/maps/:id' element={<PrivateRoute element={<BaseMapDetailPage />} />} />
        <Route path='/chats' element={<PrivateRoute element={<BaseMessagesPage />} />} />
        <Route path='/chats/:id' element={<PrivateRoute element={<BaseMessagesPage />} />} />
        {/* <Route path='/channels' element={<PrivateRoute element={<BaseChannelChatPage />} />} />
        <Route path='/channels/:id' element={<PrivateRoute element={<BaseChannelChatPage />} />} />
        <Route path='/chats' element={<PrivateRoute element={<BaseMessagesPage />} />} />
        <Route path='/chats/:id' element={<PrivateRoute element={<BaseMessagesPage />} />} /> */}
        <Route path='*' element={<PublicRoute element={<LoginPage />} />} />
      </Routes>
      {/* <Routes>
        <Route path='/maps' element={<MapPage />} />
        <Route path='/test' element={<TestPage />} />
      </Routes> */}
    </BrowserRouter>
  )
}

export default App
