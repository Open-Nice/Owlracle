import prisma from '@/lib/prisma'
import { supabaseClient } from '@/app/supaClient'
import { codeBlock, oneLine } from 'common-tags'
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import GPT3Tokenizer from 'gpt3-tokenizer'
import { openAiAPIStream } from '@/app/openaiApiCall'

export const dbIdRpcMap : { [key: number]: string } = {
  1: 'match_courses', // Course basic info
  2: 'match_open_courses', // Course open status
  3: 'match_eval_comments', // Course evaluation comments
  4: 'match_eval_scores', // Course evaluation scores
  5: 'match_faculties', // Faculties
  // 6: '', // Notes
  7: 'match_events', // Events
  8: 'match_organizations', // Clubs
  9: 'match_careers', // Career
  10: 'match_academic_resources', // Academic resources
  11: 'match_course_roadmap', // Course roadmap
  12: 'match_program_resources' // Program resources
  // 13: '' // Major requirement
}

export const runtime = 'edge'

const embeddingFn = new OpenAIEmbeddings()

export async function courseEx(userPrompt: string, dbs: number[]) : Promise<Response> {
    
    // Convert unrecognized tokens 'COMP 140' -> 'computational thinking'
    userPrompt = await substitute(userPrompt)

    // Create embedding for prompt
    const embed = await embeddingFn.embedQuery(userPrompt.replaceAll('\n', ' '))

    // Retrieve contexts
    let combinedPageSections = []
    for (let dbId of dbs) {

      if (dbId in dbIdRpcMap) {
        const { error: matchError, data: pageSections } = await supabaseClient.rpc(
          `${dbIdRpcMap[dbId]}`,
          {
            query_embedding: embed,
            match_threshold: 0.78,
            match_count: Math.floor(5),
          }
        )
        if (matchError) {
            console.log('Failed to match page sections', matchError)
            throw new Error(`Failed to match page sections`)
        }
        combinedPageSections.push(...pageSections)
      }
    }

    const tokenizer = new GPT3Tokenizer({ type: 'gpt3' })
    let tokenCount = 0
    let contextText = ''

    for(let pageSection of combinedPageSections) {
      const content = pageSection.content
      const encoded = tokenizer.encode(content)
      tokenCount += encoded.text.length

      contextText += `${content.trim()}\n---\n`
    }

    // console.log(contextText)

    userPrompt = codeBlock`
        Student question: ${userPrompt}

        ${oneLine`
        You are a course expert to Rice Univ. student.
        Answer above question using context below concisely and accurately.
        In your answer:
        1. Format your answer in chunks for readability.
        2. Use detailed reasoning in your answer to provide the best possible guidance.
        3. Include all relevant sources from context.
        4. Include url that appeared in the context for each relavent reference.
        5. At the end of your answer, mention some aspect of the courses you gave and ask if the student's interested in learning more about it.
        6. If you are unsure how to answer, say 
        "Sorry, I don't know how to help with that. I have kept in mind to learn this next time we meet."
        `}
        
        Context:
        ${contextText}
    `

    return openAiAPIStream(userPrompt, 'gpt-3.5-turbo')
}


// substitute "... Comp 140 ..." -> "Computational thinking"
const substitute = async (query: string): Promise<string> => {
    const matches = findAllPatterns(query)
  
    // console.log("matches", matches)
  
    if (matches.length == 0)
      return query
  
    const formatMatches = format(matches)
  
    // console.log("formatMatches", formatMatches)
  
    const replace = await getSubs(formatMatches)
  
    // console.log("replace", replace)
  
    const final_query = subQuery(query, replace)
  
    // console.log("final_query", replace)
  
    return final_query.trim()
    
  
  
    function findAllPatterns(sentence: string): string[] {
      const pattern = /\b[A-Za-z]{4}\s*\d{3}\b/gi
      const matches = sentence.match(pattern);
  
      return matches ? matches : [];
    }
    function format(matches: string[]): string[] {
      let formattedMatches: string[] = [];
      const letterPattern = /[A-Za-z]{4}/i;
      const numberPattern = /\d{3}/;
  
      for (let match of matches) {
          let letters = match.match(letterPattern);
          let numbers = match.match(numberPattern);
  
          if (letters && numbers) {
              let formattedMatch = `${letters[0].toUpperCase()} ${numbers[0]}`;
              formattedMatches.push(formattedMatch);
          }
      }
  
      return formattedMatches;
    }
    async function getSubs(matches: string[]): Promise<string[]> {
      let replace = []
  
      const subResults = await prisma.courseCatalog.findMany({
        where: {
          OR: matches.map((match) => ({
            cNum: match.split(' ')[1],
            cField: match.split(' ')[0],
          })),
        },
        select: {
          cField: true,
          cNum: true,
          course_name: true
        },
      })
  
      for (let match of matches) {
        let [cField, cNum] = match.split(' ');
        const course_name = subResults.find(e => e.cField == cField && e.cNum == cNum)?.course_name
        replace.push(course_name ? `Course(${cField} ${cNum}/${course_name})` : `${cField} ${cNum}`)
      }
  
      return replace
    }
    function subQuery(query: string, subResults: string[]): string {
      function replaceSubstring(query: string, startPos: number, endPos: number, subResult: string): string {
          return query.slice(0, startPos) + subResult + query.slice(endPos);
      }
  
      const pattern = /\b[A-Za-z]{4}\s*\d{3}\b/gi
      let matches = Array.from(query.matchAll(pattern));
  
      let matchPositions: Array<[string, [number, number]]> = [];
      for (let match of matches) {
          let startPos = match.index!;
          let endPos = match.index! + match[0].length;
          matchPositions.push([match[0], [startPos, endPos]]);
      }
  
      matchPositions.reverse();
      subResults.reverse();
  
      for (let i = 0; i < matchPositions.length; i++) {
          let startPos = matchPositions[i][1][0];
          let endPos = matchPositions[i][1][1];
          query = replaceSubstring(query, startPos, endPos, subResults[i]);
      }
  
      return query;
    }
}