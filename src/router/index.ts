import express from 'express'
import getAllNews from '../newsApi/getAllNews';
import ErrorApi from '../Error';
import allNewsMiddleWare from '../middleware/allNewsMiddleWare';
import { TopHeadLine } from '../interface';
import env from '../env';
import getTopHeadline from '../newsApi/getTopHeadlines';
const router = express.Router()

router.get('/allNews', allNewsMiddleWare, async (req, res) => {
  console.log("called")
  try {
    const result = await getAllNews(req.body)
    res.status(200).json(result)
  } catch (err) {
    if (err instanceof ErrorApi) res.status(err.code).json(err.getError())
  }
})
router.get('/topHeadLine', async (req, res) => {
  try {
    const category = req.query.category as string | undefined
    const page = req.query.page as string | undefined

    const supportedCategories = ["business", "entertainment", "general", "health", "science", "sports", "technology"]

    if (!category || !supportedCategories.includes(category)) {
      throw new ErrorApi("Unsupported Category", 400)
    }
    const queryObj: TopHeadLine = {
      apiKey: env.news_api_key || '',
      page: parseInt(page || '1'),
      pageSize: 10,
      category
    }
    const result = await getTopHeadline(queryObj)
    res.status(200).send(result)
  } catch (err) {
    if (err instanceof ErrorApi) return res.status(err.code).json(err.getError())
  }
})
export default router

