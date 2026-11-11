import icedCoffeeImg from '../assets/images/menu-iced-coffee.jpg';
import cappuccinoImg from '../assets/images/menu-cappuccino.jpg';
import caramelLatteImg from '../assets/images/menu-caramel-latte.jpg';
import coldBrewImg from '../assets/images/menu-cold-brew.jpg';
import heroCoffeeImg from '../assets/images/hero-coffee.jpg';
import aboutBeansImg from '../assets/images/about-beans.jpg';
import cafeAmbienceImg from '../assets/images/cafe-ambience.jpg';
import avatarRahulImg from '../assets/images/avatar-rahul.jpg';

export const FEATURED_MENU_ITEMS = [
  {
    id: 'iced-coffee',
    name: 'Iced Coffee',
    price: 120,
    category: 'Cold Classics',
    description: 'Double-shot chilled espresso swirled with velvety farm milk over crystal ice.',
    image: icedCoffeeImg,
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    price: 150,
    category: 'Hot Classics',
    description: 'Rich single-origin espresso crowned with airy steamed micro-foam rosetta art.',
    image: cappuccinoImg,
  },
  {
    id: 'caramel-latte',
    name: 'Caramel Latte',
    price: 180,
    category: 'Signature Lattes',
    description: 'Layered espresso and silky milk topped with whipped cream and house caramel.',
    image: caramelLatteImg,
  },
  {
    id: 'cold-brew',
    name: 'Cold Brew',
    price: 140,
    category: 'Cold Classics',
    description: '18-hour slow-steeped dark roast delivering smooth cacao notes with zero bitterness.',
    image: coldBrewImg,
  },
];

export const FULL_MENU_ITEMS = [
  ...FEATURED_MENU_ITEMS,
  {
    id: 'velvet-espresso',
    name: 'Velvet Double Espresso',
    price: 110,
    category: 'Hot Classics',
    description: 'Bold, syrupy crema pulled from freshly ground Chikmagalur Arabica beans.',
    image: heroCoffeeImg,
  },
  {
    id: 'hazelnut-latte',
    name: 'Roasted Hazelnut Latte',
    price: 190,
    category: 'Signature Lattes',
    description: 'Toasted hazelnut praline folded into smooth double espresso and oat milk.',
    image: caramelLatteImg,
  },
  {
    id: 'nitro-tonic',
    name: 'Spiced Cold Brew Tonic',
    price: 165,
    category: 'Cold Classics',
    description: 'Crisp slow-steeped cold brew over botanical tonic with a hint of orange zest.',
    image: coldBrewImg,
  },
  {
    id: 'mocha-royale',
    name: 'Dark Chocolate Mocha',
    price: 175,
    category: 'Hot Classics',
    description: '70% single-origin dark couverture melted into fresh espresso and steamed cream.',
    image: cappuccinoImg,
  },
  {
    id: 'vanilla-cream-brew',
    name: 'Vanilla Cream Cold Brew',
    price: 160,
    category: 'Cold Classics',
    description: 'Velvety Madagascar vanilla sweet cream layered slowly over crisp cold brew.',
    image: icedCoffeeImg,
  },
  {
    id: 'classic-affogato',
    name: 'Golden Espresso Affogato',
    price: 195,
    category: 'Signature Lattes',
    description: 'Hot double ristretto poured over artisanal vanilla gelato with caramel crunch.',
    image: heroCoffeeImg,
  },
];

export const TESTIMONIALS = [
  {
    id: 'anjali',
    name: 'Anjali Menon',
    initials: 'AM',
    rating: 5,
    quote:
      'BLACK & BREW is my happy place! The coffee is amazing and the ambience is just perfect.',
  },
  {
    id: 'rahul',
    name: 'Rahul Krishnan',
    initials: 'RK',
    avatar: avatarRahulImg,
    rating: 5,
    quote: 'Best coffee in town! Highly recommended.',
  },
  {
    id: 'meera',
    name: 'Meera Nair',
    initials: 'MN',
    rating: 5,
    quote:
      'The 18-hour Cold Brew and warm golden-lit lounge make every work afternoon feel effortless.',
  },
  {
    id: 'arjun',
    name: 'Arjun Verma',
    initials: 'AV',
    rating: 5,
    quote:
      'Consistent crema, thoughtful baristas, and the Caramel Latte is unmatched anywhere in the city.',
  },
  {
    id: 'priya',
    name: 'Priya Sharma',
    initials: 'PS',
    rating: 5,
    quote:
      'From the aroma of freshly roasted beans at the door to the final sip, pure craftsmanship.',
  },
  {
    id: 'vikram',
    name: 'Vikram Patel',
    initials: 'VP',
    rating: 5,
    quote:
      'My go-to spot for weekend catchups and quiet morning pours. Worth every visit.',
  },
];

export const GALLERY_PHOTOS = [
  {
    id: 'gal-ambience',
    title: 'The Midnight Espresso Lounge',
    category: 'Coffee Shop Ambience',
    image: cafeAmbienceImg,
    span: 'tall',
  },
  {
    id: 'gal-craft',
    title: 'Signature Espresso Splash',
    category: 'Coffee Preparation',
    image: heroCoffeeImg,
    span: 'wide',
  },
  {
    id: 'gal-beans',
    title: 'Small-Batch Roasted Arabica',
    category: 'Coffee Beans',
    image: aboutBeansImg,
    span: 'normal',
  },
  {
    id: 'gal-latte-art',
    title: 'Hand-Poured Rosetta Art',
    category: 'Barista at Work',
    image: cappuccinoImg,
    span: 'normal',
  },
  {
    id: 'gal-caramel',
    title: 'Golden Caramel Drizzle',
    category: 'Close-Up Photography',
    image: caramelLatteImg,
    span: 'tall',
  },
  {
    id: 'gal-iced',
    title: 'Swirled Cold Cream Pour',
    category: 'Close-Up Photography',
    image: icedCoffeeImg,
    span: 'normal',
  },
];

export const CAFE_INFO = {
  brandName: 'BLACK & BREW',
  subtitle: 'COFFEE HOUSE',
  address: '42 Roastwood Avenue, 100 Feet Road, Indiranagar, Bengaluru 560038',
  hours: 'Mon – Sun: 7:00 AM – 11:00 PM',
  phone: '+91 80 4123 9876',
  email: 'hello@blackandbrew.in',
};

