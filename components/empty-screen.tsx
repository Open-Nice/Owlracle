import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'

const exampleMessages = [
  {
    heading: "today",
    message: `Some events today plz`
  },
  {
    heading: "tomorrow",
    message: `Some events tomorrow plz`
  },
  {
    heading: "this Firday",
    message: `Some events this Friday plz`
  },
  {
    heading: "over weekend",
    message: `Some events this Saturday plz`
  },
  {
    heading: "Surprise me 🤯",
    message: `Suggest some fun and chill events, both outside and inside.`
  }
]

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, 'setInput'>) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">

        <p className="mb-2 leading-normal text-muted-foreground">
          What to do:
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
