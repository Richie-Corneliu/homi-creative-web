import { useEffect } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import CatalogPage from './pages/CatalogPage';
import ProductDetail from './pages/ProductDetail';

function NotFoundPage() {
  useEffect(() => {
    document.title = 'Halaman Tidak Ditemukan - HOMI CREATIVE';
  }, []);

  return (
    <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-20 py-20 text-center flex flex-col items-center gap-4">
      <h1 className="text-3xl font-bold text-[#142217]">Halaman Tidak Ditemukan</h1>
      <p className="text-base text-[#4A554C]">
        Alamat halaman yang Anda buka tidak tersedia.
      </p>
      <Link
        to="/katalog"
        className="min-h-[44px] px-6 rounded-xl bg-[#0F7A27] hover:bg-[#0B5D1E] text-white text-sm font-semibold inline-flex items-center justify-center transition-colors"
      >
        Buka Katalog Produk
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#142217]">
        <a href="#main-content" className="skip-link">
          Lewati ke konten utama
        </a>
        <Navbar />
        <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/katalog" element={<CatalogPage />} />
            <Route path="/produk/:id" element={<ProductDetail />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
