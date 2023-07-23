import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'

import {connectDB} from './db/db'

// export const runtime = 'edge'

export default function IndexPage() {
  const id = nanoid()
  const db = connectDB()

  return <Chat id={id} />
}
