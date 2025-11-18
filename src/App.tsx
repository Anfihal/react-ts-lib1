// src/App.tsx
import React, { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ContactProvider } from './context/ContactContext';
import { ServiceProvider } from './context/ServiceContext';
import { ProductProvider } from './context/ProductContext';
import { AboutProvider } from './context/AboutContext';
import { HomeProvider } from './context/HomeContext';
import { ProfileProvider } from './context/ProfileContext';
import { CartProvider } from './context/CartContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home/Home';
import Services from './pages/Services/Services';
import Shop from './pages/Shop/Shop';
import Admin from './pages/Admin/Admin';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import Login from './components/auth/Login';
import GuestDashboard from './pages/Guest/Dashboard/Dashboard';
import GuestProfile from './pages/Guest/GuestProfile/Profile';
import GuestOrders from './pages/Guest/GuestOrders/Orders';
import GuestServices from './pages/Guest/GuestServices/GuestServices';
import GuestShop from './pages/Guest/GuestShop/GuestShop';
import GuestAbout from './pages/Guest/GuestAbout/GuestAbout';
import GuestContact from './pages/Guest/GuestContact/GuestContact';
import GuestCart from './pages/Guest/Cart/Cart';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './styles/App.css';

// Компонент для автоматического редиректа
const AppRouter: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Автоматический редирект с любых GitHub Pages путей на корневой
    const currentPath = location.pathname;

    if (currentPath.startsWith('/react-ts-lib1')) {
      const newPath = currentPath.replace('/react-ts-lib1', '') || '/';
      navigate(newPath, { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          {/* Главная страница */}
          <Route path="/" element={<Home />} />

          {/* Публичные маршруты */}
          <Route path="/services" element={<Services />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />

          {/* Защищенные маршруты гостя */}
          <Route
            path="/guest"
            element={
              <ProtectedRoute requireAdmin={false}>
                <GuestDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/guest/guestprofile"
            element={
              <ProtectedRoute requireAdmin={false}>
                <GuestProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/guest/guestorders"
            element={
              <ProtectedRoute requireAdmin={false}>
                <GuestOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/guest/guestservices"
            element={
              <ProtectedRoute requireAdmin={false}>
                <GuestServices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/guest/guestshop"
            element={
              <ProtectedRoute requireAdmin={false}>
                <GuestShop />
              </ProtectedRoute>
            }
          />
          <Route
            path="/guest/cart"
            element={
              <ProtectedRoute requireAdmin={false}>
                <GuestCart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/guest/guestabout"
            element={
              <ProtectedRoute requireAdmin={false}>
                <GuestAbout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/guest/guestcontact"
            element={
              <ProtectedRoute requireAdmin={false}>
                <GuestContact />
              </ProtectedRoute>
            }
          />

          {/* Защищенные маршруты админа */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute requireAdmin={true}>
                <Admin />
              </ProtectedRoute>
            }
          />

          {/* Страница 404 */}
          <Route path="*" element={
            <div className="not-found">
              <h2>Страница не найдена</h2>
              <p>Запрошенная страница не существует.</p>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <ProfileProvider>
        <ContactProvider>
          <ServiceProvider>
            <ProductProvider>
              <AboutProvider>
                <HomeProvider>
                  <CartProvider>
                    <AppRouter />
                  </CartProvider>
                </HomeProvider>
              </AboutProvider>
            </ProductProvider>
          </ServiceProvider>
        </ContactProvider>
      </ProfileProvider>
    </AppProvider>
  );
};

export default App;