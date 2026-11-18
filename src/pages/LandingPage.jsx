import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowRight, Package } from 'lucide-react';
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard';
import { fetchFeaturedProducts, getSafeImageUrl } from '../lib/products';

const KEUNGGULAN_ITEMS = [
  {
    number: '01',
    title: 'Material Alami Pilihan',
    description: 'Terbuat dari kayu dan serat alami berkualitas',
  },
  {
    number: '02',
    title: 'Kuat & Tahan Lama',
    description: 'Kokoh dan awet untuk pemakaian sehari-hari',
  },
  {
    number: '03',
    title: 'Aman & Rapi',
    description: 'Finishing halus dan aman untuk makanan',
  },
];

export default function LandingPage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadTick, setReloadTick] = useState(0);
  const [heroImageError, setHeroImageError] = useState(false);

  useEffect(() => {
    document.title = 'HOMI CREATIVE - Home of Meaningful Items';
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadFeatured() {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await fetchFeaturedProducts(3);
      if (cancelled) return;

      if (fetchError) {
        setError(fetchError);
        setFeaturedProducts([]);
      } else {
        setFeaturedProducts(data);
        setHeroImageError(false);
      }
      setLoading(false);
    }

    loadFeatured();
    return () => {
      cancelled = true;
    };
  }, [reloadTick]);

  const heroProduct = featuredProducts.find((item) => getSafeImageUrl(item?.image_url));
  const heroImageUrl = heroProduct ? getSafeImageUrl(heroProduct.image_url) : '';
  const showHeroImage = Boolean(heroImageUrl) && !heroImageError;

  return (
    <div className="max-w-[1440px] mx-auto">
      {/* Hero 2 Kolom */}
      <section className="px-5 sm:px-8 lg:px-20 py-10 sm:py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-12">
        <div className="lg:col-span-7 flex flex-col items-start gap-5 sm:gap-6">
          <span className="inline-block rounded-full bg-[#A3E626] px-4 py-1.5 text-[13px] font-semibold text-[#0B3B14]">
            Home of Meaningful Items
          </span>

          <div className="flex flex-col gap-4">
            <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-bold leading-[1.15] tracking-tight text-[#142217]">
              Perlengkapan Rumah &amp; Dapur Alami yang Tahan Lama
            </h1>
            <p className="max-w-[640px] text-base sm:text-lg text-[#4A554C] leading-relaxed">
              Dibuat dari kerajinan kayu dan serat alami pilihan oleh perajin lokal.
              Hangat, fungsional, dan dirancang tahan lama untuk keseharian di rumah.
            </p>
          </div>

          <Link
            to="/katalog"
            className="min-h-[50px] px-7 rounded-xl bg-[#0F7A27] hover:bg-[#0B5D1E] active:bg-[#084716] text-white text-base font-semibold inline-flex items-center justify-center transition-colors"
          >
            Lihat Katalog Produk
          </Link>
        </div>

        <div className="lg:col-span-5 w-full">
          <div className="aspect-[540/420] w-full rounded-3xl bg-[#EAE6DA] border border-[#D8D3C4] overflow-hidden flex items-center justify-center">
            {showHeroImage ? (
              <img
                src={heroImageUrl}
                alt={heroProduct.name || 'Produk unggulan HOMI CREATIVE'}
                width={540}
                height={420}
                fetchPriority="high"
                loading="eager"
                className="w-full h-full object-cover"
                onError={() => setHeroImageError(true)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 px-6 text-center text-[#57534E]">
                <Package className="w-8 h-8" aria-hidden="true" />
                <span className="text-[15px] font-medium">
                  Foto Produk Utama (540 × 420)
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Keunggulan Kami */}
      <section className="px-5 sm:px-8 lg:px-20 py-10 sm:py-14 lg:py-[60px]">
        <h2 className="text-2xl sm:text-[28px] font-bold text-[#142217] mb-6 sm:mb-8">
          Keunggulan Kami
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {KEUNGGULAN_ITEMS.map((item) => (
            <div
              key={item.number}
              className="bg-white border border-[#E6E3D8] rounded-2xl p-6 sm:p-7 flex flex-col gap-3.5"
            >
              <div className="w-9 h-9 rounded-[10px] bg-[#ECF7DC] text-[#0F7A27] text-sm font-bold flex items-center justify-center">
                {item.number}
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold text-[#142217] leading-snug">
                  {item.title}
                </h3>
                <p className="text-[15px] text-[#4A554C] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Produk Pilihan */}
      <section className="px-5 sm:px-8 lg:px-20 py-10 sm:py-14 lg:py-[60px]">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-[28px] font-bold text-[#142217]">
            Produk Pilihan
          </h2>
          <Link
            to="/katalog"
            className="min-h-[44px] inline-flex items-center gap-1.5 text-[15px] font-semibold text-[#0F7A27] hover:text-[#0B5D1E] hover:underline transition-colors"
          >
            <span>Lihat Semua Katalog</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        {loading && (
          <>
            <p className="sr-only" role="status">
              Memuat produk pilihan...
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
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
                <p className="font-bold text-base">Gagal memuat produk pilihan</p>
                <p className="text-sm text-[#4A554C] mt-0.5">{error}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setReloadTick((prev) => prev + 1)}
              className="min-h-[44px] px-5 rounded-[10px] bg-[#0F7A27] hover:bg-[#0B5D1E] text-white text-sm font-semibold shrink-0 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {!loading && !error && featuredProducts.length === 0 && (
          <div className="bg-white border border-[#E6E3D8] rounded-2xl p-8 text-center flex flex-col items-center gap-4">
            <p className="text-base text-[#4A554C]">
              Belum ada produk pilihan yang ditandai saat ini.
            </p>
            <Link
              to="/katalog"
              className="min-h-[44px] px-6 rounded-[10px] border border-[#0F7A27] text-sm font-semibold text-[#0F7A27] hover:bg-[#0F7A27] hover:text-white inline-flex items-center justify-center transition-colors"
            >
              Jelajahi Semua Katalog
            </Link>
          </div>
        )}

        {!loading && !error && featuredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
