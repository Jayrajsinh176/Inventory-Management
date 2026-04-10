import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import CategoriesPage from './pages/CategoriesPage';
import AddProductPage from './pages/AddProductPage';
import EditProductPage from './pages/EditProductPage';
import SubscriptionPage from './pages/SubscriptionPage';
import UsersPage from './pages/UsersPage';
import EditUserPage from './pages/EditUserPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import BillingPage from './pages/billing/BillingPage';
import PaymentPage from './pages/billing/PaymentPage';
import ReviewPage from './pages/billing/ReviewPage';
import SuccessPage from './pages/billing/SuccessPage';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />

        {/* Protected Dashboard routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute><DashboardPage /></ProtectedRoute>
        } />
        <Route path="/products" element={
          <ProtectedRoute><ProductsPage /></ProtectedRoute>
        } />
        <Route path="/products/add" element={
          <ProtectedRoute><AddProductPage /></ProtectedRoute>
        } />
        <Route path="/products/edit/:productId" element={
          <ProtectedRoute><EditProductPage /></ProtectedRoute>
        } />
        <Route path="/categories" element={
          <ProtectedRoute><CategoriesPage /></ProtectedRoute>
        } />
        <Route path="/subscription" element={
          <ProtectedRoute><SubscriptionPage /></ProtectedRoute>
        } />
        
        {/* Nested Billing/POS routes */}
        <Route path="/billing" element={<ProtectedRoute><BillingPage /></ProtectedRoute>} />
        <Route path="/billing/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
        <Route path="/billing/review" element={<ProtectedRoute><ReviewPage /></ProtectedRoute>} />
        <Route path="/billing/success" element={<ProtectedRoute><SuccessPage /></ProtectedRoute>} />
        
        <Route path="/users" element={
          <ProtectedRoute><UsersPage /></ProtectedRoute>
        } />
        <Route path="/users/edit/:userId" element={
          <ProtectedRoute><EditUserPage /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><ProfilePage /></ProtectedRoute>
        } />
        <Route path="/notifications" element={
          <ProtectedRoute><NotificationsPage /></ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
