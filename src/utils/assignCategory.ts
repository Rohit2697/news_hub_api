import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai'
//import { Filter } from 'bad-words'
import env from '../env'
import { NewsArticle } from '../interface'
import Bottleneck from 'bottleneck'
import logger from '../logger'
const limiter = new Bottleneck({
  minTime: 4000
})
//const filter = new Filter()
const assignCategory = async (artcle: NewsArticle) => {
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

    const newPrompt = `Categorize the title "${artcle.title}" into one of the following: ["business", "entertainment", "general", "health", "science", "sports", "technology"]. Return only the category.`

    const result = await limiter.schedule(() => model.generateContent(newPrompt))
    logger.info(`title: ${artcle.title}, assigned category:${result.response.text()}`)
    return { ...artcle, category: result.response.text() }
  } catch (err) {

    logger.error("Unable to assign Category", err)

    return { ...artcle, category: "general" }
    //throw new ErrorApi('Unable to assign category', 500)

  }
}

export default assignCategory
//generateText("generate one content and return the content alone by improving this follwoing news content",`"Indias highest court has ordered protesting doctors who have been on strike as they demand better working conditions after the rape and murder of a trainee doctor, to return to work by 5 p.m. Tuesday… [+3998 chars]`).then(res => console.log(res)).catch(err => console.log(err))