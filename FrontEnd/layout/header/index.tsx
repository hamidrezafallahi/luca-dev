import { getLocale } from 'next-intl/server';

import { getCurrentAnnouncement, resolveAnnouncementHref } from '@lib/announcement';
import { toMediaUrl } from '@utils/toMediaUrl';

import HeaderClient from './headerClient';

const HEX = /^#[0-9a-fA-F]{6}$/;

/**
 * Server shell: loads the announcement bar that the admin scheduled for "now"
 * (text, link, colours, background image, height) and hands it to the client header.
 * The bar height is published as --store-announce-h (0 when there is no bar).
 */
export default async function Header() {
  const [locale, bar] = await Promise.all([getLocale(), getCurrentAnnouncement()]);

  const message = bar
    ? (locale === 'fa' ? bar.messageFa || bar.messageEn : bar.messageEn || bar.messageFa)?.trim()
    : '';
  const visible = Boolean(bar && message);

  const announcement =
    bar && visible
      ? {
          message: message as string,
          link: resolveAnnouncementHref(locale, bar.linkUrl),
          backgroundColor: HEX.test(bar.backgroundColor) ? bar.backgroundColor : '#1e3a8a',
          textColor: HEX.test(bar.textColor) ? bar.textColor : '#ffffff',
          backgroundImage: toMediaUrl(bar.backgroundImageUrl) || null,
        }
      : null;

  const heightPx = visible && bar ? Math.round(Number(bar.heightPx) || 36) : 0;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `:root:root{--store-announce-h:${heightPx}px}` }} />
      <HeaderClient announcement={announcement} />
    </>
  );
}
