'use client'

import React, { useEffect, useState } from 'react'
import { UseChatHelpers } from 'ai/react'
import { Button } from '@/components/ui/button'
import { IconArrowRight } from '@/components/ui/icons'
import "@/components/stylings/general.css"
import "@/components/stylings/conversation.css"

interface RelatedQuestionAreaProps {
    setInput: ((input: string) => void ) | null
}

type Question = {
    heading : string,
    message : string
}

export default function RelatedQuestionArea({ setInput } : RelatedQuestionAreaProps) {
  const [questions, setQ] = useState<Question[]>([]);
    
    useEffect(() => {
        fetch('/api/recommend', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },      
          })        
          .then((response) => response.json())
          .then((data) => {
            console.log('data', data)

            const { questions } = data
            let q : Question[] = []

            for(let question of questions) {
                question = question.substring('question: '.length, question.indexOf('answer:')).trim()

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
                                    <IconArrowRight className="mr-2 text-muted-foreground w-5 mt-1" />
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
