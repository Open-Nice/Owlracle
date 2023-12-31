'use client'

import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast'
import { Message } from 'ai'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import type { CourseCatalog } from '@prisma/client'
import { CodeBlock } from '@/components/ui/codeblock'
import { MemoizedReactMarkdown } from '@/components/markdown'
import { IconUser, IconNice, IconNiceColor } from '@/components/ui/icons'
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import { ChatMessageActions } from '@/components/chat-message-actions'
import ClassCard from "@/components/classcard"
import '@/components/stylings/general.css'
import '@/components/stylings/classCard.css'
import useHasMounted from "@/components/useHasMounted"
import {getUser, updateReport} from "@/app/upload"
import UploadFile from './upload';


export interface ChatMessageProps {
  isComplete: Boolean
  message: Message,
  messages: Message[],
  num: number
}

export function ChatMessage({ isComplete, message, messages, num, ...props}: ChatMessageProps) {
  const { setTheme, theme } = useTheme()
  const [userId, setUserId] = useState("");
  const hasMounted = useHasMounted()
  const [openModal, setOpenModal] = useState(false)
  const [question, setQuestion] = useState("")
  const [courseCatalogs, setCCL] = useState<CourseCatalog[] | null>(null);

  async function setId(){
    await getUser().then(
      (result) =>{
        setUserId(result);
      }
    );
    
  }

  async function handleLike(){
    await updateReport(userId, messages[num - 1].content, message.content, true).then(
      (result) =>{
        if (result !== 0) {
          toast.error(result);
        } else {
          toast.success("Thanks! Your encouraging words mean a lot to me.")
        }
      }
    )
  }

  async function handleDislike(){ 
    setOpenModal(true)
    setQuestion(messages[num - 1].content)
    setTimeout(()=>{setOpenModal(false)}, 10)
    await updateReport(userId, messages[num - 1].content, message.content, false).then(
      (result) =>{
        if (result !== 0) {
          toast.error(result);
        } else {
          toast.success("Thanks for the feedback, I will continue to self-learn to give a more satifatory answer.")
        }
      }
    )
  }

  useEffect(()=>{
    setId();
  }, [])

  useEffect(() => {
    if (! isComplete){
      return;
    }
    
    // console.log('newest message has completed loading: ',message)
    
    if (message.role !== 'assistant')
      return
    
    const regexPattern = /\b[A-Z]{4} \d{3}\b/gi
    const content = message.content
    const coursesNames = content.match(regexPattern)

    if (! coursesNames)
      return

    const courses = coursesNames.map(course => ({ 'cField': course.split(' ')[0].toUpperCase(), 'cNum': course.split(' ')[1] }))

    // console.log('courses', courses)

    fetch('/api/course', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify( {'courses' : courses } )

    })        
    .then((response) => response.json())
    .then((data) => setCCL(data))
    .catch((error) => console.error('Error fetching data:', error))

  }, [isComplete]);

  return (
    <div>
      <div
      className={cn('group relative mb-4 flex items-start md:-ml-12')}
      {...props}
      >
        <div
          className={cn(
            'flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow',
            message.role === 'user'
              ? 'bg-background'
              : `${hasMounted && theme === "light" ? "bg-primary text-primary-foreground" : "nice-icon-bg-dark text-primary-foreground"}`
          )}
        >
          {message.role === 'user' ? <IconUser /> : 
            <>
            {hasMounted && theme === "dark" ? <IconNice className='h-4/6'/>:<IconNiceColor className='h-4/6'/>}
            </>
          }
        </div>
        <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
          <MemoizedReactMarkdown
            className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
            remarkPlugins={[remarkGfm, remarkMath]}
            linkTarget="_blank"
            components={{
              p({ children }) {
                return <p className="mb-2 last:mb-0">{children}</p>
              },
              code({ node, inline, className, children, ...props }) {
                if (children.length) {
                  if (children[0] == '▍') {
                    return (
                      <span className="mt-1 animate-pulse cursor-default">▍</span>
                    )
                  }

                  children[0] = (children[0] as string).replace('`▍`', '▍')
                }

                const match = /language-(\w+)/.exec(className || '')

                if (inline) {
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                }

                return (
                  <CodeBlock
                    key={Math.random()}
                    language={(match && match[1]) || ''}
                    value={String(children).replace(/\n$/, '')}
                    {...props}
                  />
                )
              }
            }}
          >
            {message.content}
          </MemoizedReactMarkdown>
          <ChatMessageActions message={message} />
        </div>
      </div>
      {
          isComplete && courseCatalogs ? 
          <div className='classCardWrapper'>
            {courseCatalogs?.map( (courseCatalog, index) => <ClassCard catalog = {courseCatalog} key = {index} />)}
          </div>
          :
          <></>
        }
      {
        hasMounted && isComplete && message.role === 'assistant' ?
        <div>
          <div className='flex justify-end my-3'>
            <div className='thumb-icon tooltip' onClick={handleLike}>
              <ThumbUpOffAltIcon color='inherit'/>
              <span className='tooltiptext tooltip-top tooltip-thumb shadow border bg-popover text-popover-foreground'>Like the answer</span>
            </div>
            <div className='thumb-icon tooltip' onClick={handleDislike}>
              <ThumbDownOffAltIcon color='inherit'/>
              <span className='tooltiptext tooltip-top tooltip-thumb shadow border bg-popover text-popover-foreground'>Dislike the answer</span>
            </div>
            <UploadFile propOpen={openModal} question = {question} triggerHidden = {true}/>
          </div>
        </div>
        :
        <></>
      }
    </div>
    
  )
}