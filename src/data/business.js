/**
 * Business details. Single source for the address, phone and hours, which are
 * rendered in both the contact section and the footer.
 */

export const business = {
  name: 'Ñamster Café',
  address: 'Avenida Italia 1450, Providencia',
  phone: { display: '+56 2 2987 6543', href: 'tel:+56229876543' },
  email: 'hola@namstercafe.cl',
  hours: 'Todos los días, 9:00 a 21:00',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Av.+Italia+1450,+Providencia,+Chile',
}

/** Opening hours as local 24h integers, used to derive the live open/closed state. */
export const openingHours = { opens: 9, closes: 21 }

export const socialProfiles = [
  { id: 'instagram', label: 'Instagram', href: 'https://instagram.com/namstercafe' },
  { id: 'facebook', label: 'Facebook', href: 'https://facebook.com/namstercafe' },
  { id: 'tiktok', label: 'TikTok', href: 'https://tiktok.com/@namstercafe' },
  { id: 'pinterest', label: 'Pinterest', href: 'https://pinterest.com/namstercafe' },
]
