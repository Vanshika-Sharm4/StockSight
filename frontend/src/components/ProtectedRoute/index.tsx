import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import Loading from '../Loading';

/** Wraps every page that requires an account; visitors get sent to /auth. */
function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loading />
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }
  return <Outlet />;
}

export default ProtectedRoute;
