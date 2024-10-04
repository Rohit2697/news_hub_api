import { Document } from "mongoose"
export interface NewsResult {
  status: "ok" | "error"
  totalResults: number
  articles: NewsArticle[]
}
// export interface ErrorApi{
//   status:string
//   code:number,
//   message:string
// }
export interface NewsArticle {
  source: {
    id: string
    name: string

  },
  author: string
  title: string
  description: string
  url: string
  urlToImage: string
  publishedAt: string
  content: string

}

export interface EverythingAPIQueries {

  apiKey: string,
  q?: string,
  sources?: string,
  domains?: string,
  excludeDomains?: string,
  from?: string,
  to?: string,
  language?: "en",
  sortBy?: "relevancy" | "popularity" | "publishedAt",
  pageSize?: number,
  page?: number


}

export interface TopHeadLine {

  apiKey: string,
  country?: string,
  category: string,
  sources?: string,
  q?: string,
  language?: string,
  pageSize: number,
  sortBy?: "relevancy" | "popularity" | "publishedAt",
  page: number
}

export interface AllNewsQueryObj {
  endpoint: string
  category?: string,
  apiKey: string,
  q: string
  sortBy: "relevancy" | "popularity" | "publishedAt",
  page: number,
  pageSize: number,
  language: string
}
export interface AllNewsParamObj {
  category?: string,
  apiKey: string,
  q: string
  sortBy: "relevancy" | "popularity" | "publishedAt",
  page: number,
  pageSize: number,
  language: string
}

export interface IUser extends Document {
  username: string,
  email: string,
  password: string,
  role: string
}
export interface IAllNews extends Document {
  source: {
    id: string
    name: string

  },
  category: string,
  author: string
  title: string
  description: string
  url: string
  urlToImage: string
  publishedAt: Date
  content: string
}
export interface CategoryNewsQuery {
  category: string,

}

export interface SearchNewsQuery {
  $or?: [
    { title: { $regex: RegExp } },
    { content: { $regex: RegExp } }
  ]
}
export interface IPopulateNews {
  title: string;
  content: string;
  category: string;
  // other fields like publishedAt, etc., if necessary
}