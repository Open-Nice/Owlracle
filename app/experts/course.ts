import prisma from '@/lib/prisma'
import { codeBlock, oneLine } from 'common-tags'
import { openAiAPIStream } from '@/app/openaiApiCall'
import { investigate , getSafeTurboPrompt } from '@/app/knowledge/investigate'
import { promptPrinciple } from '@/app/experts/expert'

export const runtime = 'edge'

export async function courseEx(userPrompt: string, dbs: number[], specificity: number) : Promise<Response> {
    
    // Convert unrecognized tokens 'COMP 140' -> 'computational thinking'
    userPrompt = await substitute(userPrompt)

    const contextText = await investigate(userPrompt, dbs, specificity)

    // console.log(contextText)

    userPrompt = codeBlock`
        Student question: ${userPrompt}

        ${oneLine`
        You are a course expert to Rice Univ. student.
        Answer above question using context below concisely and accurately.
        In your answer:
        1. Format your answer in chunks for readability.
        2. Use detailed reasoning in your answer to provide the best possible guidance.
        3. Only include relevant courses from context. No need to cover all courses.
        4. Don't include url unless they appear in the context.
        5. ${promptPrinciple['Ask what you do not know']}
        `}
        
        Context:
        ${contextText}
        Answer in markdown:
    `

    userPrompt = await getSafeTurboPrompt(userPrompt)

    return openAiAPIStream(userPrompt, 'gpt-3.5-turbo-16k')
}


// substitute "... Comp 140 ..." -> "Computational thinking"
export const substitute = async (query: string): Promise<string> => {
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