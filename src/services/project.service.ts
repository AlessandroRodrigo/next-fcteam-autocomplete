import { api } from "@/lib/axios";

type GetProjectsOutput = {
  name: string;
  owner: { _id: string; name: string };
  predefined_tasks: false;
  public: false;
  tags: any[]; // You can replace `any` with a more specific type if known
  taskTemplates: any[]; // You can replace `any` with a more specific type if known
  tasks: any[]; // You can replace `any` with a more specific type if known
  teamsTemplates: any[]; // You can replace `any` with a more specific type if known
  updated_at: string;
  updated_by: string;
  x3Id: string;
  __v: 523;
  _id: string;
  active: true;
  assistantManagers: any[]; // You can replace `any` with a more specific type if known
  billable: false;
  company: string;
  created_at: string;
  created_by: string;
  customer: {
    _id: string;
    company: string;
    name: string;
    active: true /* other properties */;
  };
  emptyTask: true;
  members: {
    _id: {
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
      projects: any[]; // You can replace `any` with a more specific type if known
      username: string;
      viewTeam: false;
      __v: 0;
      _id: string;
    };
  }[];
}[];

export class ProjectService {
  static async getProjects(customer: string) {
    const response = await api.get("/projects", {
      params: {
        customer,
        active: true,
      },
    });

    return response.data as GetProjectsOutput;
  }
}
