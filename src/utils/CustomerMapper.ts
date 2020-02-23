import Customer from "../models/Customer";
import { Document } from "mongoose";

class CustomerMapper {
  static mapCustomer(customer: Document) {
    const customerCopy = new Customer();
    customerCopy.id = customer.get("_id");
    customerCopy.name = customer.get("name");
    customerCopy.email = customer.get("email");
    customerCopy.phone = customer.get("phone");
    return customerCopy;
  }
  static mapCustomers(customers: Document[]): Customer[] {
    return customers.map(this.mapCustomer);
  }
}

export default CustomerMapper;
