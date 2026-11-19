import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Landing' },
  { to: '/katalog', label: 'Katalog' },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [openPath, setOpenPath] = useState(null);
  const mobileOpen = openPath === pathname;

  useEffect(() => {
    if (!mobileOpen) return undefined;
    function onKeyDown(event) {
      if (event.key === 'Escape') {
        setOpenPath(null);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  function isRouteActive(to) {
    if (to === '/') return pathname === '/';
    return pathname === to || pathname.startsWith('/produk');
  }

  return (
    <header className="bg-[#FAF9F5] border-b border-[#E6E3D8]">
      <div className="max-w-[1440px] mx-auto h-20 px-5 sm:px-8 lg:px-20 flex items-center justify-between gap-4">
        <Link
          to="/"
          className="min-h-[44px] inline-flex items-center shrink-0"
        >
          <img
            src="/logo.png"
            alt="Homi Creative"
            width={639}
            height={206}
            className="h-10 sm:h-11 w-auto object-contain"
          />
        </Link>

        <nav aria-label="Navigasi utama" className="hidden sm:flex items-center gap-9">
          {NAV_ITEMS.map((item) => {
            const active = isRouteActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={active ? 'page' : undefined}
                className={`min-h-[44px] inline-flex items-center text-[15px] border-b-2 transition-colors ${
                  active
                    ? 'text-[#0F7A27] font-bold border-[#0F7A27]'
                    : 'text-[#4A554C] font-medium border-transparent hover:text-[#0F7A27]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="sm:hidden min-h-[44px] min-w-[44px] px-3 inline-flex items-center justify-center gap-2 rounded-[10px] border border-[#E6E3D8] bg-white text-[#142217] text-sm font-semibold hover:border-[#0F7A27] transition-colors"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          onClick={() =>
            setOpenPath((prev) => (prev === pathname ? null : pathname))
          }
        >
          {mobileOpen ? (
            <X className="w-5 h-5" aria-hidden="true" />
          ) : (
            <Menu className="w-5 h-5" aria-hidden="true" />
          )}
          <span>Menu</span>
        </button>
      </div>

      {mobileOpen && (
        <nav
          id="mobile-nav"
          aria-label="Navigasi seluler"
          className="sm:hidden border-t border-[#E6E3D8] bg-[#FAF9F5] px-5 py-3 flex flex-col gap-2"
        >
          {NAV_ITEMS.map((item) => {
            const active = isRouteActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={active ? 'page' : undefined}
                className={`min-h-[44px] px-3 rounded-[10px] flex items-center justify-between text-[15px] transition-colors ${
                  active
                    ? 'bg-[#ECF7DC] text-[#0F7A27] font-bold'
                    : 'text-[#4A554C] font-medium hover:bg-white hover:text-[#0F7A27]'
                }`}
              >
                <span>{item.label}</span>
                {active && (
                  <span className="text-xs font-semibold text-[#0F7A27]">Aktif</span>
                )}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
