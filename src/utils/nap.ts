/** NAP confirmado por el CEO. Misma cadena en footer, contacto y JSON-LD. */

export const BUSINESS_NAME = '77 Studio';

export const PHONE_E164 = '+573148490955';
export const PHONE_DISPLAY = '+57 314 849 0955';
export const PHONE_WHATSAPP = '573148490955';

export const STREET_ADDRESS = 'Cra 14 #35 Norte 18';
export const ADDRESS_LOCALITY = 'Armenia';
export const ADDRESS_REGION = 'Quindío';
export const ADDRESS_COUNTRY_NAME = 'Colombia';
export const ADDRESS_COUNTRY_CODE = 'CO';

export const ADDRESS_LINE = `${STREET_ADDRESS}, ${ADDRESS_LOCALITY}, ${ADDRESS_REGION}, ${ADDRESS_COUNTRY_NAME}`;

export const POSTAL_ADDRESS = {
  '@type': 'PostalAddress' as const,
  streetAddress: STREET_ADDRESS,
  addressLocality: ADDRESS_LOCALITY,
  addressRegion: ADDRESS_REGION,
  addressCountry: ADDRESS_COUNTRY_CODE,
};
