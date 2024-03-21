import FriendRepository from '../repositories/FriendRepository';

class FriendService {
  sendFriendRequest(data: FriendRequest) {
    return FriendRepository.SendFriendRequest(data);
  }

  getAllUsersNonFriends(id: string) {
    return FriendRepository.GetAllUsersNonFriends(id);
  }

  getFriendRequest(id: string) {
    return FriendRepository.GetFriendRequests(id);
  }

  getMyFriends(id: string) {
    return FriendRepository.getMyFriends(id);
  }

  updateStatusFriend(data: FriendRequest) {
    return FriendRepository.updateStatusFriend(data);
  }
}

export default new FriendService();
