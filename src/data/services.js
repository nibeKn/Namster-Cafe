import { brand } from './media.js'

export const services = [
  {
    id: 'carta',
    title: 'Carta',
    tag: 'Todos los días, de 9:00 a 21:00',
    description:
      'Doce cafés de origen, repostería recién horneada y una carta corta que rota con la temporada.',
    icon: brand.menu,
    accent: 'rose',
    features: [
      'Café de origen tostado en Santiago',
      'Repostería del día, hecha en casa',
      'Alternativas sin lactosa y veganas',
    ],
    cta: { label: 'Ver la carta', href: '#drinks' },
  },
  {
    id: 'reserva',
    title: 'Reservas',
    tag: 'Cuatro sectores para elegir',
    description:
      'Terraza, salón, zona ventana o sala privada. Confirmamos por correo en menos de una hora.',
    icon: brand.calendar,
    accent: 'plum',
    features: [
      'Mesas de 2 a 12 personas',
      'Sala privada para celebraciones',
      'Decoración de cumpleaños a pedido',
    ],
    cta: { label: 'Reservar mesa', href: '#reservation' },
  },
  {
    id: 'delivery',
    title: 'Delivery',
    tag: 'Providencia, Ñuñoa y Las Condes',
    description:
      'Reparto propio en un radio de cinco kilómetros, con empaque térmico para que el café llegue como sale de la barra.',
    icon: brand.delivery,
    accent: 'caramel',
    features: ['Entrega en 30 a 45 minutos', 'Empaque térmico', 'Seguimiento por WhatsApp'],
    cta: { label: 'Ver zonas de reparto', href: '#contact' },
  },
]
