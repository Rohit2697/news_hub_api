import mongoose, {  Schema } from "mongoose"
import logger from "../../logger"

//import generateText from "../../utils/generateText"

import { IAllNews } from "../../interface"

const allNewsSchema: Schema<IAllNews> = new Schema({
  title: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  content: { type: String, trim: true },
  author: { type: String },
  publishedAt: { type: Date, required: true },
  source: {
    id: { type: String, default: null },
    name: { type: String, required: true }
  },
  url: { type: String, required: true },
  urlToImage: { type: String }
})


allNewsSchema.pre<IAllNews>("save", function (next) {
  try {
    if (this.isModified('publishedAt') && typeof this.publishedAt === 'string') this.publishedAt = new Date(this.publishedAt)
    next()
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err)
      next(err)
    }
  }
})
const AllNews = mongoose.model<IAllNews>('All_News', allNewsSchema)
export default AllNews
