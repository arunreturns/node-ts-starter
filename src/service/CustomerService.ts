import logger from "../config/LoggerConfig";
import Customer from "../models/Customer";
import CustomerModel from "../schema/CustomerModel";
import CustomerMapper from "../utils/CustomerMapper";
import Response from "../models/Response";

class CustomerService {
  static async getCustomerFromDB(): Promise<Response<Customer[]>> {
    const response = new Response<Customer[]>();
    try {
      logger.info("[CustomerService] Inside getCustomerFromDB");
      const resp = await CustomerModel.find({});
      response.body.data = CustomerMapper.mapCustomers(resp);
      response.status = 200;
    } catch (error) {
      logger.error("[CustomerService] Error in getCustomerFromDB ", error);
      response.body.errors.push(error);
      response.status = 500;
    }
    return response;
  }

  static async addCustomerToDB(
    customer: Customer,
  ): Promise<Response<Customer>> {
    const response = new Response<Customer>();
    try {
      logger.info("[CustomerService] Inside addCustomerToDB ", customer);
      const newCustomer = new CustomerModel();
      newCustomer.set("name", customer.name);
      newCustomer.set("email", customer.email);
      newCustomer.set("phone", customer.phone);
      const resp = await newCustomer.save();
      response.body.data = CustomerMapper.mapCustomer(resp);
      response.status = 200;
    } catch (error) {
      logger.error("[CustomerService] Error in addCustomerToDB ", error);
      response.body.errors.push(error);
      response.status = 500;
    }
    return response;
  }

  static async deleteCustomerFromDB(id: string): Promise<Response<Customer>> {
    const response = new Response<Customer>();
    try {
      logger.info("[CustomerService] Inside deleteCustomerFromDB " + id);
      const resp = await CustomerModel.findByIdAndDelete(id);
      if (resp === null) {
        response.body.errors.push("No data found for this id " + id);
        response.status = 500;
      } else {
        response.body.data = CustomerMapper.mapCustomer(resp);
        response.status = 200;
      }
    } catch (error) {
      logger.error("[CustomerService] Error in deleteCustomerFromDB" + error);
      response.body.errors.push(error);
      response.status = 500;
    }
    return response;
  }
}

export default CustomerService;
