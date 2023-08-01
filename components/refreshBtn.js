"use client"
import React from 'react'
import { usePathname } from 'next/navigation'
import CachedRoundedIcon from '@mui/icons-material/CachedRounded';
import "@/components/stylings/general.css"

export default function RefreshBtn() {
    const pathname = usePathname();
  return (
    <div className='relative'>
      <div className='tooltip'>
        <a href={pathname} className="refresh-icon">
          <CachedRoundedIcon color='inherit'/>
        </a>
        <span className='tooltiptext shadow border tooltip-right tooltip-refresh bg-popover text-popover-foreground'>
          <div>Refresh to update chat history</div>
        </span>
      </div>
    </div>
    
    
  )
}
