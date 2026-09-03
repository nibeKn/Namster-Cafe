/** Menu items. `tags` carries the dietary information customers look for. */

import { drinkPhotos } from './media.js'

export const drinks = [
  {
    id: 'nube',
    title: 'Nube de Madriguera',
    category: 'Latte',
    description: 'Latte de vainilla o fresa sobre leche texturizada, con algodón de azúcar encima.',
    price: '$5.500',
    image: drinkPhotos.nube,
    tags: ['Sin lactosa a pedido'],
  },
  {
    id: 'rueda',
    title: 'Rueda Giratoria',
    category: 'Frappé',
    description: 'Batido helado con veteado de galleta o matcha y crema montada al momento.',
    price: '$6.000',
    image: drinkPhotos.rueda,
    tags: ['Vegetariano'],
  },
  {
    id: 'submarino',
    title: 'Submarino Rosa',
    category: 'Chocolate caliente',
    description:
      'Chocolate blanco teñido con remolacha y un malvavisco artesanal con forma de hámster.',
    price: '$5.990',
    image: drinkPhotos.submarino,
    tags: ['Sin gluten'],
  },
  {
    id: 'tronco',
    title: 'Tronco de Manjar',
    category: 'Brazo de reina',
    description: 'Bizcocho enrollado con manjar casero, crema pastelera y fruta de temporada.',
    price: '$4.900',
    image: drinkPhotos.tronco,
    tags: ['Vegetariano'],
  },
  {
    id: 'torre',
    title: 'Torre de Hámster',
    category: 'Panqueques',
    description: 'Cuatro panqueques con crema, fruta fresca y salsa de chocolate tibia aparte.',
    price: '$5.200',
    image: drinkPhotos.torre,
    tags: ['Para compartir'],
  },
  {
    id: 'galleta',
    title: 'Tesoro Escondido',
    category: 'Galletón',
    description: 'Galleta rellena tipo sándwich con nueces y avellanas, servida tibia.',
    price: '$4.600',
    image: drinkPhotos.galleta,
    tags: ['Contiene frutos secos'],
  },
]
