class Customer {
  constructor(name?: string, email?: string, phone?: string) {
    this.name = name;
    this.email = email;
    this.phone = phone;
  }
  id: string;
  name: string;
  email: string;
  phone: string;
}

export default Customer;
