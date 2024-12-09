import { dbConnect } from '../lib/db'
import { Business } from '../lib/db/models'

async function checkBusinesses() {
  try {
    await dbConnect()
    const businesses = await Business.find({})
    console.log('Found businesses:', businesses.length)
    businesses.forEach(business => {
      console.log({
        id: business._id.toString(),
        name: business.name,
        email: business.email,
        createdAt: business.createdAt
      })
    })
  } catch (error) {
    console.error('Error checking businesses:', error)
  } finally {
    process.exit(0)
  }
}

checkBusinesses() 