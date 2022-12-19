import { useState } from "react";
import { showNotification, updateNotification } from "@mantine/notifications";
import { ProjectService } from "@/services/project.service";
import { IconCheck } from "@tabler/icons";

export const useGetProjects = () => {
  const [projects, setProjects] = useState<
    { name: string; _id: string }[] | never[]
  >([]);

  const getProjects = async (customer: string) => {
    try {
      showNotification({
        id: "loading-projects",
        title: "Loading projects",
        message: "Loading projects information",
        loading: true,
      });

      const getProjectsResponse = await ProjectService.getProject(customer);

      updateNotification({
        id: "loading-projects",
        title: "Projects loaded",
        message: `${getProjectsResponse.data.length} projects loaded`,
        color: "teal",
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });

      return getProjectsResponse.data;
    } catch (e) {
      console.error(e);

      updateNotification({
        id: "loading-projects",
        title: "There's a problem",
        message: "We can't load the projects",
        color: "red",
        autoClose: 3000,
      });

      return [];
    }
  };

  return {
    projects,
    setProjects,
    getProjects,
  };
};
