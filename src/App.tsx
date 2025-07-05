import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Products from './components/sections/Products';
import Pricing from './components/sections/Pricing';
import Contact from './components/sections/Contact';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProductsPage from './pages/ProductsPage';
import CustomersPage from './pages/CustomersPage';
import EmployeesPage from './pages/EmployeesPage';
import SalesPage from './pages/SalesPage';
import DashboardLayout from './components/layout/DashboardLayout';
import { Toaster } from 'react-hot-toast';

const LandingPage: React.FC = () => {
  return (
    <>
      <Hero />
      <About />
      <Products />
      <Pricing />
      <Contact />
    </>
  );
};

// Individual section pages for navigation
const AboutPage: React.FC = () => {
  return (
    <>
      <Header />
      <main className="flex-grow pt-16">
        <About />
      </main>
      <Footer />
    </>
  );
};

const ProductsPageLanding: React.FC = () => {
  return (
    <>
      <Header />
      <main className="flex-grow pt-16">
        <Products />
      </main>
      <Footer />
    </>
  );
};

const PricingPage: React.FC = () => {
  return (
    <>
      <Header />
      <main className="flex-grow pt-16">
        <Pricing />
      </main>
      <Footer />
    </>
  );
};

const ContactPage: React.FC = () => {
  return (
    <>
      <Header />
      <main className="flex-grow pt-16">
        <Contact />
      </main>
      <Footer />
    </>
  );
};

const OrderPage: React.FC = () => {
  return (
    <>
      <Header />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-8">Pesan Sekarang</h1>
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <p className="text-center text-gray-600 mb-4">
              Untuk melakukan pemesanan, silakan hubungi kami melalui:
            </p>
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-semibold text-lg">WhatsApp</h3>
                <p className="text-kebab-red">+62 812-3456-7890</p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg">Telepon</h3>
                <p className="text-kebab-red">(021) 1234-5678</p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg">Email</h3>
                <p className="text-kebab-red">order@kebabumkm.com</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Routes>
            {/* Landing Page Routes */}
            <Route path="/" element={
              <>
                <Header />
                <main className="flex-grow">
                  <LandingPage />
                </main>
                <Footer />
              </>
            } />
            
            {/* Individual Section Pages */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/products" element={<ProductsPageLanding />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/order" element={<OrderPage />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Dashboard Routes */}
            <Route path="/dashboard" element={
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            } />
            <Route path="/dashboard/products" element={
              <DashboardLayout>
                <ProductsPage />
              </DashboardLayout>
            } />
            <Route path="/dashboard/customers" element={
              <DashboardLayout>
                <CustomersPage />
              </DashboardLayout>
            } />
            <Route path="/dashboard/employees" element={
              <DashboardLayout>
                <EmployeesPage />
              </DashboardLayout>
            } />
            <Route path="/dashboard/sales" element={
              <DashboardLayout>
                <SalesPage />
              </DashboardLayout>
            } />
            
            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
         <Toaster 
          position="top-center" // Kamu bisa memilih posisi lain: 'top-left', 'top-center', 'bottom-left', 'bottom-center', 'bottom-right'
          reverseOrder={false} // Atur apakah notifikasi baru muncul di atas atau di bawah notifikasi lama
          gutter={8} // Jarak antar notifikasi
          containerClassName="" 
        />
      </AuthProvider>
    </Router>
  );
};

export default App;

