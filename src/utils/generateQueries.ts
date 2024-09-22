import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai'
//import { Filter } from 'bad-words'
import env from '../env'
import ErrorApi from '../Error'
//const filter = new Filter()
const generateQueries = async (query: string | undefined): Promise<string> => {
  if (!query) return '';
  if (query.trim().split(' ').length < 2) return query
    //if (filter.isProfane(query)) throw new ErrorApi("Profane Word Found", 400)
    const genAI = new GoogleGenerativeAI(env.google_api_key || '')
  const model = genAI.getGenerativeModel({
    model: env.gemini_model || '', safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ]
  })
  try {
    const prompt = `Read the query "${query}" and generate one searchable query, do not use any delimeters except space`
    const result = await model.generateContent(prompt)
    return result.response.text()
  } catch {
    throw new ErrorApi('Unable to generate query', 500)
  }
}
export default generateQueries

// generateQueries("").then(res => console.log(res)).catch(err => console.log(err))