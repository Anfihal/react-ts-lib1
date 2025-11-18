// src/App.tsx (исправленная версия)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
                    <Router>
                      <div className="app">
                        <Header />
                        {/* УДАЛИТЬ ЭТУ СТРОКУ: <Cart /> */}
                        <main className="main-content">
                          <Routes>
                            {/* Публичные маршруты */}
                            <Route path="/" element={<Home />} />
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
                              path="/guest/Guestprofile"
                              element={
                                <ProtectedRoute requireAdmin={false}>
                                  <GuestProfile />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/guest/Guestorders"
                              element={
                                <ProtectedRoute requireAdmin={false}>
                                  <GuestOrders />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/guest/Guestservices"
                              element={
                                <ProtectedRoute requireAdmin={false}>
                                  <GuestServices />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/guest/Guestshop"
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
                              path="/guest/Guestabout"
                              element={
                                <ProtectedRoute requireAdmin={false}>
                                  <GuestAbout />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/guest/Guestcontact"
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
                    </Router>
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