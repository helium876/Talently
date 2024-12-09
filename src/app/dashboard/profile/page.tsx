import { requireAuth } from '@/lib/session'
import { ProfileContent } from './profile-content'
import { SerializedBusiness } from '@/lib/types/data'
import { PageContainer } from '@/components/ui/page-container'

export default async function ProfilePage() {
  const session = await requireAuth()

  // Extend the SerializedBusiness type with additional profile fields
  interface ExtendedBusinessProfile extends SerializedBusiness {
    logoPath: string | null
    emailPreferences: {
      marketingEmails: boolean
      bookingNotifications: boolean
      weeklyDigest: boolean
    }
  }

  // Create the extended profile data
  const profileData: ExtendedBusinessProfile = {
    ...session,
    logoPath: null, // Add proper logo handling if needed
    emailPreferences: {
      marketingEmails: true,
      bookingNotifications: true,
      weeklyDigest: true
    }
  }

  return (
    <PageContainer
      title="Business Profile"
      description="Manage your business information and preferences"
    >
      <ProfileContent profile={profileData} />
    </PageContainer>
  )
} 