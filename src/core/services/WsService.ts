import logger from '../../utils/logger'
import JWTService from './JWTService'
import MessageService from './MessageService'
import FriendService from './FriendService'
import {
  JWT_PAYLOAD,
  WebSocketEvent,
  IRequest,
  ISocketEventGetOnlineUsers,
  ISocketEventSendMessage
} from '../../types'
const _logger = logger('WsService')

class WsService {
  static SOCKET_EVENTS = {
    GET_ONLINE_USERS: 'GET_ONLINE_USERS',
    SEND_MESSAGE: 'SEND_MESSAGE',
    HAS_NEW_MESSAGE: 'HAS_NEW_MESSAGE',
    UPDATE_FRIEND_LIST: 'UPDATE_FRIEND_LIST',
    CLOSE_CONNECTION: 'CLOSE_CONNECTION',
    GET_FRIEND_LIST: 'GET_FRIEND_LIST',
    GET_FRIEND_REQUEST: 'GET_FRIEND_REQUEST',
    SEND_FRIEND_REQUEST: 'SEND_FRIEND_REQUEST',
    ACCEPT_FRIEND_REQUEST: 'ACCEPT_FRIEND_REQUEST',
    REJECT_FRIEND_REQUEST: 'REJECT_FRIEND_REQUEST',
    HAS_NEW_NOTIFICATION: 'HAS_NEW_NOTIFICATION',
    GET_NOTIFICATIONS: 'GET_NOTIFICATIONS',
    UPDATE_NOTIFICATION: 'UPDATE_NOTIFICATION'
  }

  static clients: Map<string, WebSocket> = new Map()

  static onConnection(socket: any, req: IRequest): void {
    const accessToken = req.url?.split('?')[1].split('accessToken=')[1]
    if (!accessToken) {
      socket.close(1008, 'No access token provided')
      return
    }
    try {
      const data: JWT_PAYLOAD = JWTService.verifyAccessToken(accessToken)
      WsService.clients.set(data.id, socket)
      socket.on('message', WsService._onMessage)
      socket.on('error', (err: any) => _logger.error('Socket', err))
      socket.on('close', () => {
        WsService.clients.delete(data.id)
      })
    } catch (error: Error | any) {
      socket.close(1008, 'INVALID_ACCESS_TOKEN')
      _logger.error('error.message', error.message)
    }
  }

  static async _onMessage(event: WebSocketEvent): Promise<void> {
    try {
      const data = JSON.parse(event as any)
      if (!data.type || !data.payload) return
      const clientIds = Array.from(WsService.clients.keys())
      const { type, payload } = data
      switch (type) {
        case WsService.SOCKET_EVENTS.GET_ONLINE_USERS:
          const { userId } = payload as ISocketEventGetOnlineUsers
          const user = WsService.clients.get(userId)
          if (!user) return WsService.closeConnection(userId)
          const friends = await FriendService.getMyFriends(userId)
          const onlineUsers = clientIds.filter((id: string) =>
            friends?.some((friend: any) => friend._id.toString() === id)
          )
          WsService.sendDataToClientById(userId, {
            type: WsService.SOCKET_EVENTS.GET_ONLINE_USERS,
            payload: onlineUsers
          })
          break
        case WsService.SOCKET_EVENTS.SEND_MESSAGE:
          const { _id, senderId, receiverId, message, createdAt } =
            payload as ISocketEventSendMessage
          await MessageService.createMessage({
            senderId,
            receiverId,
            message,
            createdAt
          })
          WsService.sendDataToClientById(receiverId, {
            type: WsService.SOCKET_EVENTS.HAS_NEW_MESSAGE,
            payload: {
              _id,
              senderId,
              receiverId,
              message,
              createdAt
            }
          })
          break
      }
    } catch (error: Error | any) {
      _logger.error('error.message', error.message)
    }
  }

  static sendDataToClientById(userId: string, data: any) {
    const client = WsService.clients.get(userId)
    if (!client) return
    client.send(JSON.stringify(data))
  }

  static closeConnection(userId: string) {
    const client = WsService.clients.get(userId)
    client?.close()
    WsService.clients.delete(userId)
  }
}

export default WsService
