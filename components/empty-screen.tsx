import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'

const exampleMessages = [
  {
    heading: 'Looking for some class? 📚',
    message: `Give me some philosophy of mind class?`
  },
  {
    heading: 'Connect with some faculties? 🤠',
    message: `Find me some professors in machine leanring?`
  },
  {
    heading: "Find interesting stuff to do 🎮",
    message: `What are some interesting activities recently?`
  },
  {
    heading: "Join interesting organizations 🎨",
    message: `what design clubs are there?`
  }
]

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, 'setInput'>) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">
          I am Owlracle:
        </h1>
        <p className="mb-2 leading-normal text-muted-foreground">
          An Open Source language model started by{' '}
          <ExternalLink href="https://github.com/Open-Nice">
           Nice
          </ExternalLink>
          {' '}empowered by Rice<span style={{ fontSize: '25px' }}>🦉</span>s
        </p>
        <p className="leading-normal text-muted-foreground">
          Here are some interesting questions to get started:
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
