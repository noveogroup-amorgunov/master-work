import Request from './request';

class TaskService {
  constructor() {
    this.request = new Request();
  }
  getByUser(userId) {
    return this.request.get('tasks/{userId}', { userId });
  }

  getById(id) {
    return this.request.get('tasks/{id}', { id });
  }

  getByTag(name) {
    return this.request.get('questions/tag/{name}', { name });
  }

  add(data) {
    return this.request.post('tasks', {}, data);
  }

  get() {
    return this.request.get('tasks');
  }

  delete(id) {
    return this.request.delete('tasks/{id}', { id });
  }
}

export default TaskService;
export { TaskService };
