import Request from './request';

class ProgramService {
  constructor() {
    this.request = new Request();
  }

  validate(data) {
    return this.request.post('programs/permutation-test/validate', {}, data);
  }
}

export default ProgramService;
export { ProgramService };
