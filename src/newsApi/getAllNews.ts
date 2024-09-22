import api from "./api";
import { NewsResult, EverythingAPIQueries } from "../interface";
import filterArticles from "../utils/filterValidArticles";

import { AxiosError } from "axios";
import ErrorApi from "../Error";

const getAllNews = (queryObj: EverythingAPIQueries): Promise<NewsResult> => {

  return new Promise((res, rej) => {

    api.get('/everything', {
      params: queryObj
    }).then(response => {
      const data: NewsResult = response.data
      const validArticles = filterArticles(data.articles)
      res({
        status: data.status,
        totalResults: validArticles.length,
        articles: validArticles
      })
    }).catch((err) => {
      if (err instanceof AxiosError) {
        rej(new ErrorApi(err.response?.data?.message || err.message, err.status))
      }
      rej(new ErrorApi())
    })

  })


}

export default getAllNews
