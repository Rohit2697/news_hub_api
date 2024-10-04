import express from 'express'
import ErrorApi from '../Error';
import User from '../db/Model/User';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import env from '../env';
import auth from './auth';
import admin from './admin';
import { AxiosError } from 'axios';
import getEveryThingNews from '../newsApi/getEverythingNews';
import AllNews from '../db/Model/AllNews';
import getTopHeadLineBasedOnCategory from '../newsApi/getCategoryTopHeadline';
import logger from '../logger';
import { CategoryNewsQuery, IPopulateNews, SearchNewsQuery } from '../interface';
import Interaction from '../db/Model/Interaction';
import { generateRecommendationCategory } from '../utils/generateRecommendation';

const router = express.Router()


router.post('/register-user', async (req, res) => {
  try {
    const { username, email, password, role } = req.body
    const user = new User({ username, email, password, role })
    await user.save()
    const token = jwt.sign({ userId: user._id }, env.secret_key as string, { expiresIn: "1h" })
    res.status(201).json({ message: 'User registered successfully', token })
  } catch (err) {
    if (err instanceof Error) return res.status(400).json(new ErrorApi(err.message, 400).getError())
    return res.status(500).json(new ErrorApi("Failed to Rgister", 500).getError())

  }
})

router.patch('/forgot-password', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json(new ErrorApi("user not found", 404).getError())
    user.password = password
    await user.save()
    res.status(200).json({ message: "Updated password successfully!" })
  } catch (err) {
    logger.error(err)
    if (err instanceof Error) return res.status(400).json(new ErrorApi(err.message, 400).getError())
    return res.status(500).json(new ErrorApi("Failed to Update Password", 500).getError())
  }
})

router.post('/login-user', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json(new ErrorApi("Invalid email or password", 401).getError())
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(401).json(new ErrorApi("Invalid email or password", 401))
    const token = jwt.sign({ userId: user._id }, env.secret_key as string, { expiresIn: "1h" })
    res.status(200).json({ token })

  } catch (err) {
    if (err instanceof Error) return res.status(400).json(new ErrorApi(err.message, 400).getError())
    return res.status(401).json(new ErrorApi("login failed", 401))
  }

})

router.get('/load-news', auth, admin, async (_req, res) => {
  try {
    const everyNews = await getEveryThingNews()
    const topHeadlineNews = await getTopHeadLineBasedOnCategory()
    const combinedNews = [...everyNews, ...topHeadlineNews]
    await Promise.all(combinedNews.map(news => {
      const allNews = new AllNews(news)
      return allNews.save().then(() => logger.info("Document Saved!"))
    }))
    res.status(200).json({ message: "news saved successfully" })
  } catch (err) {
    logger.error(err)
    if (err instanceof AxiosError) return res.status(err.response?.status || 500).json(new ErrorApi((err.response?.data.message || err.message), (err.response?.status || 500)))
    return res.status(500).json(new ErrorApi().getError())
  }
})
router.get('/categoryNews', auth, async (req, res) => {
  try {
    const category = req.query.category as string || "general";
    const page = parseInt(req.query?.page as string || '1');
    const pageSize = parseInt(req.query?.pageSize as string || '10')
    const query: CategoryNewsQuery = { category }
    const totalResults = await AllNews.countDocuments(query);
    if (!totalResults) return res.status(404).json(new ErrorApi("No Result Found", 404).getError())
    const allNews = await AllNews.find(query).sort({ publishedAt: -1 }).skip((page - 1) * pageSize).limit(pageSize)
    const response = {
      status: "ok",
      totalResults,
      articles: allNews
    }
    res.status(200).json(response)
  } catch (err) {
    logger.error(err)
    res.status(500).json(new ErrorApi().getError())
  }
}

)

router.get('/allNews', auth, async (req, res) => {
  const page = parseInt(req.query?.page as string || '1');
  const pageSize = parseInt(req.query?.pageSize as string || '10')
  const query = {};
  try {
    const totalResults = await AllNews.countDocuments(query);
    if (!totalResults) return res.status(404).json(new ErrorApi("No Result Found", 404).getError())
    const allNews = await AllNews.find(query).sort({ publishedAt: -1 }).skip((page - 1) * pageSize).limit(pageSize)
    const response = {
      status: "ok",
      totalResults: totalResults,
      articles: allNews
    }
    res.status(200).json(response)
  } catch (err) {
    logger.error(err)
    res.status(500).json(new ErrorApi().getError())
  }
})

