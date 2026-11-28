/** Hosts that may send hits to the production GA4 property. */
export const GA_PRODUCTION_HOSTS = ['www.77studio.co', '77studio.co'] as const;

/** Production measurement ID. Overridable with PUBLIC_GA4_MEASUREMENT_ID. */
export const GA_MEASUREMENT_ID_DEFAULT = 'G-8DCJ7P4HBB';

export const GTM_ID_DEFAULT = 'GTM-M6NH5PGW';

export function resolveGaMeasurementId(envValue: string | undefined | null): string {
  const trimmed = envValue?.trim();
  return trimmed || GA_MEASUREMENT_ID_DEFAULT;
}

export function resolveGtmId(envValue: string | undefined | null): string {
  const trimmed = envValue?.trim();
  return trimmed || GTM_ID_DEFAULT;
}

export function isProductionAnalyticsHost(hostname: string): boolean {
  return (GA_PRODUCTION_HOSTS as readonly string[]).includes(hostname);
}

/**
 * The Google tag is emitted only for a production build that is not a
 * Vercel preview/dev deploy. The browser still has to be on a production host
 * before the script requests gtag/GTM.
 */
export function shouldEmitGoogleTag(options: {
  prod: boolean;
  vercelEnv?: string | undefined;
  measurementId: string;
}): boolean {
  if (!options.prod) return false;
  if (!options.measurementId) return false;
  if (options.vercelEnv === 'preview' || options.vercelEnv === 'development') return false;
  return true;
}

export function shouldLoadGoogleTag(options: {
  prod: boolean;
  vercelEnv?: string | undefined;
  hostname: string;
  measurementId: string;
}): boolean {
  return shouldEmitGoogleTag(options) && isProductionAnalyticsHost(options.hostname);
}
