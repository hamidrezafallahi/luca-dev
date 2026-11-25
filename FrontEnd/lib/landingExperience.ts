import 'server-only';

import { serverApiBaseUrl } from './api';
import { logger } from './logger';

export type ExperienceCardKey = 'appointment' | 'fitting' | 'contact';
export type ExperienceCard = {
  cardKey: ExperienceCardKey;
  titleFa: string; titleEn: string;
  bodyFa: string; bodyEn: string;
  ctaTextFa: string; ctaTextEn: string;
  ctaLink: string;
  imageUrl: string; mobileImageUrl: string;
  imageAltFa: string; imageAltEn: string;
};
export type LandingExperienceContent = {
  id: number;
  titleFa: string; titleEn: string;
  cards: ExperienceCard[];
};

/** null means intentionally absent; undefined means the backend was unavailable. */
export async function getLandingExperience(): Promise<LandingExperienceContent | null | undefined> {
  const url = `${serverApiBaseUrl}/LandingExperiences/public`;
  try {
    const response = await fetch(url, { next: { revalidate: 60, tags: ['landingExperience'] } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const json = await response.json();
    if (json?.data == null) return null;
    if (!Array.isArray(json.data.cards)) throw new Error('Invalid landing experience response');
    return json.data;
  } catch (error) {
    logger.error('getLandingExperience failed', { scope: 'landing', source: 'server', url }, error);
    return undefined;
  }
}
