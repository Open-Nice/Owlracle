'use client'

import * as React from 'react'
import * as Dialog from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { IconPlus, IconClose } from '@/components/ui/icons'
import DropZoneAreaBtn from './upload-droparea';
import "@/components/stylings/upload.css"
import "@/components/stylings/general.css"


export default function UploadFile() {
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <div className="tooltip">
            <a onClick={(e)=>{e.preventDefault(); setOpen(true)}}
                style={{cursor: "pointer"}}
                className={cn(
                  buttonVariants({ size: 'sm', variant: 'outline' }),
                  'absolute left-0 top-4 h-8 w-8 rounded-full bg-background p-0 sm:left-4'
                )}
            >
              <IconPlus />
            </a>
          <span className="tooltiptext shadow"><div>Teach Athena! <span style={{ fontSize: '25px' }}>😍</span></div></span>
        </div> 
        
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay">
          <Dialog.Content className="DialogContent">
            <div className='DialogScrollWrapper'>
                <Dialog.Title className="DialogTitle">Teach me something I don&rsquo;'&rsquo;t know <span style={{ fontSize: '25px' }}>🤓</span> </Dialog.Title>
                <Dialog.Description className="DialogDescription">
                  Upload info /
                  knowledge /
                  resources
                  and I will learn them to share with other Rice <span style={{ fontSize: '25px' }}>🦉</span>s!
                </Dialog.Description>
                <DropZoneAreaBtn/>
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