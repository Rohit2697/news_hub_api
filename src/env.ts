import dotenv from 'dotenv'
dotenv.config()

const env = {
  port: process.env.PORT,
  news_api_key: process.env.NEWS_API_KEY,
  news_api_host: process.env.NEWS_API_HOST,
  google_api_key: process.env.GOOGLE_API_KEY,
  gemini_model: process.env.GEMINI_MODEL
}

export default env