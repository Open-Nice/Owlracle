'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import * as Dialog from '@radix-ui/react-dialog';
import { IconClose } from '@/components/ui/icons'
import ClassCardInfo from './classcard-info'
import ClassCardTrigger from './classcard-trigger'
import "@/components/stylings/general.css"
import "@/components/stylings/upload.css"
import '@/components/stylings/classCard.css'
import { coursesOpen } from '@/lib/courseopen'

export default function ClassCard( {catalog} ) {
  const [open, setOpen] = React.useState(false)

  const courseOpening = React.useMemo(()=>
    coursesOpen.hasOwnProperty(catalog.cField) &&
      coursesOpen[catalog.cField].includes(parseInt(catalog.cNum))
  , [])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <ClassCardTrigger catalog={catalog} setOpen={setOpen} courseOpening = {courseOpening}/>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay">
          <Dialog.Content className="DialogContent">
              <div className='DialogScrollWrapper'>
                <Dialog.Title className="DialogTitle"> 
                  <div className='flex items-center'>
                    <div className='text-2xl'>
                      {`${catalog.cField} ${catalog.cNum}`}
                    </div>
                    {
                      courseOpening?
                      <div className='flex items-center color-blue' style={{marginLeft: "5px"}}>
                        <CheckCircleOutlineRoundedIcon color='inherit'/>
                        <div> Open this semester </div>
                      </div>
                      :
                      <></>
                    }
                  </div>
                </Dialog.Title>
                <Dialog.Description className="DialogDescription">
                  {`${catalog.course_name}`}
                </Dialog.Description>
                <ClassCardInfo catalog={catalog}/>
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