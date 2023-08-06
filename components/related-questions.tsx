import React from 'react'
import { UseChatHelpers } from 'ai/react'
import { Button } from '@/components/ui/button'
import { IconArrowRight } from '@/components/ui/icons'
import "@/components/stylings/general.css"
import "@/components/stylings/conversation.css"

interface RelatedQuestionAreaProps {
    setInput: (input: string) => void
}

export default function RelatedQuestionArea({ setInput } : RelatedQuestionAreaProps) {
    const questions = [
        {
            heading: 'Looking for classes? 📚',
            message: `Give me some philosophy of mind class?`
        },
        {
            heading: 'Want to connect with faculties? 🤠',
            message: `Find me some professors in machine leanring?`
        },
        {
            heading: "Find interesting stuff to do 🎮",
            message: `What are some interesting activities recently?`
        },
    ]

    return (
        <div className='related-question-area'>
            <b>Related questions:</b>
            {
                questions.map((question, idx)=>{
                    return(
                        <div className='related-question-item' key={idx}>
                            <Button
                                variant="link"
                                className="h-auto p-0 text-base cursor-pt"
                                onClick={() => setInput(question.message)}
                            >
                                <IconArrowRight className="mr-2 text-muted-foreground" />
                                {question.heading}
                            </Button>
                        </div>
                        
                    )
                    
                })
            }
            
        </div>
    )
}
