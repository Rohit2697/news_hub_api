import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai'
import Bottleneck from 'bottleneck'
//import { Filter } from 'bad-words'
import env from '../env'
import logger from '../logger'

//const filter = new Filter()
const limiter = new Bottleneck({
  minTime: 4000
})

const summerizeText = async (textTogenerate: string): Promise<string> => {

  if (!textTogenerate) return ''

  const genAI = new GoogleGenerativeAI(env.google_api_key || '')
  const model = genAI.getGenerativeModel({
    model: env.gemini_model || '',

    generationConfig: {
      topK: 64,
      temperature: 1,
      maxOutputTokens: 200,
      responseMimeType: "text/plain"
    },
    safetySettings: [
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

    const prompt = `Summarize this news content: "${textTogenerate}" in one concise sentence.Do not include any breakdowns, just the summary.`

    logger.debug(`Generating content for: ${textTogenerate}`)
    const result = await limiter.schedule(() => model.generateContent(prompt))
    logger.debug(`Generated content : ${result.response.text()}`)
    return result.response.text()
  } catch (err) {
    logger.error("textTogenerate: ", textTogenerate)
    logger.error("error: ", err)
    return textTogenerate
    // throw new ErrorApi('Unable to generate Content', 500)
  }
}

export default summerizeText
//generateText("generate one content and return the content alone by improving this follwoing news content",`"<ul><li>Solanas trading volume and weighted sentiment dropped in the last few days. </li><li>SOL can make a rebound if it drops to $144. </li></ul>Solana [SOL] bulls have managed to maintain their ad… [+1886 chars]`).then(res => console.log(res)).catch(err => console.log(err))