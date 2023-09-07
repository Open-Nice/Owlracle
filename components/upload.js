'use client'

import * as React from 'react'
import * as Dialog from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import {IconClose } from '@/components/ui/icons'
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';
import SuggestionArea from "./upload-suggestion"
import useHasMounted from "@/components/useHasMounted"
import "@/components/stylings/upload.css"
import "@/components/stylings/general.css"


export default function UploadFile({propOpen = false, question = "", triggerHidden = false}) {
  const [open, setOpen] = React.useState(false)
  const hasMounted = useHasMounted()

  React.useEffect(()=>{
    if (propOpen) {
      setOpen(true)
    }
  }, [propOpen])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <div className="tooltip" 
            style={{display: `${triggerHidden? "none" : ""}`}} 
            >
            <a onClick={(e)=>{e.preventDefault(); setOpen(true)}}
                style={{cursor: "pointer"}}
                className={cn(
                  buttonVariants({ size: 'sm', variant: 'outline' }),
                  'absolute left-0 top-4 h-8 w-8 rounded-full bg-background p-0 sm:left-4'
                )}
            >
              <div style={{opacity: "0.8"}}>
                {
                  hasMounted ? <CampaignRoundedIcon color='inherit'/> : <></>
                }

              </div>
            </a>
          <span className="tooltiptext tooltip-top tooltip-upload shadow border bg-popover text-popover-foreground"><div>Give me feedback! <span style={{ fontSize: '25px' }}>😍</span></div></span>
        </div> 
        
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay">
          <Dialog.Content className="DialogContent">
            <div className='DialogScrollWrapper'>
                <Dialog.Title className="DialogTitle">Tell me where I should improve. I am constantly learning! <span style={{ fontSize: '25px' }}>🤓</span> </Dialog.Title>
                <Dialog.Description className="DialogDescription">
                  I would love to hear your feedback! I will self-learn and give you more precise answers.
                </Dialog.Description>
                <SuggestionArea question = {question}/>
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