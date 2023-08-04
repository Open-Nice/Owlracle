import React from 'react'
import { UseChatHelpers } from 'ai/react'
import { Button } from '@/components/ui/button'
import { IconArrowRight } from '@/components/ui/icons'
import "@/components/stylings/general.css"
import "@/components/stylings/conversation.css"

export default function RelatedQuestionArea() {
    const questions = ["Recommend me a cs course related to machine learning or AI for this fall", "Recommend me a cs course related to machine learning or AI for this fall", "Recommend me a cs course related to machine learning or AI for this fall"]
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
                            // onClick={() => setInput(question)}
                        >
                            <IconArrowRight className="mr-2 text-muted-foreground" />
                            {question}
                        </Button>
                    </div>
                    
                )
                
            })
        }
        
    </div>
  )
}
