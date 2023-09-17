import { auth } from '@/auth'
import { LoginButton } from '@/components/login-button'
import { ExternalLink } from '@/components/external-link'
import { redirect } from 'next/navigation'
import SigninAnimation from "@/components/signin-animation"
import "@/components/stylings/general.css"

export default async function SignInPage() {
  const session = await auth()
  // redirect to home if user is already logged in
  if (session?.user) {
    redirect('/')
  }
  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))] items-center justify-center py-10">
      <SigninAnimation/>
      <div className='text-4xl pt-3 pb-2'>Welcome to Owlracle.</div>
      <div className='pb-4' style={{opacity: 0.5}}>Open Source LLM developed by Nice</div>
      <div className='text-xl text-center pb-4' style={{opacity: 0.8}}>
        Unlock the full potential of your Rice experience.
      </div>
      <LoginButton className='coloredBtn'/>
    </div>
  )
}
