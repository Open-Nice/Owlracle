'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import * as Dialog from '@radix-ui/react-dialog';
import { IconClose } from '@/components/ui/icons'
import ClassCardInfo from './classcard-info'
import ClassCardTrigger from './classcard-trigger'
import "@/components/stylings/general.css"
import "@/components/stylings/upload.css"
import '@/components/stylings/classCard.css'


export default function ClassCard() {
  const [open, setOpen] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <ClassCardTrigger setOpen={setOpen}/>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay">
          <Dialog.Content className="DialogContent">
              <div style={{padding: "25px", paddingBottom: "0px"}}>
                <Dialog.Title className="DialogTitle">COMP 140 </Dialog.Title>
                <Dialog.Description className="DialogDescription">
                  Basic computer programming
                </Dialog.Description>
                <ClassCardInfo/>
                <Dialog.Close>
                  <a className="IconButton" aria-label="Close">
                    <IconClose />
                  </a>
                </Dialog.Close>
              </div>           
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
      
    </Dialog.Root>
  )
}