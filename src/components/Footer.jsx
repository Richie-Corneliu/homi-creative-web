import { InstagramIcon, ShopeeIcon } from '../lib/brandIcons';
import { isValidHttpsUrl } from '../lib/products';

// TODO: Set VITE_INSTAGRAM_URL and VITE_SHOPEE_URL in .env to point to exact store handles.
const DEFAULT_INSTAGRAM_URL = 'https://www.instagram.com/';
const DEFAULT_SHOPEE_URL = 'https://shopee.co.id/';

export default function Footer() {
  const envInstagram = import.meta.env.VITE_INSTAGRAM_URL;
  const envShopee = import.meta.env.VITE_SHOPEE_URL;

  const instagramUrl = isValidHttpsUrl(envInstagram)
    ? envInstagram
    : DEFAULT_INSTAGRAM_URL;
  const shopeeUrl = isValidHttpsUrl(envShopee)
    ? envShopee
    : DEFAULT_SHOPEE_URL;

  return (
    <footer className="bg-[#0B5D1E] text-white">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-20 py-12 sm:py-16 lg:py-20 flex flex-col items-center text-center gap-6">
        <div className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-2.5">
          <img
            src="/logo.png"
            alt="Homi Creative"
            width={639}
            height={206}
            className="h-12 w-auto object-contain"
          />
        </div>

        <h2 className="max-w-[720px] text-2xl sm:text-3xl lg:text-[34px] font-bold leading-tight text-white">
          Tertarik? Hubungi kami lewat Instagram atau bisa kunjungi Shopee
        </h2>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 sm:gap-5 w-full sm:w-auto">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[56px] px-8 rounded-[14px] bg-white text-[#142217] hover:bg-[#FAF9F5] active:bg-[#EAE6DA] inline-flex items-center justify-center gap-3 text-base font-bold transition-colors focus-visible:outline-white"
          >
            <InstagramIcon className="w-[22px] h-[22px] text-[#142217]" />
            <span>Instagram</span>
          </a>

          <a
            href={shopeeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[56px] px-8 rounded-[14px] bg-[#EE4D2D] text-white hover:bg-[#D93E1F] active:bg-[#C13417] inline-flex items-center justify-center gap-3 text-[19px] font-bold transition-colors focus-visible:outline-white"
          >
            <ShopeeIcon className="w-[22px] h-[22px] text-white" />
            <span>Shopee</span>
          </a>
        </div>

        <p className="text-sm text-[#B8DFC2]">
          © 2026 HOMI CREATIVE - Home of Meaningful Items
        </p>
      </div>
    </footer>
  );
}
