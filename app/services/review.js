import Request from './request';

class ReviewService {
  constructor() {
    this.request = new Request();
  }

  add(data) {
    return this.request.post('reviews', {}, data);
  }

  addAnswer(data) {
    const { id, answer } = data;
    return this.request.post('reviews/{id}/add-answer', { id }, { answer });
  }

  get() {
    return this.request.get('reviews');
  }
}

export default ReviewService;
export { ReviewService };
