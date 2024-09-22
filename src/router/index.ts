import express from 'express'
import getAllNews from '../newsApi/getAllNews';
import ErrorApi from '../Error';
import allNewsMiddleWare from '../middleware/allNewsMiddleWare';

const router = express.Router()

router.get('/allNews', allNewsMiddleWare, async (req, res) => {
  console.log("called /allNews")
  try {
    const result = await getAllNews(req.body)
    res.status(200).json(result)
  } catch (err) {
    if (err instanceof ErrorApi) res.status(err.code).json(err.getError())
  }
})

export default router

