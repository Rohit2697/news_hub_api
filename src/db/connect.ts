import mongoose from 'mongoose';
import logger from '../logger';
import env from '../env';
mongoose.connect(`mongodb+srv://${encodeURIComponent(env.mongo_username as string)}:${encodeURIComponent(env.mongo_password as string)}@atlascluster.bv99nzt.mongodb.net/newsdb`).then(() => logger.info("connected")).catch(err => logger.error(err))