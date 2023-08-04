import { auth } from '@/auth'
import { LoginButton } from '@/components/login-button'
import { redirect } from 'next/navigation'
import LoginImage from '@/components/loginImage'

export default async function SignInPage() {
  const session = await auth()
  // redirect to home if user is already logged in
  if (session?.user) {
    redirect('/')
  }
  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))] items-center justify-center py-10">
      <div className='text-3xl pb-3'>Welcome to Owlracle.</div>
      <div className='pb-7'>
        <LoginImage/>
      </div>
      <LoginButton />
    </div>
  )
}
