import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Check, Package } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { ShopeeIcon } from '../lib/brandIcons';
import {
  fetchProductById,
  fetchSimilarProducts,
  formatRupiah,
  getProductImages,
  isValidHttpsUrl,
  parseFeatures,
} from '../lib/products';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [brokenUrls, setBrokenUrls] = useState(() => new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadTick, setReloadTick] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    document.title = product?.name
      ? `${product.name} - HOMI CREATIVE`
      : 'Detail Produk - HOMI CREATIVE';
  }, [product]);

  useEffect(() => {
    let cancelled = false;

    async function loadDetail() {
      setLoading(true);
      setError(null);
      setActivePhotoIndex(0);
      setBrokenUrls(new Set());

      const { data, error: fetchError } = await fetchProductById(id);
      if (cancelled) return;

      if (fetchError) {
        setError(fetchError);
        setProduct(null);
        setSimilarProducts([]);
        setLoading(false);
        return;
      }

      setProduct(data);

      if (data) {
        const { data: similar } = await fetchSimilarProducts(data.category, data.id, 3);
        if (!cancelled) {
          setSimilarProducts(similar);
        }
      } else {
        setSimilarProducts([]);
      }

      setLoading(false);
    }

    loadDetail();
    return () => {
      cancelled = true;
    };
  }, [id, reloadTick]);

  function markUrlBroken(url) {
    setBrokenUrls((prev) => {
      const next = new Set(prev);
      next.add(url);
      return next;
    });
  }

  const galleryImages = getProductImages(product);
  const activeImageUrl = galleryImages[activePhotoIndex] || '';
  const showActiveImage = Boolean(activeImageUrl) && !brokenUrls.has(activeImageUrl);
  const features = parseFeatures(product?.features);
  const hasValidShopeeUrl = isValidHttpsUrl(product?.shopee_url);

  return (
    <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-20 pt-6 sm:pt-8 pb-16 sm:pb-20">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="pb-6">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-[#4A554C]">
          <li>
            <Link
              to="/katalog"
              className="min-h-[44px] inline-flex items-center gap-1.5 font-medium hover:text-[#0F7A27] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Kembali ke Katalog</span>
            </Link>
          </li>
          {product?.category && (
            <>
              <li aria-hidden="true" className="text-[#57534E]">
                /
              </li>
              <li>
                <Link
                  to={`/katalog?kategori=${encodeURIComponent(product.category)}`}
                  className="min-h-[44px] inline-flex items-center hover:text-[#0F7A27] transition-colors"
                >
                  {product.category}
                </Link>
              </li>
            </>
          )}
          {product?.name && (
            <>
              <li aria-hidden="true" className="text-[#57534E]">
                /
              </li>
              <li aria-current="page" className="text-[#142217] font-semibold">
                {product.name}
              </li>
            </>
          )}
        </ol>
      </nav>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 pb-16">
          <p className="sr-only" role="status">
            Memuat detail produk...
          </p>
          <div className="lg:col-span-5 flex flex-col gap-4" aria-hidden="true">
            <div className="aspect-[540/480] w-full rounded-[20px] bg-[#EAE6DA] animate-pulse" />
            <div className="flex gap-3">
              <div className="w-20 h-20 sm:w-[100px] sm:h-[100px] rounded-xl bg-[#EAE6DA] animate-pulse" />
              <div className="w-20 h-20 sm:w-[100px] sm:h-[100px] rounded-xl bg-[#EAE6DA] animate-pulse" />
            </div>
          </div>
          <div className="lg:col-span-7 flex flex-col gap-5" aria-hidden="true">
            <div className="h-7 w-32 rounded-full bg-[#EAE6DA] animate-pulse" />
            <div className="h-10 w-3/4 rounded-lg bg-[#EAE6DA] animate-pulse" />
            <div className="h-9 w-40 rounded-lg bg-[#EAE6DA] animate-pulse" />
            <div className="h-20 w-full rounded-lg bg-[#EAE6DA] animate-pulse" />
            <div className="h-44 w-full rounded-2xl bg-[#EAE6DA] animate-pulse" />
            <div className="h-14 w-full rounded-[14px] bg-[#EAE6DA] animate-pulse" />
          </div>
        </div>
      )}

      {/* Error State */}
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
              <h1 className="font-bold text-base">Gagal memuat detail produk</h1>
              <p className="text-sm text-[#4A554C] mt-0.5">{error}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setReloadTick((prev) => prev + 1)}
              className="min-h-[44px] px-5 rounded-[10px] bg-[#0F7A27] hover:bg-[#0B5D1E] text-white text-sm font-semibold transition-colors"
            >
              Coba Lagi
            </button>
            <Link
              to="/katalog"
              className="min-h-[44px] px-5 rounded-[10px] border border-[#E6E3D8] text-sm font-semibold text-[#142217] hover:border-[#0F7A27] inline-flex items-center justify-center transition-colors"
            >
              Ke Katalog
            </Link>
          </div>
        </div>
      )}

      {/* Not Found State */}
      {!loading && !error && !product && (
        <div className="bg-white border border-[#E6E3D8] rounded-2xl p-10 text-center flex flex-col items-center gap-4">
          <h1 className="text-2xl font-bold text-[#142217]">
            Produk tidak ditemukan
          </h1>
          <p className="text-sm text-[#4A554C]">
            Produk yang Anda cari tidak tersedia atau tautannya sudah berubah.
          </p>
          <Link
            to="/katalog"
            className="min-h-[44px] px-6 rounded-[10px] bg-[#0F7A27] hover:bg-[#0B5D1E] text-white text-sm font-semibold inline-flex items-center justify-center transition-colors"
          >
            Kembali ke Katalog
          </Link>
        </div>
      )}

      {/* Main Product Detail */}
      {!loading && !error && product && (
        <>
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 pb-12 sm:pb-16">
            {/* Gallery Column */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="aspect-[540/480] w-full rounded-[20px] bg-white border border-[#D8D3C4] overflow-hidden flex items-center justify-center">
                {showActiveImage ? (
                  <img
                    src={activeImageUrl}
                    alt={`${product.name} - foto ${activePhotoIndex + 1}`}
                    width={540}
                    height={480}
                    fetchPriority="high"
                    loading="eager"
                    className="w-full h-full object-contain bg-white p-4"
                    onError={() => markUrlBroken(activeImageUrl)}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-1.5 px-6 text-center text-[#57534E]">
                    <Package className="w-8 h-8" aria-hidden="true" />
                    <span className="text-[15px] font-semibold text-[#142217]">
                      {product.name}
                    </span>
                    <span className="text-[13px] font-medium">
                      Foto belum tersedia
                    </span>
                  </div>
                )}
              </div>

              {galleryImages.length > 1 && (
                <div className="flex flex-wrap gap-3">
                  {galleryImages.map((imgUrl, index) => {
                    const active = index === activePhotoIndex;
                    const broken = brokenUrls.has(imgUrl);
                    return (
                      <button
                        key={imgUrl}
                        type="button"
                        onClick={() => setActivePhotoIndex(index)}
                        aria-label={`Pilih foto ${index + 1} untuk ${product.name}`}
                        aria-pressed={active}
                        className={`w-20 h-20 sm:w-[100px] sm:h-[100px] rounded-xl overflow-hidden bg-white flex items-center justify-center transition-colors ${
                          active
                            ? 'border-2 border-[#0F7A27]'
                            : 'border border-[#D8D3C4] hover:border-[#0F7A27]'
                        }`}
                      >
                        {broken ? (
                          <span className="text-xs font-medium text-[#57534E]">
                            Foto {index + 1}
                          </span>
                        ) : (
                          <img
                            src={imgUrl}
                            alt=""
                            width={100}
                            height={100}
                            className="w-full h-full object-contain bg-white p-2"
                            onError={() => markUrlBroken(imgUrl)}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Info Column */}
            <div className="lg:col-span-7 flex flex-col items-start gap-5">
              {product.category && (
                <span className="inline-flex rounded-full bg-[#ECF7DC] px-3.5 py-1.5 text-[13px] font-semibold text-[#0F7A27]">
                  {product.category}
                </span>
              )}

              <div className="flex flex-col gap-2.5 w-full">
                <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-bold leading-tight text-[#142217]">
                  {product.name}
                </h1>
                <p className="text-2xl sm:text-[32px] font-bold text-[#0F7A27]">
                  {formatRupiah(product.price)}
                </p>
              </div>

              {product.description && (
                <p className="text-base text-[#4A554C] leading-relaxed">
                  {product.description}
                </p>
              )}

              {features.length > 0 && (
                <div className="w-full bg-white border border-[#E6E3D8] rounded-2xl p-5">
                  <h2 className="sr-only">Keunggulan dan spesifikasi produk</h2>
                  <ul className="flex flex-col gap-3.5">
                    {features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="w-[22px] h-[22px] rounded-full bg-[#ECF7DC] text-[#0F7A27] flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
                        </span>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[15px] font-bold text-[#142217]">
                            {feat.title}
                          </span>
                          {feat.description && (
                            <span className="text-sm text-[#4A554C]">
                              {feat.description}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {hasValidShopeeUrl ? (
                <a
                  href={product.shopee_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full min-h-[56px] px-6 rounded-[14px] bg-[#EE4D2D] hover:bg-[#D93E1F] active:bg-[#C13417] text-white text-[19px] font-bold inline-flex items-center justify-center gap-3 transition-colors"
                >
                  <ShopeeIcon className="w-[22px] h-[22px] text-white" />
                  <span>Beli Produk Ini di Shopee</span>
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="w-full min-h-[56px] px-6 rounded-[14px] bg-[#E6E3D8] text-[#57534E] text-base font-semibold inline-flex items-center justify-center"
                >
                  Tautan Shopee Belum Tersedia
                </button>
              )}
            </div>
          </section>

          {/* Produk Serupa Lainnya */}
          {similarProducts.length > 0 && (
            <section className="pt-8 sm:pt-10 border-t border-[#E6E3D8]">
              <h2 className="text-2xl sm:text-[28px] font-bold text-[#142217] mb-6">
                Produk Serupa Lainnya
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {similarProducts.map((item) => (
                  <ProductCard key={item.id} product={item} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
