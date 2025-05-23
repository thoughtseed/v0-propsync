import { seedDatabase } from "@/app/actions/seed-database"

/**
 * This script seeds the database with sample data
 * Run it with: npx tsx scripts/seed-db.ts
 */
async function main() {
  console.log("Seeding database...")

  try {
    const result = await seedDatabase()

    if (result.success) {
      console.log("✅ Database seeded successfully!")
      console.log(`Property ID: ${result.propertyId}`)
    } else {
      console.error("❌ Failed to seed database:", result.error)
      process.exit(1)
    }
  } catch (error) {
    console.error("❌ Unexpected error:", error)
    process.exit(1)
  }

  process.exit(0)
}

main()
