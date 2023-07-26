import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { RootState } from '@stores/index' // đường dẫn đến file store của bạn

interface PublicRouteProps {
  element: React.ReactElement
}

const PublicRoute: React.FC<PublicRouteProps> = ({ element }) => {
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated)
  console.log('isAuthenticated', isAuthenticated)
  const location = useLocation()

  return !isAuthenticated ? element : <Navigate to='/maps' state={{ from: location }} replace />
}

export default PublicRoute
