import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'

const exampleMessages = [
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
  {
    heading: "Join various organizations 🎨",
    message: `what design clubs are there?`
  }
]

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, 'setInput'>) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">
          Meet Owlracle
        </h1>
        <p className="mb-2 leading-normal text-muted-foreground">
          Hi! I am Owlracle, your assistant for your life and study at Rice.
          {/* an open-source language model constructed by{' '}
          <ExternalLink href="https://github.com/Open-Nice">
           Nice
          </ExternalLink>
          {' '} and empowered by Rice<span style={{ fontSize: '25px' }} placeholder='Owl'>🦉</span>s. */}
        </p>
        <p className="leading-normal text-muted-foreground">
          Ask me anything you want to learn about Rice!
        </p>
        <div className="mt-4 flex flex-col items-start space-y-2">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              onClick={() => setInput(message.message)}
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
