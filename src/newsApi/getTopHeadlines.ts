import { AxiosError } from "axios";
import { NewsResult, TopHeadLine } from "../interface";
import api from "./api";
import ErrorApi from "../Error";
import filterArticles from "../utils/filterValidArticles";
const getTopHeadline = async (queryObj: TopHeadLine): Promise<NewsResult> => {
  try {
    const response = await api.get('/top-headlines', {
      params: queryObj
    })
    console.log(queryObj)
    const data = response.data as NewsResult
    const validArticles = filterArticles(data.articles)
    return {
      status: data.status,
      totalResults: validArticles.length,
      articles: validArticles
    }
  } catch (err) {
    if (err instanceof AxiosError) throw new ErrorApi((err.response?.data?.message || err.message), (err.response?.data?.code || err.status))
    throw new ErrorApi()
  }
}
export default getTopHeadline