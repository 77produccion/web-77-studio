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

/** Horario de referencia. Pendiente de confirmar con el equipo. */
export const OPENING_HOURS_NOTE =
  'Horario de referencia, pendiente de confirmar: lunes a viernes de 8:00 a. m. a 6:00 p. m. y sábados de 9:00 a. m. a 1:00 p. m.';

export const OPENING_HOURS_SPEC = [
  {
    '@type': 'OpeningHoursSpecification' as const,
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '08:00',
    closes: '18:00',
  },
  {
    '@type': 'OpeningHoursSpecification' as const,
    dayOfWeek: 'Saturday',
    opens: '09:00',
    closes: '13:00',
  },
];
