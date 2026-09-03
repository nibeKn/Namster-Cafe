export const navigationLinks = [
  { label: 'Inicio', href: '#hero' },
  { label: 'Servicios', href: '#services' },
  { label: 'Reseñas', href: '#testimonials' },
  { label: 'Carta', href: '#drinks' },
  { label: 'Tienda', href: '#merch' },
  { label: 'Reservas', href: '#reservation' },
  { label: 'Contacto', href: '#contact' },
]

/** Footer columns. Every entry points somewhere real — no placeholder links. */
export const footerSections = [
  {
    title: 'El local',
    links: [
      { label: 'Carta', href: '#drinks' },
      { label: 'Reservar mesa', href: '#reservation' },
      { label: 'Tienda', href: '#merch' },
      { label: 'Delivery', href: '#services' },
    ],
  },
  {
    title: 'Información',
    links: [
      { label: 'Cómo llegar', href: '#contact' },
      { label: 'Reseñas', href: '#testimonials' },
      { label: 'Horarios', href: '#contact' },
    ],
  },
]
