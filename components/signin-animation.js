"use client"
import React from 'react'
import "@/components/stylings/general.css"
import "@/components/stylings/conversation.css"

export default function SigninAnimation() {
  return (
    <div className='signin-ball-wrapper'>
        <div className='signin-ball bg-primary signin-leftball'></div>
        <div className='signin-ball bg-primary signin-rightball'></div>
        <div className='signin-ball signin-intersection-wrapper'>
            <div className='signin-ball signin-intersection bg-background'></div>
        </div>
        <div className='eyes eye-left bg-background'></div>
        <div className='eyes eye-right bg-background'></div>
    </div>
  )
}

// bg-primary text-primary-foreground