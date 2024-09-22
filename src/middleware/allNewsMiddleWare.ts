
import { Request, Response, NextFunction } from 'express'
import { EverythingAPIQueries } from '../interface';
import generateQueries from '../utils/generateQueries';
import ErrorApi from '../Error';
import env from '../env';
const allNewsMiddleWare = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //const queries = req.query;

    const queryObj: EverythingAPIQueries = {
      apiKey: env.news_api_key || '',
      q: await generateQueries(req.query.q as string) || "india",
      sortBy: "publishedAt",
      page: parseInt(req.query.page as string || '1'),
      pageSize: 10,
      language: "en"
    }
    req.body = queryObj
    return next()
  } catch (err) {
    if (err instanceof ErrorApi) {
      const errObj = err.getError()
      return res.status(errObj.code).json(errObj)
    }

  }
}

export default allNewsMiddleWare