
import { Request, Response, NextFunction } from 'express'
import { AllNewsQueryObj } from '../interface';
import generateQueries from '../utils/generateQueries';
import ErrorApi from '../Error';
import env from '../env';
const supportedCategories = ["business", "entertainment", "general", "health", "science", "sports", "technology"]
const allNewsMiddleWare = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //const queries = req.query;
    if (req.query.category) {
      if (!supportedCategories.includes(req.query.category as string)) throw new ErrorApi("Unsupported Category", 400)
        //prepare for top-headline
        const topHeadlineQueryObj: AllNewsQueryObj = {
          endpoint: '/top-headlines',
          category: req.query.category as string,
          apiKey: env.news_api_key || '',
          q: await generateQueries(req.query.q as string) || "",
          sortBy: "publishedAt",
          page: parseInt(req.query.page as string || '1'),
          pageSize: 10,
          language: "en"
        }
      req.body = topHeadlineQueryObj
      return next()
    }
    const allNewsQueryObj: AllNewsQueryObj = {
      endpoint: '/everything',
      apiKey: env.news_api_key || '',
      q: await generateQueries(req.query.q as string) || "India",
      sortBy: "publishedAt",
      page: parseInt(req.query.page as string || '1'),
      pageSize: 10,
      language: "en"
    }

    req.body = allNewsQueryObj
    return next()
  } catch (err) {
    if (err instanceof ErrorApi) {
      const errObj = err.getError()
      return res.status(errObj.code).json(errObj)
    }

  }
}

export default allNewsMiddleWare