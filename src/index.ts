import express from 'express'
import env from './env'
import cors from 'cors'
import helmet from 'helmet'
import router from './router'
import './db/connect'
import logger from './logger'
const app = express()
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use('/', router)


app.listen(env.port, () => logger.info(`News Hub Api running on port:${env.port}`))
