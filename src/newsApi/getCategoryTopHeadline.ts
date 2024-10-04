
import env from "../env";
import { NewsResult } from "../interface";

import filterArticles from "../utils/filterValidArticles";
import axios, { AxiosResponse } from "axios";

import trimString from "../utils/trimContent";
import logger from "../logger";
import summerizeText from "../utils/generateText";

export const getTopHeadline = async (category: string) => {

  const topheadeline_axios_result = await axios.get(env.news_api_host + '/top-headlines' as string, {
    params: {
      apiKey: env.news_api_key,
      pageSize: 100,
      language: "en",
      category: category,
      sortBy: "publishedAt"
    }

  }) as AxiosResponse<NewsResult>

  const goodArticles = filterArticles(topheadeline_axios_result.data.articles)
  return goodArticles.map(article => {
    return { ...article, category }
  })

}
const getTopHeadLineBasedOnCategory = async () => {
  const supportedCategories = ["business", "entertainment", "general", "health", "science", "sports", "technology"]


  const topHeadlineResultsArr = await Promise.all(supportedCategories.map(category => getTopHeadline(category)))
  const convertedFlatArr = topHeadlineResultsArr.flat()
  logger.info(`Total TopHeadline articles: ${convertedFlatArr.length}`)
  for (let i = 0; i < convertedFlatArr.length; i++) {
    convertedFlatArr[i].title = await summerizeText( trimString(convertedFlatArr[i].title))
    convertedFlatArr[i].content = await summerizeText(trimString(convertedFlatArr[i].content))
    logger.info(`${i + 1}/${convertedFlatArr.length}  TopHeadlines are completed`)
  }


  return convertedFlatArr

}
export default getTopHeadLineBasedOnCategory