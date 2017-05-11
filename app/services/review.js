import Request from './request';

class ReviewService {
  constructor() {
    this.request = new Request();
  }

  add(data) {
    return this.request.post('reviews', {}, data);
  }

  get() {
    return this.request.get('reviews');
  }
}

export default ReviewService;
export { ReviewService };
