import { CustomerService } from "@/services/customer.service";
import { useQuery } from "react-query";

type Params = {
  company: string;
};

export const useGetCustomersQuery = ({ company }: Params) => {
  return useQuery({
    queryKey: ["customers", company],
    queryFn: () => CustomerService.getCustomers(company),
    enabled: !!company,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
};
