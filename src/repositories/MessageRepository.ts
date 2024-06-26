import { MessageModel } from '../database/model/Message'

class MessageRepository {
  async getAllMessages(userId: string, partner_id: string) {
    const result = await MessageModel.find({
      senderId: { $in: [userId, partner_id] },
      receiverId: { $in: [userId, partner_id] }
    })
      .sort({ createdAt: -1 })
      .limit(100)
    const reversedResult = result.reverse()
    return reversedResult
  }

  async createMessage({
    senderId,
    receiverId,
    message,
    createdAt
  }: {
    senderId: string
    receiverId: string
    message: string
    createdAt: Date
  }) {
    await MessageModel.create({
      senderId,
      receiverId,
      message,
      createdAt
    })
  }

  async getLastMessage(userId: string, partnerId: string) {
    return await MessageModel.findOne({
      senderId: { $in: [userId, partnerId] },
      receiverId: { $in: [userId, partnerId] }
    })
      .sort({ createdAt: -1 })
      .limit(1)
  }

  async deleteAllMessage(senderId: string, receiverId: string) {
    await MessageModel.deleteMany({
      senderId: { $in: [senderId, receiverId] },
      receiverId: { $in: [senderId, receiverId] }
    })
  }
}

export default new MessageRepository()
