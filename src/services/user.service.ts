import { api } from "@/lib/axios";

type GetUserOutput = {
  account_creator: false;
  canEditUsername: false;
  company: string;
  contract: string;
  created_at: string;
  first_login: false;
  hash: null;
  isActive: true;
  isAdministrator: false;
  isApprover: false;
  isBusinessPartner: false;
  isCommon: true;
  isFinancialControls: false;
  isProjectLeader: false;
  name: string;
  office365: { id: string /* other properties */ };
  oneSignal: any[]; // You can replace `any` with a more specific type if known
  password: string;
  password_reset: { token: string; expires: string };
  projects: any[]; // You can replace `any` with a more specific type if known
  username: string;
  viewTeam: false;
  __v: 0;
  _id: string;
};

export class UserService {
  static async getUser(username: string) {
    const response = await api.get("/users/", {
      params: {
        username,
        users: true,
      },
    });

    return response.data[0] as GetUserOutput;
  }
}
