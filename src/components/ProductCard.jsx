import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { formatRupiah, getSafeImageUrl } from '../lib/products';

export default function ProductCard({ product, eager = false }) {
  const [imgError, setImgError] = useState(false);
  const safeImageUrl = getSafeImageUrl(product?.image_url);
  const showImage = Boolean(safeImageUrl) && !imgError;

  return (
    <article className="bg-white border border-[#E6E3D8] rounded-2xl p-4 flex flex-col gap-3.5 h-full">
      <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-white border border-[#D8D3C4] flex items-center justify-center">
        {showImage ? (
          <img
            src={safeImageUrl}
            alt={product.name || 'Produk HOMI CREATIVE'}
            width={400}
            height={300}
            loading={eager ? 'eager' : 'lazy'}
            className="w-full h-full object-contain bg-white p-3"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-1.5 px-4 text-center text-[#57534E]">
            <Package className="w-6 h-6" aria-hidden="true" />
            <span className="text-[13px] font-medium">Foto belum tersedia</span>
          </div>
        )}
      </div>

      <div className="flex flex-col items-start gap-1.5 flex-1">
        {product?.category && (
          <span className="inline-flex rounded-full bg-[#ECF7DC] px-2.5 py-1 text-xs font-semibold text-[#0F7A27]">
            {product.category}
          </span>
        )}
        <h3 className="text-lg font-bold text-[#142217] leading-snug">
          {product?.name || 'Produk Tanpa Nama'}
        </h3>
        <p className="text-base font-semibold text-[#0F7A27]">
          {formatRupiah(product?.price)}
        </p>
      </div>

      <Link
        to={`/produk/${product.id}`}
        className="mt-auto min-h-[44px] w-full inline-flex items-center justify-center rounded-[10px] border border-[#0F7A27] px-4 py-2 text-sm font-semibold text-[#0F7A27] hover:bg-[#0F7A27] hover:text-white active:bg-[#0B5D1E] transition-colors"
      >
        Lihat Detail
      </Link>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div
      className="bg-white border border-[#E6E3D8] rounded-2xl p-4 flex flex-col gap-3.5"
      aria-hidden="true"
    >
      <div className="aspect-[4/3] w-full rounded-xl bg-[#EAE6DA] animate-pulse" />
      <div className="flex flex-col gap-2">
        <div className="h-5 w-28 rounded-full bg-[#EAE6DA] animate-pulse" />
        <div className="h-6 w-3/4 rounded-md bg-[#EAE6DA] animate-pulse" />
        <div className="h-5 w-24 rounded-md bg-[#EAE6DA] animate-pulse" />
      </div>
      <div className="mt-auto h-11 w-full rounded-[10px] bg-[#EAE6DA] animate-pulse" />
    </div>
  );
}
