import {
  Amiri,
  Aref_Ruqaa,
  Cairo,
  Changa,
  El_Messiri,
  Harmattan,
  Lalezar,
  Lateef,
  Lemonada,
  Mada,
  Markazi_Text,
  Noto_Naskh_Arabic,
  Noto_Nastaliq_Urdu,
  Noto_Sans_Arabic,
  Rakkas,
  Readex_Pro,
  Reem_Kufi,
  Scheherazade_New,
  Tajawal,
  Vazirmatn,
} from 'next/font/google';
import localFont from 'next/font/local';

// Luca typefaces: Markazi Text (display) + Vazirmatn (UI). next/font downloads
// them at build time and serves them from /_next/static/media, so the CSP's
// style-src/font-src 'self' allows them and no request goes to Google Fonts.
// Shared by every layout that renders <html> (locale layout, root not-found).
export const displayFont = Markazi_Text({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-markazi',
});

export const bodyFont = Vazirmatn({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
  variable: '--font-vazirmatn',
});

export const iranSansFont = localFont({
  src: [{ path: '../public/fonts/IRANSansWeb(FaNum).woff', weight: '400', style: 'normal' }],
  variable: '--IRANSans-font',
  display: 'swap',
});

// ===== Selectable main fonts (admin → تم سایت → فونت اصلی), see lib/fontCatalog.ts =====
// Not preloaded: the browser downloads a font file only when the active theme
// (or the admin's font preview) actually renders text in it.
const notoSansArabic = Noto_Sans_Arabic({ subsets: ['arabic', 'latin'], display: 'swap', preload: false, variable: '--font-noto-sans-arabic' });
const harmattan = Harmattan({ subsets: ['arabic', 'latin'], display: 'swap', preload: false, weight: ['400', '700'], variable: '--font-harmattan' });
const mada = Mada({ subsets: ['arabic', 'latin'], display: 'swap', preload: false, variable: '--font-mada' });
const tajawal = Tajawal({ subsets: ['arabic', 'latin'], display: 'swap', preload: false, weight: ['400', '700'], variable: '--font-tajawal' });
const cairo = Cairo({ subsets: ['arabic', 'latin'], display: 'swap', preload: false, variable: '--font-cairo' });
const readexPro = Readex_Pro({ subsets: ['arabic', 'latin'], display: 'swap', preload: false, variable: '--font-readex-pro' });
const notoNaskhArabic = Noto_Naskh_Arabic({ subsets: ['arabic', 'latin'], display: 'swap', preload: false, variable: '--font-noto-naskh-arabic' });
const amiri = Amiri({ subsets: ['arabic', 'latin'], display: 'swap', preload: false, weight: ['400', '700'], variable: '--font-amiri' });
const scheherazadeNew = Scheherazade_New({ subsets: ['arabic', 'latin'], display: 'swap', preload: false, weight: ['400', '700'], variable: '--font-scheherazade-new' });
const lateef = Lateef({ subsets: ['arabic', 'latin'], display: 'swap', preload: false, weight: ['400', '700'], variable: '--font-lateef' });
const lalezar = Lalezar({ subsets: ['arabic', 'latin'], display: 'swap', preload: false, weight: '400', variable: '--font-lalezar' });
const reemKufi = Reem_Kufi({ subsets: ['arabic', 'latin'], display: 'swap', preload: false, variable: '--font-reem-kufi' });
const elMessiri = El_Messiri({ subsets: ['arabic', 'latin'], display: 'swap', preload: false, variable: '--font-el-messiri' });
const changa = Changa({ subsets: ['arabic', 'latin'], display: 'swap', preload: false, variable: '--font-changa' });
const arefRuqaa = Aref_Ruqaa({ subsets: ['arabic', 'latin'], display: 'swap', preload: false, weight: ['400', '700'], variable: '--font-aref-ruqaa' });
const rakkas = Rakkas({ subsets: ['arabic', 'latin'], display: 'swap', preload: false, weight: '400', variable: '--font-rakkas' });
const lemonada = Lemonada({ subsets: ['arabic', 'latin'], display: 'swap', preload: false, variable: '--font-lemonada' });
const notoNastaliqUrdu = Noto_Nastaliq_Urdu({ subsets: ['arabic', 'latin'], display: 'swap', preload: false, variable: '--font-noto-nastaliq-urdu' });

export const fontVariables = [
  displayFont,
  bodyFont,
  iranSansFont,
  notoSansArabic,
  harmattan,
  mada,
  tajawal,
  cairo,
  readexPro,
  notoNaskhArabic,
  amiri,
  scheherazadeNew,
  lateef,
  lalezar,
  reemKufi,
  elMessiri,
  changa,
  arefRuqaa,
  rakkas,
  lemonada,
  notoNastaliqUrdu,
]
  .map((font) => font.variable)
  .join(' ');
