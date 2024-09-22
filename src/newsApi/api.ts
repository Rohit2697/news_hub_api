import axios from "axios";
import env from "../env";
const api = axios.create({
  baseURL: env.news_api_host,

})


export default api