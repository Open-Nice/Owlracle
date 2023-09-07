import { codeBlock, oneLine } from 'common-tags'
import { openAiAPIStream } from '@/app/openaiApiCall'
import { investigate , getSafeTurboPrompt } from '@/app/knowledge/investigate'

export const runtime = 'edge'

const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
const chrono = require('chrono-node')

dayjs.extend(utc)
dayjs.extend(timezone)

const chicagoTime = dayjs().tz('America/Chicago')

function getDatesFromPrompt(prompt: string): string[] {

    const chicagoTimeInUTC = new Date(chicagoTime)

    // console.log('chicago time in UTC:', chicagoTimeInUTC)

    const parsedDate = chrono.parseDate(prompt, chicagoTimeInUTC)

    // console.log('parsedDate is', parsedDate)

    if ( parsedDate ) {
        // Convert parsedDate to chicago time
        const parsedDateInChicagoTime = dayjs(parsedDate).tz('America/Chicago')
        // console.log('parsedDate in Chicago time:', parsedDateInChicagoTime.format('YYYY-MM-DD'))

        return [parsedDateInChicagoTime.format('YYYY-MM-DD')]
    }

    return []
}

export async function eventEx(userPrompt: string, dbs: number[], specificity: number) : Promise<Response> {

    const dates = getDatesFromPrompt(userPrompt)

    // console.log(dates)

    const contextText = await investigate(userPrompt, dbs, specificity, dates.length > 0 ? {'date': dates[0]} : null)

    // console.log(contextText)

    userPrompt = codeBlock`
        Student question: ${userPrompt}

        Today is ${chicagoTime.format('dddd YYYY-MM-DD')}.

        ${oneLine`
        You are a event expert for Rice Univ. students.
        Answer question above using context below concisely and accurately.
        In your answer:
        1. First filter events with date that meets student's question.
        2. For each event, give a concise description, date, urls, and location.
        3. At the end of your answer, mention some aspect of the events you gave and ask if the student's interested in learning more about it.
        4. If you are unsure how to answer, say 
        "Sorry, I don't know how to help with that. I have kept in mind to learn this next time we meet."
        `}

        Here are some events:
        ${contextText}
        Answer in markdown:
    `

    userPrompt = await getSafeTurboPrompt(userPrompt)

    // console.log(userPrompt)

    return openAiAPIStream(userPrompt, 'gpt-3.5-turbo-16k')
}