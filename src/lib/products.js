import { isSupabaseConfigured, supabase } from './supabase.js';

export const PRODUCT_CATEGORIES = ['Semua', 'Alat Kebersihan', 'Dapur & Rumah'];

/**
 * Format numeric price into Indonesian Rupiah display (e.g. "Rp 35.000").
 */
export function formatRupiah(value) {
  if (value === null || value === undefined || value === '') {
    return 'Harga belum tersedia';
  }
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return 'Harga belum tersedia';
  }
  return `Rp ${new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 0,
  }).format(numeric)}`;
}

/**
 * Validate external HTTPS URLs before rendering anchor destinations.
 */
export function isValidHttpsUrl(url) {
  if (typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed.startsWith('https://')) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' && Boolean(parsed.hostname);
  } catch {
    return false;
  }
}

/**
 * Allow safe HTTPS URLs or root-relative image paths.
 */
export function getSafeImageUrl(url) {
  if (typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('/')) return trimmed;
  return isValidHttpsUrl(trimmed) ? trimmed : '';
}

/**
 * Extract unique safe image URLs from product fields for gallery display.
 */
export function getProductImages(product) {
  if (!product || typeof product !== 'object') return [];
  const candidates = [];

  if (product.image_url) {
    candidates.push(product.image_url);
  }

  const galleryField = product.images ?? product.gallery ?? product.gallery_urls;
  if (Array.isArray(galleryField)) {
    candidates.push(...galleryField);
  } else if (typeof galleryField === 'string' && galleryField.trim().startsWith('[')) {
    try {
      const parsed = JSON.parse(galleryField);
      if (Array.isArray(parsed)) candidates.push(...parsed);
    } catch {
      // Ignore malformed gallery JSON so UI falls back cleanly to image_url.
    }
  }

  const seen = new Set();
  const safeUrls = [];
  for (const raw of candidates) {
    const safe = getSafeImageUrl(raw);
    if (safe && !seen.has(safe)) {
      seen.add(safe);
      safeUrls.push(safe);
    }
  }
  return safeUrls;
}

/**
 * Normalize JSON array features into { title, description } items.
 */
export function parseFeatures(rawFeatures) {
  if (!rawFeatures) return [];

  let list = rawFeatures;
  if (typeof rawFeatures === 'string') {
    const trimmed = rawFeatures.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith('[')) {
      try {
        list = JSON.parse(trimmed);
      } catch {
        list = [trimmed];
      }
    } else {
      list = [trimmed];
    }
  }

  if (!Array.isArray(list)) return [];

  return list
    .map((item) => {
      if (typeof item === 'string') {
        const text = item.trim();
        return text ? { title: text, description: '' } : null;
      }
      if (item && typeof item === 'object') {
        const title = String(item.title ?? item.name ?? item.label ?? item.judul ?? '').trim();
        const description = String(
          item.description ?? item.desc ?? item.detail ?? item.deskripsi ?? ''
        ).trim();
        if (!title && !description) return null;
        return { title: title || description, description: title ? description : '' };
      }
      return null;
    })
    .filter(Boolean);
}

function getConfigError() {
  return 'Konfigurasi Supabase belum lengkap. Pastikan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY tersedia di file .env.';
}

function formatSupabaseError(error) {
  if (!error) return 'Terjadi kesalahan saat mengambil data produk.';
  return error.message || 'Gagal memuat data produk dari server.';
}

/**
 * Fetch featured products (is_featured = true) using read-only SELECT.
 */
export async function fetchFeaturedProducts(limit = 3) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: [], error: getConfigError() };
  }
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .order('id', { ascending: true })
    .limit(limit);

  if (error) {
    return { data: [], error: formatSupabaseError(error) };
  }
  return { data: data ?? [], error: null };
}

/**
 * Fetch all catalog products using read-only SELECT.
 */
export async function fetchAllProducts() {
  if (!isSupabaseConfigured || !supabase) {
    return { data: [], error: getConfigError() };
  }
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    return { data: [], error: formatSupabaseError(error) };
  }
  return { data: data ?? [], error: null };
}

/**
 * Fetch single product by ID using read-only SELECT.
 */
export async function fetchProductById(id) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: getConfigError() };
  }
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    return { data: null, error: formatSupabaseError(error) };
  }
  return { data: data ?? null, error: null };
}

/**
 * Fetch up to 3 similar products (preferring same category, excluding current ID).
 */
export async function fetchSimilarProducts(category, excludeId, limit = 3) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: [], error: getConfigError() };
  }
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .neq('id', excludeId)
    .order('id', { ascending: true });

  if (error) {
    return { data: [], error: formatSupabaseError(error) };
  }

  const rows = data ?? [];
  const sameCategory = category ? rows.filter((item) => item.category === category) : [];
  const others = category ? rows.filter((item) => item.category !== category) : rows;
  return { data: [...sameCategory, ...others].slice(0, limit), error: null };
}
