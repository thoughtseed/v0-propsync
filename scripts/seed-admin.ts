import { config } from 'dotenv'
import { seedAdminUser } from "../lib/seed-data/seed-admin"

// Load environment variables from .env.local
config({ path: '.env.local' })

async function main() {
  console.log("Seeding admin user...")
  const result = await seedAdminUser()

  if (result.success) {
    console.log("✅ Success:", result.message)
    if (result.credentials) {
      console.log("Admin credentials:")
      console.log(`Email: ${result.credentials.email}`)
      console.log(`Password: ${result.credentials.password}`)
      console.log("\nIMPORTANT: Change this password after first login!")
    }
  } else {
    console.error("❌ Error:", result.error)
    process.exit(1)
  }
}

main()
