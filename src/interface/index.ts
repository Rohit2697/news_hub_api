
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
  pageSize: number,
  page: number
}