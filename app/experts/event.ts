import { codeBlock, oneLine } from 'common-tags'
import { openAiAPIStream } from '@/app/openaiApiCall'
import { investigate , getSafeTurboPrompt } from '@/app/knowledge/investigate'
import { promptPrinciple } from '@/app/experts/expert'

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

    const parsedDate = chrono.parseDate(prompt, chicagoTimeInUTC)

    if ( parsedDate ) {
        // Convert parsedDate to chicago time
        let parsedDateInChicagoTime = dayjs(parsedDate).tz('America/Chicago')

        // Check if parsedDate is in the past
        if ( parsedDateInChicagoTime.isBefore(chicagoTime) ) {
            // If so, advance it by one week
            parsedDateInChicagoTime = parsedDateInChicagoTime.add(1, 'week')
        }

        // console.log('parsedDateInChicagoTime', parsedDateInChicagoTime)

        // If parsedDate is still in the past
        if ( parsedDateInChicagoTime.isBefore(chicagoTime) ) {
            return []
        } else {
            return [parsedDateInChicagoTime.format('YYYY-MM-DD')]
        }

    }

    return []
}

export async function eventEx(userPrompt: string, dbs: number[], _: number, memory: string) : Promise<Response> {

    const dates = getDatesFromPrompt(userPrompt)

    // console.log(dates)

    // Set specificy = 1 -> Only get specific events
    const contextText = await investigate(userPrompt, dbs, 1, dates.length > 0 ? {'date': dates[0]} : null)

    userPrompt = codeBlock`
        Student question: ${userPrompt}

        ${memory !== '' ? `Here are the past conversation between you and user in case you need: ${memory}`
        :
        ''
        }

        Today is ${chicagoTime.format('dddd YYYY-MM-DD')}.

        ${oneLine`
        You are a event expert for Rice Univ. students.
        Answer question above using context below concisely and accurately.
        In your answer:
        1. Include all relevant events from context with date and type meeting student's question.
        2. For each event, give a concise description, date, urls, and location.
        3. ${promptPrinciple['Ask what you do not know']}
        `}

        Here are some events:
        ${contextText}
        Answer in markdown:
    `

    userPrompt = await getSafeTurboPrompt(userPrompt)

    // console.log(userPrompt)

    return openAiAPIStream(userPrompt, 'gpt-3.5-turbo-16k')
}