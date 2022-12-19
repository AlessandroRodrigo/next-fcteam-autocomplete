import { useState } from "react";
import { showNotification, updateNotification } from "@mantine/notifications";
import { decode } from "jsonwebtoken";
import { UserService } from "@/services/user.service";
import { IconCheck } from "@tabler/icons";

export const useGetUser = () => {
  const [user, setUser] = useState<{
    company: string;
    name: string;
    _id: string;
  } | null>(null);

  const getUserInfo = async (value: string) => {
    try {
      showNotification({
        id: "loading-user",
        title: "Identifying user",
        message: "Loading user information",
        loading: true,
      });

      const decodedToken = decode(value);

      if (typeof decodedToken !== "string") {
        const username = String(decodedToken?.unique_name).toLowerCase();

        const getUserResponse = await UserService.getUser(username);

        setUser(getUserResponse.data[0]);

        updateNotification({
          id: "loading-user",
          title: "User identified",
          message: `User: ${getUserResponse.data[0].name} identified`,
          color: "teal",
          icon: <IconCheck size={16} />,
          autoClose: 3000,
        });

        return getUserResponse.data[0];
      }
    } catch (e) {
      console.error(e);

      updateNotification({
        id: "loading-user",
        title: "There's a problem",
        message: "We can't identify the user of this token",
        color: "red",
        autoClose: 3000,
      });

      setUser(null);
      return null;
    }
  };

  return {
    user,
    getUserInfo,
  };
};
