class Response<T> {
  constructor() {
    this.body = {
      errors: [],
    };
  }
  body: {
    data?: T;
    errors?: String[];
  };
  status: number;
}

export default Response;
