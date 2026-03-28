export type LocationFeature =
  | "Indoor"
  | "Outdoor"
  | "Catering included"
  | "Dance floor"
  | "Stage / DJ equipment"
  | "Waterfront"
  | "Late-night license"
  | "Parking"
  | "Breakout rooms";

export type LocationStyle = "Modern" | "Industrial" | "Luxury";

export type Location = {
  id: string;
  name: string;
  city: string;
  district: string;
  featured: boolean;
  placementLabel: string;
  urgencyLabel: string;
  venueType: string;
  featuredBadge: string;
  address: string;
  capacity: number;
  minimumGuests: number;
  pricePerPerson: number;
  totalPrice?: number;
  description: string;
  images: string[];
  features: LocationFeature[];
  idealFor: string;
  website: string;
  bookingLink: string;
  contactEmail: string;
  contactPhone: string;
  includedServices: string[];
  styleTags: LocationStyle[];
  // Social proof metrics (managed via admin dashboard)
  schoolsBooked?: number;
  isPopularWithSchools?: boolean;
  isQuicklyBooked?: boolean;
};
