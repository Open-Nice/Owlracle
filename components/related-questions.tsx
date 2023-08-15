'use client'

import React, { useEffect, useState } from 'react'
import { UseChatHelpers } from 'ai/react'
import { type Message } from 'ai'
import { Button } from '@/components/ui/button'
import { IconArrowRight } from '@/components/ui/icons'
import "@/components/stylings/general.css"
import "@/components/stylings/conversation.css"

interface RelatedQuestionAreaProps {
    setInput: ((input: string) => void ) | null,
    messages: Message[]
}

type Question = {
    heading : string,
    message : string
}

export default function RelatedQuestionArea({ setInput, messages } : RelatedQuestionAreaProps) {
  const [questions, setQ] = useState<Question[]>([]);
    
    useEffect(() => {
        fetch('/api/recommend', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messages: messages })
          })
          .then((response) => response.json())
          .then((data) => {
            // console.log('data', data)

            const { questionList } = data
            let q : Question[] = []

            for(let question of questionList) {
                question = question.trim()

                q.push({
                    heading: question,
                    message: question,
                })
            }

            setQ(q)
          })
          .catch((error) => console.error('Error fetching data:', error))
    }, [])

    return (
        <div className='related-question-area'>
            <b>Recommended questions:</b>
            {
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
            }
            
        </div>
    )
}
