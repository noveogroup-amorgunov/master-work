import Request from './request';

class UserService {
  constructor() {
    this.request = new Request();
  }

  getMe() {
    return this.request.get('me');
  }

  getByUsername(name) {
    return this.request.get('users/name/{username}', { username: name });
  }

  changePassword(data) {
    return this.request.post('change-password', {}, data);
  }
}

export default UserService;
export { UserService };
