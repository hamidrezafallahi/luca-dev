import 'server-only';

import { serverApiBaseUrl } from './api';
import { logger } from './logger';
import { defaultLandingComponents, type LandingPageComponent } from './landingPageContract';

export async function getLandingPageComponents(): Promise<LandingPageComponent[]> {
  const url = `${serverApiBaseUrl}/LandingPageComponents/public`;
  try {
    const response = await fetch(url, { next: { revalidate: 60, tags: ['landingPageComponents'] } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const json = await response.json();
    if (!Array.isArray(json?.data)) throw new Error('Invalid landing component response');
    return json.data;
  } catch (error) {
    logger.error('getLandingPageComponents failed', { scope: 'landing', source: 'server', url }, error);
    return defaultLandingComponents;
  }
}
