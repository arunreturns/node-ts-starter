import { Request, Response, Application } from "express";
import logger from "../config/LoggerConfig";
import CustomerService from "../service/CustomerService";
import Customer from "../models/Customer";

class CustomerController {
  static registerController(app: Application, url: string = "/customer") {
    app.get(`${url}/getCustomer`, this.getCustomer);
    app.post(`${url}/addCustomer`, this.addCustomer);
    app.delete(`${url}/deleteCustomer/:id`, this.deleteCustomer);
  }

  static async getCustomer(req: Request, res: Response) {
    logger.info("[CustomerController] Inside getCustomer");
    const resp = await CustomerService.getCustomerFromDB();
    logger.info("[CustomerController] getCustomer - Response", resp);
    res.status(resp.status).send(resp.body);
  }

  static async addCustomer(req: Request, res: Response) {
    logger.info("[CustomerController] Inside addCustomer");
    const newCustomer = new Customer(
      req.body.name,
      req.body.email,
      req.body.phone,
    );
    const resp = await CustomerService.addCustomerToDB(newCustomer);
    logger.info("[CustomerController] addCustomer - Response", resp);
    res.status(resp.status).send(resp.body);
  }

  static async deleteCustomer(req: Request, res: Response) {
    logger.info("[CustomerController] Inside deleteCustomer");
    const resp = await CustomerService.deleteCustomerFromDB(req.params.id);
    logger.info("[CustomerController] deleteCustomer - Response", resp);
    res.status(resp.status).send(resp.body);
  }
}

export default CustomerController;
