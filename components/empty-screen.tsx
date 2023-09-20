import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'
import "@/components/stylings/general.css"

const exampleMessages = [
  {
    heading: "today",
    message: `events today`
  },
  {
    heading: "tomorrow",
    message: `events tomorrow`
  },
  {
    heading: "About computer science",
    message: `Recommend me events about computer science.`
  },
  {
    heading: "Surprise 🤯",
    message: `Suggest some fun and chill events.`
  }
]

export interface EmptyPanelProps
  extends Pick<
    UseChatHelpers,
    | 'append'
  > {
  id?: string
}

export function EmptyScreen({ id, append }: EmptyPanelProps) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">
          Meet Owlracle
        </h1>
        <p className="mb-5 leading-normal text-muted-foreground">
          Hi! I am Owlracle, your assistant for your life and study at Rice.
          {/* an open-source language model constructed by{' '}
          <ExternalLink href="https://github.com/Open-Nice">
           Nice
          </ExternalLink>
          {' '} and empowered by Rice<span style={{ fontSize: '25px' }} placeholder='Owl'>🦉</span>s. */}
        </p>
        <div className='intro'>
          <button onClick={async () => await append({ id, content: 'What can you do?', role: 'user'})} 
          className='intro-btn shadow'>
              <span>👉</span> See what I can do
          </button>
        </div>
        <p className="mb-2 leading-normal color-mid-purple">
          Checkout upcoming events:
        </p>
        <div className="mt-4 flex flex-col items-start space-y-2">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              onClick={async () => await append(
                {
                  id,
                  content: message.message,
                  role: 'user'
                })}
            >
              <IconArrowRight className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
