import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/auth/Login';
import DriverHome from './pages/driver/DriverHome';
import ActiveDeliveries from './pages/driver/ActiveDeliveries';
import PastDeliveries from './pages/driver/PastDeliveries';
import DriverMap from './pages/driver/DriverMap';
import DriverProfile from './pages/driver/DriverProfile';
import CustomerHome from './pages/customer/CustomerHome';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import CustomerNewOrder from './pages/customer/CustomerNewOrder';
import CustomerOrders from './pages/customer/CustomerOrders';
import CustomerProfile from './pages/customer/CustomerProfile';
import type { AccountRole } from './services/types';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return !isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};

const RoleHomeRedirect = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={user.role === 'driver' ? '/driver/home' : '/customer/home'} replace />;
};

const RoleRoute = ({
  role,
  children,
}: {
  role: AccountRole;
  children: React.ReactNode;
}) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  const { theme } = useTheme();

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/" element={
              <ProtectedRoute>
                <RoleHomeRedirect />
              </ProtectedRoute>
            } />
            <Route path="/driver" element={
              <ProtectedRoute>
                <RoleRoute role="driver">
                  <DriverHome />
                </RoleRoute>
              </ProtectedRoute>
            }>
              <Route path="home" element={<ActiveDeliveries />} />
              <Route path="past" element={<PastDeliveries />} />
              <Route path="map" element={<DriverMap />} />
              <Route path="profile" element={<DriverProfile />} />
              <Route index element={<Navigate to="home" replace />} />
            </Route>
            <Route path="/customer" element={
              <ProtectedRoute>
                <RoleRoute role="customer">
                  <CustomerHome />
                </RoleRoute>
              </ProtectedRoute>
            }>
              <Route path="home" element={<CustomerDashboard />} />
              <Route path="new-order" element={<CustomerNewOrder />} />
              <Route path="orders" element={<CustomerOrders />} />
              <Route path="profile" element={<CustomerProfile />} />
              <Route index element={<Navigate to="home" replace />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </MuiThemeProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
