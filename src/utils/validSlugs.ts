import {slugify} from './deviceUtils';

export const VALID_TYPE_SLUGS = new Set([
  'dimmer',
  'light',
  'misc',
  'plug',
  'relay',
  'sensor',
  'switch',
]);

export const VALID_BOARD_SLUGS = new Set([
  'bk72xx',
  'esp32',
  'esp8266',
  'rp2040',
  'rtl87xx',
]);

export const VALID_STANDARD_SLUGS = new Set([
  'au',
  'br',
  'eu',
  'global',
  'in',
  'uk',
  'us',
]);

export const getSlugIfValid = (
  value: string,
  validSlugs: ReadonlySet<string>,
): string | null => {
  const slug = slugify(value);

  return validSlugs.has(slug) ? slug : null;
};

