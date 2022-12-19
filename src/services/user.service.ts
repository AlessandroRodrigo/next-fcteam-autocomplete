import { api } from "@/lib/axios";

export class UserService {
  static async getUser(username: string): Promise<any> {
    return api.get("/users/", {
      params: {
        username,
        users: true,
      },
    });
  }
}
