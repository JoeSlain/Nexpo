'use client'
import { Text, View } from 'react-native'
import { useParams, useRouter } from 'solito/navigation'

const useUserParams = useParams<{ userId: string; lang: string }>

export default function UserPage() {
  const { userId, lang } = useUserParams()
  const router = useRouter()

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text onPress={() => router.back()}>
        Hi {userId}, click me to go back
      </Text>
    </View>
  )
}

