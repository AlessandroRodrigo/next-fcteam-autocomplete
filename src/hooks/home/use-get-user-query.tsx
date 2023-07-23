import { UserService } from "@/services/user.service";
import { useQuery } from "react-query";

type Params = {
  username: string;
};

export const useGetUserQuery = ({ username }: Params) => {
  return useQuery({
    queryKey: ["user", username],
    queryFn: () => UserService.getUser(username),
    enabled: !!username,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
};
