'use client'

import React, { useEffect, useState } from 'react'
import { type Message } from 'ai'
import { IconArrowRight } from '@/components/ui/icons'
import MiniCard from "@/components/card-mini"
import "@/components/stylings/general.css"
import "@/components/stylings/conversation.css"

interface RelatedQuestionAreaProps {
    setInput: ((input: string) => void ) | null,
    messages: Message[]
}

// type Question = {
//     heading : string,
//     message : string
// }

const exampleMessages = [
    {
      heading: "Mon",
      message: `events on Monday`
    },
    {
      heading: "Tue",
      message: `events on Tuesday`
    },
    {
      heading: "Wed",
      message: `events on Wednesday`
    },
    {
      heading: "Thu",
      message: `events on Thursday`
    },
    {
      heading: "Fri",
      message: `events on Friday`
    },
    {
      heading: "Sat",
      message: `events on Saturday`
    },
    {
      heading: "Sun",
      message: `events on Sunday`
    },
  ]

export default function RelatedQuestionArea({ setInput, messages } : RelatedQuestionAreaProps) {
    //   const [questions, setQ] = useState<Question[]>([]);
    
    // useEffect(() => {
        
    //     // console.log(messages)

    //     let userChatIdx = []
    //     let contextList = []
    //     let chatHistory = ''

    //     for (let i = 0; i < messages.length - 1; i++)
    //         if (messages[i].role === 'user' && messages[i + 1].role === 'assistant')
    //             userChatIdx.push(i)

    //     if (userChatIdx.length == 0)
    //         return
    //     else if (userChatIdx.length == 1)
    //         contextList = userChatIdx
    //     else
    //         // Random select 2 dialogues from userChatIdx
    //         contextList = userChatIdx.sort(() => Math.random() - 0.5).slice(0, 2)

    //     for (let idx of contextList)
    //         chatHistory += `${messages[idx].role}: ${messages[idx].content}; ${messages[idx+1].role}: ${messages[idx+1].content}\n`
        
    //     // console.log(contextList)
    //     // console.log(chatHistory)

    //     fetch('/api/recommend', {
    //         method: 'POST',
    //         headers: {
    //           'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({ chatHistory: chatHistory })
    //       })
    //       .then((response) => response.json())
    //       .then((data) => {
    //         // console.log('data', data)

    //         const { questionList } = data
    //         let q : Question[] = []

    //         for(let question of questionList) {
    //             question = question.trim()

    //             q.push({
    //                 heading: question,
    //                 message: question,
    //             })
    //         }

    //         setQ(q)
    //       })
    //       .catch((error) => console.error('Error fetching data:', error))
    // }, [])

    return (
        <div className='related-question-area'>
            <b>Check out upcoming Events on:</b>
            {/* {
                questions.map((question, idx)=>{
                    return(
                        <div className='related-question-item' key={idx}>
                            <Button
                                variant="link"
                                className="h-auto p-0 text-base cursor-pt"
                                onClick={() => {setInput ? setInput(question.message) : ()=>{}} }
                            >
                                <div className='flex items-start justify-start'>
                                    <div style={{width: "10px", marginTop: "4px", marginRight: "10px"}}>
                                        <IconArrowRight className="text-muted-foreground" />
                                    </div>
                                    
                                    {question.heading}
                                </div>
                            </Button>
                        </div>
                        
                    )
                    
                })
            } */}

            <div className='calendar-wrapper'>
            {
                exampleMessages.map((message, index) => (
                    <div className='mini-card-wrapper' key={index}>
                        <MiniCard content = {message.heading} handleClick = {() => {setInput ? setInput(message.message) : ()=>{}} }/>
                    </div>
                ))
            }
            </div>
            
            
            
        </div>
    )
}
