import 'server-only';

import { serverApiBaseUrl } from './api';
import { logger } from './logger';

export type LandingFeature = {
  id: number;
  imageUrl: string;
  eyebrowFa: string; eyebrowEn: string;
  titleFa: string; titleEn: string;
  bodyFa: string; bodyEn: string;
  linkTextFa: string; linkTextEn: string;
  linkUrl: string;
  reverse: boolean;
};

export async function getLandingFeatures(): Promise<LandingFeature[]> {
  const url = `${serverApiBaseUrl}/LandingFeatures/public`;
  try {
    const response = await fetch(url, { next: { revalidate: 60, tags: ['landingFeatures'] } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const json = await response.json();
    return Array.isArray(json?.data) ? json.data : [];
  } catch (error) {
    logger.error('getLandingFeatures failed', { scope: 'landing', source: 'server', url }, error);
    return [];
  }
}
