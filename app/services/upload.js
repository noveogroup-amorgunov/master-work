import Request from './request';

class UploadService {
  constructor() {
    this.request = new Request();
  }
  add(formData, isConfigFile) {
    const requestQuery = isConfigFile ? { config: 1 } : {};
    return this.request.post('tasks/upload-input', {}, formData, { file: true, requestQuery });
  }
}

export default UploadService;
export { UploadService };
