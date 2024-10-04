import mongoose, { Document, Schema } from 'mongoose'

export interface Iinteraction extends Document {
  userId: mongoose.Types.ObjectId,
  newsId: mongoose.Types.ObjectId,
}

const interactionSchema: Schema<Iinteraction> = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  newsId: { type: Schema.Types.ObjectId, ref: 'All_News', required: true }
})


const Interaction = mongoose.model<Iinteraction>('interaction', interactionSchema)
export default Interaction