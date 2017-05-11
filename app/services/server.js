import Request from './request';

class ServerService {
  constructor() {
    this.request = new Request();
  }

  off(id) {
    return this.request.post('servers/{id}/off', { id });
  }

  on(id) {
    return this.request.post('servers/{id}/on', { id });
  }

  get() {
    return this.request.get('servers');
  }
}

export default ServerService;
export { ServerService };
