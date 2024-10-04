import axios, { AxiosResponse } from "axios";
import env from "../env";
import { NewsResult } from "../interface";
import filterArticles from "../utils/filterValidArticles";
import assignCategory from "../utils/assignCategory";

import trimString from "../utils/trimContent";
import logger from "../logger";
import summerizeText from "../utils/generateText";

const getEveryThingNews = async () => {
  const { data: indianEveryNews } = await axios.get(env.news_api_host + '/everything' as string, {
    params: {
      q: 'india',
      apiKey: env.news_api_key,
      pageSize: 100,
      language: "en",
      sortBy: "publishedAt"
    }
  }) as AxiosResponse<NewsResult>

  const sanitizedArticles = filterArticles(indianEveryNews.articles)
  const result = [];
  logger.info(`Total Everything articles: ${sanitizedArticles.length}`)
  for (let i = 0; i < sanitizedArticles.length; i++) {

    sanitizedArticles[i].title = await summerizeText(trimString(sanitizedArticles[i].title))
    sanitizedArticles[i].content = await summerizeText(trimString(sanitizedArticles[i].content))
    result.push(await assignCategory(sanitizedArticles[i]))
    logger.info(`${i + 1}/${sanitizedArticles.length}  Everything are completed`)
  }


  //Promise.all(sanitizedArticles.map(article=>assignCategory(article))) 
  return result

}
export default getEveryThingNews