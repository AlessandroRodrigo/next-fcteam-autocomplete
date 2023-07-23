import { api } from "@/lib/axios";

type GetCustomersOutput = {
  _id: string;
  company: string;
  name: string;
  active: true;
  __v: 0;
}[];

export class CustomerService {
  static async getCustomers(company: string) {
    const response = await api.get("/customers", {
      params: {
        company,
        active: true,
      },
    });

    return response.data as GetCustomersOutput;
  }
}
