/**
 * One source of truth for the sign-in and sign-up forms so they can never drift apart.
 * Built on the Luca form classes (globals.css) and theme tokens (ThemeSettings in the database).
 */
export const authSubtitle = 'font-body font-normal text-base luca-muted';

export const authLabel = 'luca-label';

export const authInput = 'luca-input';

export const authInputError = '!border-error';

export const authError = 'mt-1 text-error text-[13px]';

export const authPrimaryButton =
  'bg-primary hover:bg-primary/90 disabled:opacity-50 w-full h-14 text-[15px] text-primary-foreground';

export const authFooter = 'text-sm text-center luca-muted';

export const authFooterLink = 'text-store-text underline underline-offset-[5px]';