router.get('/searchNews', auth, async (req, res) => {
  const searchTerm = req.query.searchTerm as string | undefined
  const page = parseInt(req.query?.page as string || '1');
  const pageSize = parseInt(req.query?.pageSize as string || '10')
  if (!searchTerm) return res.status(400).json(new ErrorApi("No Search Term Found", 400).getError())
  try {
    const query: SearchNewsQuery = { $or: [{ title: { $regex: new RegExp(searchTerm, 'i') } }, { content: { $regex: new RegExp(searchTerm, 'i') } }] }
    const totalResults = await AllNews.countDocuments(query);
    if (!totalResults) return res.status(404).json(new ErrorApi("No Result Found", 404).getError())
    const searchedNews = await AllNews.find(query).sort({ publishedAt: -1 }).skip((page - 1) * pageSize).limit(pageSize)
    const response = {
      status: "ok",
      totalResults: totalResults,
      articles: searchedNews
    }
    res.status(200).json(response)
  } catch (err) {
    logger.error(err)
    res.status(500).json(new ErrorApi().getError())
  }
})

router.post('/add-recommendation/:newsId', auth, async (req, res) => {
  const userId = req.body.userId;
  const newsId = req.params.newsId;
  if (!userId || !newsId) return res.status(400).json(new ErrorApi("bad request", 400).getError())
  try {
    const user = await User.findById(userId);
    const news = await AllNews.findById(newsId)
    if (!user || !news) return res.status(400).json(new ErrorApi("bad request", 400).getError())
    const interaction = new Interaction({ userId, newsId })
    await interaction.save()
    res.status(201).json({ message: "added recommendation" })
  } catch (err) {
    logger.error(err)
    res.status(500).json(new ErrorApi().getError())
  }

})

router.get('/get-likes', auth, async (req, res) => {
  try {
    const likes = await Interaction.find({ userId: req.body.userId })
    if (!likes.length) return res.status(200).json({ likes: [] })
    res.status(200).json({ likes: likes.map(interaction => interaction.newsId) })
  } catch (err) {
    logger.error(err)
    return res.status(200).json({ likes: [] })
  }
})

router.delete('/dislike/:newsId', auth, async (req, res) => {
  try {
    const newsId = req.params.newsId
    await Interaction.deleteOne({ userId: req.body.userId, newsId })
    res.status(200).send({ message: "disliked news!" })
  } catch (err) {
    logger.error(err)
    res.status(500).json(new ErrorApi().getError())
  }
})
router.get('/get-recommendation', auth, async (req, res) => {
  try {
    const userId = req.body.userId
    const page = parseInt(req.query?.page as string || '1');
    const pageSize = parseInt(req.query?.pageSize as string || '10')

    if (!userId) return res.status(400).json(new ErrorApi("bad request", 400).getError())
    const interactions = await Interaction.find({ userId }).populate<{ newsId: IPopulateNews }>('newsId')
    if (!interactions.length) return res.status(404).json(new ErrorApi("No Interaction Found", 404).getError())
    const newsArray = interactions.map(interaction => {
      const { category } = interaction.newsId;
      return category;
    });
    const recommendedCategory = generateRecommendationCategory(newsArray)
    const totalResults = await AllNews.countDocuments({ category: recommendedCategory });
    if (!totalResults) return res.status(404).json(new ErrorApi("No Interaction Found", 404).getError())
    const getRecommenedNews = await AllNews.find({ category: recommendedCategory }).sort({ publishedAt: -1 }).skip((page - 1) * pageSize).limit(pageSize)


    res.status(200).json({ status: "ok", totalResults, articles: getRecommenedNews })
  } catch (err) {
    logger.error(err)
    res.status(500).json(new ErrorApi().getError())
  }
})
export default router

