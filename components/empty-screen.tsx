import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'

const exampleMessages = [
  {
    heading: "Events 🎮",
    message: `What are some interesting events recently? Ideally it's both relaxing and academical. Some free foods would be really awesome!`
  },
  {
    heading: "Clubs 🎨",
    message: `I love climbing. Can you help me find a club for that and give me their GroupMe`
  },
  {
    heading: 'Class 📚',
    message: `Find me a robotics class open next semester. Give me the past students' comments and evaluation. In addition, it's ideal that the lecturer also has research background in robotics.`
  },
  {
    heading: 'Faculty 🤠',
    message: `I want to do research in machine learning related areas. Specifically, I want to study deep neural networks. Find me a professor who ideally both teaches class and does research in neural network.`
  },
]

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, 'setInput'>) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">
          Meet Owlracle
        </h1>
        <p className="mb-2 leading-normal text-muted-foreground">
          Hi! I am Owlracle, your assistant for life and study at Rice.
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
