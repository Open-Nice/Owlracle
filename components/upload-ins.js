'use client'

import * as React from 'react'
import * as Dialog from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import {IconClose } from '@/components/ui/icons'
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';
import InsArea from "./upload-ins-area"
import useHasMounted from "@/components/useHasMounted"
import Popover from "@/components/upload-ins-pop"
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import "@/components/stylings/upload.css"
import "@/components/stylings/general.css"


export default function UploadIns() {
  const [open, setOpen] = React.useState(false)
  const hasMounted = useHasMounted()
  const [pop, setPop] = React.useState(false);

  function triggerPopup() {
    setPop(true); 
    setTimeout(()=>{setPop(false)}, 100);
  }

  React.useEffect(()=>{
    triggerPopup();
    setInterval(()=>{
      triggerPopup();
    }, 600000);
    
  }, [])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <>
        <div className="tooltip" >
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
            <Popover content = {<>Want to upload <b>club <InstagramIcon/> <FacebookIcon/></b>?</>} pop = {pop}/>
            <span className="tooltiptext tooltip-top tooltip-upload shadow border bg-popover text-popover-foreground cursor-pt" onClick={()=>setOpen(true)}>
              <div>I have info to share<span style={{ fontSize: '25px' }}>🤩</span></div></span>
        </div> 
        </>
        
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay">
          <Dialog.Content className="DialogContent">
            <div className='DialogScrollWrapper'>
                <Dialog.Title className="DialogTitle">Share club/event <InstagramIcon/> <FacebookIcon/>! <span style={{ fontSize: '25px' }}>🤗</span> </Dialog.Title>
                <Dialog.Description className="DialogDescription">
                  I will use the links to grab club/event info and share them with Rice 🦉s!
                </Dialog.Description>
                <InsArea/>
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