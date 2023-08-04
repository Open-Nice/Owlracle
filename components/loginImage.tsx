"use client"
import React from 'react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import owlDark from "@/components/images/owlDark.png"
import owlLight from "@/components/images/owlLight.png"

export default function LoginImage() {
    const { setTheme, theme } = useTheme()
  return (
    <div style={{opacity: "0.9"}}>
        <Image
        src={theme === "light" ? owlDark : owlLight}
        width={350}
        height={350}
        alt="Rice Owls"
      />
    </div>
    
  )
}
