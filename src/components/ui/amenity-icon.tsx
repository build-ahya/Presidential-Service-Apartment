import {
  Bath, BedDouble, Car, Check, Clock, Coffee, ConciergeBell, CookingPot, Dumbbell, Flame,
  KeyRound, MapPin, Plane, Refrigerator, ShieldCheck, Shirt, Snowflake, Sparkles, Tv, Utensils,
  WashingMachine, Wifi, Wind, Zap, type LucideIcon,
} from 'lucide-react';

const AMENITY_MATCHERS: [RegExp, LucideIcon][] = [
  [/wi-?fi|internet|fib(er|re)/i, Wifi],
  [/power|electric|generator|inverter/i, Zap],
  [/air ?con|\bac\b|cooling/i, Snowflake],
  [/tv|television|netflix/i, Tv],
  [/kitchen|cook/i, CookingPot],
  [/fridge|refrigerator/i, Refrigerator],
  [/laundry|washer|washing/i, WashingMachine],
  [/iron|wardrobe/i, Shirt],
  [/park|garage/i, Car],
  [/secur|cctv|guard|gated/i, ShieldCheck],
  [/clean|housekeep/i, Sparkles],
  [/concierge|reception|front desk/i, ConciergeBell],
  [/gym|fitness/i, Dumbbell],
  [/hot water|heater|shower|bath/i, Bath],
  [/bed|linen|sleep/i, BedDouble],
  [/coffee|tea|breakfast/i, Coffee],
  [/dining|restaurant|food/i, Utensils],
  [/fan|ventilat/i, Wind],
  [/balcony|view|garden/i, Flame],
];

/** Picks an icon for a free-text amenity ("High-speed Wi-Fi" → Wifi). */
export function AmenityIcon({ label, className }: { label: string; className?: string }) {
  const Icon = AMENITY_MATCHERS.find(([re]) => re.test(label))?.[1] ?? Check;
  return <Icon className={className} aria-hidden='true' />;
}

const CMS_ICONS: Record<string, LucideIcon> = {
  zap: Zap,
  shield: ShieldCheck,
  wifi: Wifi,
  plane: Plane,
  sparkles: Sparkles,
  utensils: Utensils,
  car: Car,
  shirt: Shirt,
  bed: BedDouble,
  tv: Tv,
  snowflake: Snowflake,
  concierge: ConciergeBell,
  key: KeyRound,
  map: MapPin,
  clock: Clock,
};

/** Icons an admin can pick for a CMS item by name. */
export function CmsIcon({ name, className }: { name?: string; className?: string }) {
  const Icon = (name && CMS_ICONS[name]) || Sparkles;
  return <Icon className={className} aria-hidden='true' />;
}
