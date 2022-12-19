import { api } from "@/lib/axios";

export class ProjectService {
  static async getProject(customer: string): Promise<any> {
    return api.get("/projects", {
      params: {
        customer,
        active: true,
      },
    });
  }
}
