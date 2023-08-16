import * as React from 'react'
import Link from 'next/link'
import CardGiftcardRoundedIcon from '@mui/icons-material/CardGiftcardRounded';
import { cn } from '@/lib/utils'
import { auth } from '@/auth'
import { clearChats } from '@/app/actions'
import { Button, buttonVariants } from '@/components/ui/button'
import { Sidebar } from '@/components/sidebar'
import { SidebarList } from '@/components/sidebar-list'
import {
  IconGitHub,
  IconNextChat,
  IconNiceWithText,
  IconSeparator,
  IconGift,
  IconVercel
} from '@/components/ui/icons'
import { SidebarFooter } from '@/components/sidebar-footer'
import { ThemeToggle } from '@/components/theme-toggle'
import { ClearHistory } from '@/components/clear-history'
import { UserMenu } from '@/components/user-menu'
import { LoginButton } from '@/components/login-button'
import "@/components/stylings/general.css"

export async function Header() {
  const session = await auth()
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
      <div className="flex items-center">
        {session?.user ? (
          <Sidebar>
            <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
              {/* @ts-ignore */}
              <SidebarList userId={session?.user?.id} />
            </React.Suspense>
            <SidebarFooter>
              <ThemeToggle />
              <ClearHistory clearChats={clearChats} />
            </SidebarFooter>
          </Sidebar>
        ) : (
          <IconNiceWithText className='h-7'/>
        )}
        <div className="flex items-center">
          {session?.user ? (
            <>
              <IconSeparator className="w-6 h-6 text-muted-foreground/50" />
              <UserMenu user={session.user} />
            </>
            
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <div className='tooltip'>
          <a
            target="_blank"
            href="https://buy.stripe.com/9AQ2areKfgPl3sI000"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: 'outline' }))}
          >
              <IconGift className='h-5'/>
              <div className='tooltiptext tooltip-header shadow border bg-popover text-popover-foreground'>
                Your support will directly fund the cost of running this platform.
              </div>
            
          </a>
        </div>
        <div className='tooltip'>
          <a
            target="_blank"
            href="https://github.com/Open-Nice"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: 'outline' }))}
          >
            <IconGitHub />
            <span className="hidden ml-2 md:flex">Contribute</span>
            <div className='tooltiptext tooltip-header shadow border bg-popover text-popover-foreground'>
              Join our open-source community to redefine the future of Owls
            </div>
          </a>
        </div>
      </div>
    </header>
  )
}
