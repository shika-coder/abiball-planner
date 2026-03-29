import { PrismaClient } from "@prisma/client";
import { locations } from "../src/data/locations";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with locations...");

  // Clear existing locations
  await prisma.location.deleteMany({});

  // Insert all locations from locations.ts
  for (const location of locations) {
    await prisma.location.create({
      data: {
        id: location.id,
        name: location.name,
        city: location.city,
        district: location.district,
        featured: location.featured,
        placementLabel: location.placementLabel,
        urgencyLabel: location.urgencyLabel,
        venueType: location.venueType,
        featuredBadge: location.featuredBadge,
        address: location.address,
        capacity: location.capacity,
        minimumGuests: location.minimumGuests,
        pricePerPerson: location.pricePerPerson,
        description: location.description,
        idealFor: location.idealFor,
        website: location.website,
        bookingLink: location.bookingLink,
        contactEmail: location.contactEmail || "",
        contactPhone: location.contactPhone || "",
        features: JSON.stringify(location.features),
        includedServices: JSON.stringify(location.includedServices),
        styleTags: JSON.stringify(location.styleTags),
        images: JSON.stringify(location.images),
        schoolsBooked: location.schoolsBooked || 0,
        isPopularWithSchools: location.isPopularWithSchools || false,
        isQuicklyBooked: location.isQuicklyBooked || false,
      },
    });
  }

  console.log(`✓ Seeded ${locations.length} locations`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("✓ Done!");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
