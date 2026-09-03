/**
 * Cloudinary URL builder.
 *
 * Source images are uncompressed PNGs of up to 6 MB. Transformations are
 * injected into the delivery path so the origin stays untouched:
 *
 *   /image/upload/f_auto,q_auto,w_800,c_limit/v1786693732/photo.png
 *
 * `f_auto` negotiates AVIF/WebP from the Accept header, `q_auto` applies
 * perceptual compression and `c_limit` resizes without ever upscaling.
 */

const CLOUD_NAME = 'dabfglubl'
const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`

/**
 * @param {string} path - Versioned asset path, e.g. `v1786693647/logo.png`.
 * @param {object} [options]
 * @param {number} [options.width] - Max width in px. Omit to serve the original.
 * @param {string|number} [options.quality] - `auto`, `auto:best`, or 1-100.
 * @param {string} [options.format] - Output format, negotiated by default.
 * @returns {string}
 */
export function cldUrl(path, { width, quality = 'auto', format = 'auto' } = {}) {
  const transforms = [`f_${format}`, `q_${quality}`]
  if (width) transforms.push(`w_${width}`, 'c_limit')
  return `${BASE_URL}/${transforms.join(',')}/${path}`
}

/**
 * Builds a `srcset` so the browser picks the cheapest variant that covers the
 * real layout slot.
 *
 * @param {string} path - Versioned asset path.
 * @param {number[]} widths - Widths to offer, in px.
 * @param {object} [options] - Forwarded to {@link cldUrl}.
 * @returns {string}
 */
export function cldSrcset(path, widths, options = {}) {
  return widths.map((w) => `${cldUrl(path, { ...options, width: w })} ${w}w`).join(', ')
}

/**
 * Heavily blurred 20px thumbnail (~300 bytes) used as a loading placeholder.
 *
 * @param {string} path - Versioned asset path.
 * @returns {string}
 */
export function cldPlaceholder(path) {
  return `${BASE_URL}/f_auto,q_30,w_20,c_limit,e_blur:200/${path}`
}
