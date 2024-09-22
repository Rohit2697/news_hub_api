import api from "./api";
import { NewsResult, AllNewsQueryObj, AllNewsParamObj } from "../interface";
import filterArticles from "../utils/filterValidArticles";

import { AxiosError } from "axios";
import ErrorApi from "../Error";

const getAllNews = (queryObj: AllNewsQueryObj): Promise<NewsResult> => {

  return new Promise((res, rej) => {
    console.log('calling endpoing: ', queryObj.endpoint)
    console.log('query obj: ', queryObj)
    const { endpoint, ...paramObj } = queryObj

    const AxiosparamObj: AllNewsParamObj = paramObj
    api.get(endpoint, {
      params: AxiosparamObj
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
