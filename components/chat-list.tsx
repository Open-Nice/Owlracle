import { type Message } from 'ai'
import { type UseChatHelpers } from 'ai/react'
import { Separator } from '@/components/ui/separator'
import { ChatMessage } from '@/components/chat-message'
import RelatedQuestionArea from "./related-questions"

export interface ChatList {
  isLoading: Boolean
  messages: Message[],
  setInput: ((input: string) => void ) | null
}

export function ChatList({ isLoading, messages, setInput }: ChatList) {
  if (!messages.length) {
    return null
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.map((message, index) => (
        <div key={index}>
          <ChatMessage isComplete = {! (isLoading && index === messages.length - 1)} message={message} messages = {messages} num = {index}/>
          {index < messages.length - 1 && (
            <Separator className="my-4 md:my-8" />
          )}
        </div>
      ))}
      {
        ! isLoading && setInput ?
          <RelatedQuestionArea setInput = {setInput} messages = {messages}/>
        :
        <></>
      }
    </div>
  )
}
