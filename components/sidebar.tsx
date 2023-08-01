'use client'

import * as React from 'react'

import { Button, buttonVariants } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { IconSidebar, IconPlus, IconNiceWithText } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import RefreshBtn from '@/components/refreshBtn'

export interface SidebarProps {
  children?: React.ReactNode
}

export function Sidebar({ children }: SidebarProps) {
  const router = useRouter();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="-ml-2 h-9 w-9 p-0">
          <IconSidebar className="h-6 w-6" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="inset-y-0 flex h-auto w-[300px] flex-col p-0">
        <SheetHeader className="p-4">
          <SheetTitle className="text-sm">
            <IconNiceWithText className='h-12 m-1 mb-3'/>
            <div className='flex justify-between items-center'> 
              <a
                  style={{cursor: "pointer"}}
                  onClick={e => {
                    e.preventDefault()
                    router.refresh()
                    router.push('/')
                  }}
                  className={cn(
                    buttonVariants({ size: 'sm', variant: 'outline' }),
                    'bg-background py-2 px-3 sm:left-4'
                  )}
                >
                  <IconPlus />
                  <div className='px-2'>New Chat</div>
              </a>
              <RefreshBtn/>
            </div>
          </SheetTitle>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  )
}
