/**
 * Products shown as the immersive feature card (LUCA Card System v02).
 *
 * The API has no "featured" flag, so the choice lives here and no API contract changes.
 * Key each entry by the product's slug, or by its numeric id as a string.
 * Keep the list short: the immersive card is a deliberate highlight, and every
 * other product keeps the editorial card.
 *
 * `image` is optional lifestyle photography for the full-bleed background, as a
 * path under /public or an uploads path. Without it the product's own main image
 * is used. Only real product or brand photography belongs here.
 *
 * `imagePosition` is a CSS object-position for that photo (default: centre), for
 * keeping the subject clear of the text at the bottom of the card.
 *
 * `tint` is the photo's dominant dark tone, picked by eye from the photo (a deep
 * teal for a sea view, a dark olive for a meadow). The lower half of the card is
 * shaded in it so the text panel reads as part of the photo. Default: charcoal.
 */
export type FeaturedProduct = {
  image?: string;
  imagePosition?: string;
  tint?: string;
};

export const FEATURED_PRODUCTS: Record<string, FeaturedProduct> = {
  // Headband C300, with the studio photo already used on the story page.
  'luca-c300-headband-loupe-2': {
    image: '/images/landingPage/luca-headband-loupe.png',
    imagePosition: 'center 20%',
    // Graphite of the studio backdrop.
    tint: '#1c1e20',
  },};

export function getFeaturedProduct(product: {
  id?: number | string | null;
  slug?: string | null;
}): FeaturedProduct | null {
  if (product.slug && FEATURED_PRODUCTS[product.slug]) return FEATURED_PRODUCTS[product.slug];
  if (product.id != null && FEATURED_PRODUCTS[String(product.id)]) {
    return FEATURED_PRODUCTS[String(product.id)];
  }
  return null;
}
