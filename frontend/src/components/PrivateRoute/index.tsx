import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { RootState } from '@stores/index' // đường dẫn đến file store của bạn

interface PrivateRouteProps {
  element: React.ReactElement // element thay cho component
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated)
  const location = useLocation()

  return isAuthenticated ? element : <Navigate to='/login' state={{ from: location }} replace />
}

export default PrivateRoute
