import Request from './request';

class UserService {
  constructor() {
    this.request = new Request();
  }

  getMe() {
    return this.request.get('me');
  }

  delete(id) {
    return this.request.delete('users/{id}', { id });
  }

  updateStatus(id, status) {
    const action = status ? 'active' : 'disactive';
    return this.request.post('users/{id}/{action}', { id, action });
  }

  getUsers() {
    return this.request.get('users');
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
