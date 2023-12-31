'use client'

import * as React from 'react'
import { signIn } from 'next-auth/react'

import { cn } from '@/lib/utils'
import { Button, type ButtonProps } from '@/components/ui/button'
import { IconGitHub, IconSpinner } from '@/components/ui/icons'
import GoogleIcon from '@mui/icons-material/Google';

interface LoginButtonProps extends ButtonProps {
  showGithubIcon?: boolean
  text?: string
}

export function LoginButton({
  text = 'Login with @rice.edu',
  showGithubIcon = true,
  className,
  ...props
}: LoginButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  return (
    <Button
      variant="outline"
      onClick={() => {
        setIsLoading(true)
        // next-auth signIn() function doesn't work yet at Edge Runtime due to usage of BroadcastChannel
        signIn('google', { callbackUrl: `/` })
      }}
      disabled={isLoading}
      className={cn(className)}
      {...props}
    >
      <div className='loginBtn-pure-bg'></div>
      <div className='loginBtn-text flex items-center justify-center'>
        {isLoading ? (
          <IconSpinner className="mr-2 animate-spin" />
        ) : showGithubIcon ? (
          <div className="mr-2">
            <GoogleIcon fontSize='inherit' color='inherit'/>
          </div>
          
        ) : null}
        {text}
      </div>
      
    </Button>
  )
}
