import { model, Schema } from 'mongoose'

export const DOCUMENT_NAME = 'FriendStatus'
export const COLLECTION_NAME = 'friendstatus' // display on database

export default interface FriendStatus {
  status: string
}

const schema = new Schema<FriendStatus>(
  {
    status: {
      type: Schema.Types.String,
      unique: true,
      default: 'PENDING',
      value: ['PENDING', 'FRIEND', 'UNFRIEND', 'REJECT']
    }
  },
  {
    versionKey: false,
    timestamps: false
  }
)

export const FriendStatusModel = model<FriendStatus>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME
)
