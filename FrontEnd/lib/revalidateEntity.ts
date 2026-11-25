'use server';

import {
  revalidatePath,
  revalidateTag,
} from 'next/cache';

/** Cache bust after a successful client-side BFF save (no file body on this hop). */
export async function revalidateEntity(endPoint: string) {
  const normalized = endPoint.replace(/^\/+/, '');
  revalidatePath(`/fa/admin/${normalized}`);
  revalidatePath(`/en/admin/${normalized}`);
  revalidateTag(normalized);
  if (normalized.toLowerCase() === 'aboutsections') {
    revalidatePath('/fa/story');
    revalidatePath('/en/story');
  }
  if (normalized.toLowerCase() === 'landingfeatures') {
    revalidatePath('/fa');
    revalidatePath('/en');
  }
  if (normalized.toLowerCase() === 'landingexperiences' || normalized.toLowerCase() === 'landingpagecomponents') {
    revalidateTag(normalized.toLowerCase() === 'landingexperiences' ? 'landingExperience' : 'landingPageComponents');
    revalidatePath('/fa');
    revalidatePath('/en');
  }
}
