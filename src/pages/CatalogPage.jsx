import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertCircle, Search, X } from 'lucide-react';
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard';
import { PRODUCT_CATEGORIES, fetchAllProducts } from '../lib/products';

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const paramCat = searchParams.get('kategori');
  const activeCategory = PRODUCT_CATEGORIES.includes(paramCat)
    ? paramCat
    : 'Semua';

  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadTick, setReloadTick] = useState(0);

  useEffect(() => {
    document.title = 'Katalog Produk - HOMI CREATIVE';
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await fetchAllProducts();
      if (cancelled) return;

      if (fetchError) {
        setError(fetchError);
        setProducts([]);
      } else {
        setProducts(data);
      }
      setLoading(false);
    }

    loadProducts();
    return () => {
      cancelled = true;
    };
  }, [reloadTick]);

  function handleSelectCategory(category) {
    if (category === 'Semua') {
      setSearchParams({}, { replace: true });
    } else {
      setSearchParams({ kategori: category }, { replace: true });
    }
  }

  function handleResetFilters() {
    setSearchQuery('');
    handleSelectCategory('Semua');
  }

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return products.filter((item) => {
      const matchesCategory =
        activeCategory === 'Semua' || item.category === activeCategory;
      if (!matchesCategory) return false;
      if (!query) return true;
      const name = String(item.name ?? '').toLowerCase();
      const description = String(item.description ?? '').toLowerCase();
      const category = String(item.category ?? '').toLowerCase();
      return (
        name.includes(query) ||
        description.includes(query) ||
        category.includes(query)
      );
    });
  }, [products, activeCategory, searchQuery]);

  return (
    <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-20 pt-10 sm:pt-14 pb-16 sm:pb-20">
      {/* Header & Filter */}
      <section className="flex flex-col gap-6 pb-8">
        <div className="flex flex-col gap-2.5">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#142217]">
            Katalog Produk
          </h1>
          <p className="text-base sm:text-lg text-[#4A554C]">
            Temukan perlengkapan kebersihan dan peralatan dapur berbahan alami
          </p>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div
            role="tablist"
            aria-label="Filter kategori produk"
            className="flex flex-wrap items-center gap-3"
          >
            {PRODUCT_CATEGORIES.map((category) => {
              const selected = activeCategory === category;
              const label =
                category === 'Semua' && !loading && !error
                  ? `Semua (${products.length})`
                  : category;

              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => handleSelectCategory(category)}
                  className={`min-h-[44px] px-5 rounded-full text-sm transition-colors ${
                    selected
                      ? 'bg-[#0F7A27] text-white font-semibold'
                      : 'bg-white border border-[#E6E3D8] text-[#3D473E] font-medium hover:border-[#0F7A27] hover:text-[#0F7A27]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="w-full lg:w-80">
            <label
              htmlFor="catalog-search"
              className="block text-xs font-semibold text-[#4A554C] mb-1.5"
            >
              Cari produk
            </label>
            <div className="relative flex items-center">
              <Search
                className="w-4 h-4 text-[#57534E] absolute left-3.5 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="catalog-search"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Cari sapu, cobek, spatula..."
                className="w-full min-h-[44px] rounded-xl bg-white border border-[#E6E3D8] pl-10 pr-11 py-2 text-sm text-[#142217] placeholder:text-[#57534E] focus:border-[#0F7A27]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Hapus kata kunci pencarian"
                  className="absolute right-0 min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-[#57534E] hover:text-[#142217]"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Grid Produk */}
      {loading && (
        <>
          <p className="sr-only" role="status">
            Memuat daftar produk katalog...
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <ProductCardSkeleton key={idx} />
            ))}
          </div>
        </>
      )}

      {!loading && error && (
        <div
          role="alert"
          className="bg-white border border-red-300 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3 text-[#142217]">
            <AlertCircle
              className="w-5 h-5 text-red-700 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div>
              <p className="font-bold text-base">Gagal memuat katalog produk</p>
              <p className="text-sm text-[#4A554C] mt-0.5">{error}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setReloadTick((prev) => prev + 1)}
            className="min-h-[44px] px-5 rounded-[10px] bg-[#0F7A27] hover:bg-[#0B5D1E] text-white text-sm font-semibold shrink-0 transition-colors"
          >
            Coba Muat Ulang
          </button>
        </div>
      )}

      {!loading && !error && filteredProducts.length === 0 && (
        <div className="bg-white border border-[#E6E3D8] rounded-2xl p-10 text-center flex flex-col items-center gap-4">
          <p className="text-base font-semibold text-[#142217]">
            {products.length === 0
              ? 'Belum ada produk yang tersedia di katalog.'
              : 'Produk tidak ditemukan untuk kategori atau kata kunci tersebut.'}
          </p>
          <p className="text-sm text-[#4A554C]">
            {products.length === 0
              ? 'Silakan periksa kembali nanti atau hubungi kami lewat Instagram.'
              : 'Coba ubah kata kunci pencarian atau tampilkan semua kategori.'}
          </p>
          {products.length > 0 && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="min-h-[44px] px-5 rounded-[10px] bg-[#0F7A27] hover:bg-[#0B5D1E] text-white text-sm font-semibold transition-colors"
            >
              Tampilkan Semua Produk
            </button>
          )}
        </div>
      )}

      {!loading && !error && filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
