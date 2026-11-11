/** NAP del Google Business Profile verificado. Misma cadena en footer, contacto y JSON-LD. */

export const BUSINESS_NAME = '77 Studio';

export const PHONE_E164 = '+573148490955';
export const PHONE_DISPLAY = '+57 314 849 0955';
export const PHONE_WHATSAPP = '573148490955';

export const FOUNDING_DATE = '2018-08-15';

export const STREET_ADDRESS = 'Cra. 14 #35 Norte-18, Oficina 405';
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

/**
 * Pin público del edificio que anuncia esta misma dirección
 * (Icono Centro Empresarial, Cra. 14 #35 norte-18, Armenia).
 * No es un levantamiento topográfico del local. Pendiente de confirmar el punto exacto.
 */
export const GEO_LATITUDE = 4.565182;
export const GEO_LONGITUDE = -75.650015;

export const GEO_COORDINATES = {
  '@type': 'GeoCoordinates' as const,
  latitude: GEO_LATITUDE,
  longitude: GEO_LONGITUDE,
};

/** Horario del Google Business Profile. Domingo cerrado. */
export const OPENING_HOURS_NOTE =
  'Lunes a viernes de 8:00 a. m. a 7:00 p. m. Sábados de 8:00 a. m. a 12:30 p. m. Domingos cerrado.';

export const OPENING_HOURS_NOTE_EN =
  'Monday to Friday, 8:00 a.m. to 7:00 p.m. Saturday, 8:00 a.m. to 12:30 p.m. Sunday closed. Colombia time.';

export const OPENING_HOURS_SPEC = [
  {
    '@type': 'OpeningHoursSpecification' as const,
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '08:00',
    closes: '19:00',
  },
  {
    '@type': 'OpeningHoursSpecification' as const,
    dayOfWeek: 'Saturday',
    opens: '08:00',
    closes: '12:30',
  },
  {
    '@type': 'OpeningHoursSpecification' as const,
    dayOfWeek: 'Sunday',
    opens: '00:00',
    closes: '00:00',
  },
];

export const SOCIAL_PROFILES = [
  { label: 'Instagram', href: 'https://www.instagram.com/77studio_/' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@77_studioss' },
  { label: 'Facebook', href: 'https://www.facebook.com/77studio.co/' },
] as const;

export const SAME_AS = SOCIAL_PROFILES.map((profile) => profile.href);
