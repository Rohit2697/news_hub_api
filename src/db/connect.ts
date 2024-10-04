import mongoose from 'mongoose';
import logger from '../logger';
mongoose.connect('mongodb://localhost:27017/newsdb').then(() => logger.info("connected")).catch(err => logger.error(err))