/** Keys shared by the public server registry and the layout editor. */
export const landingKeys = [
  'hero', 'products', 'homeSlider', 'categories', 'features', 'specialOffers',
  'experience', 'usp', 'trust', 'blog', 'testimonials', 'faq', 'contactBand',
] as const;

export type LandingKey = (typeof landingKeys)[number];
export type LandingPageComponent = {
  componentKey: string;
  displayOrder: number;
  isEnabled: boolean;
  isRequired: boolean;
};

export const defaultLandingComponents: LandingPageComponent[] = landingKeys.map((componentKey, displayOrder) => ({
  componentKey,
  displayOrder,
  isEnabled: true,
  isRequired: componentKey === 'hero',
}));
