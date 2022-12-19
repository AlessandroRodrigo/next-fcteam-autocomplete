import { api } from "@/lib/axios";

export class CustomerService {
  static async getCustomer(company: string): Promise<any> {
    return api.get("/customers", {
      params: {
        company,
        active: true,
      },
    });
  }
}
