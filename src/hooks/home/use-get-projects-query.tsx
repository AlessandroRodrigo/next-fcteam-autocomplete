import { ProjectService } from "@/services/project.service";
import { useQuery } from "react-query";

type Params = {
  customer: string;
};

export const useGetProjectsQuery = ({ customer }: Params) => {
  return useQuery({
    queryKey: ["projects", customer],
    queryFn: () => ProjectService.getProjects(customer),
    enabled: !!customer,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
};
