import Request from './request';

class LogService {
  constructor() {
    this.request = new Request();
  }
  get() {
    return this.request.get('logs');
  }
}

export default LogService;
export { LogService };
