import { useState } from "react";
import { showNotification, updateNotification } from "@mantine/notifications";
import { CustomerService } from "@/services/customer.service";
import { IconCheck } from "@tabler/icons";

export const useGetCustomers = () => {
  const [customers, setCustomers] = useState<
    { name: string; company: string }[]
  >([]);

  const getCustomers = async (company: string) => {
    try {
      showNotification({
        id: "loading-customers",
        title: "Loading customers",
        message: "Loading customers information",
        loading: true,
      });

      const getCustomersResponse = await CustomerService.getCustomer(company);

      setCustomers(getCustomersResponse.data);

      updateNotification({
        id: "loading-customers",
        title: "Customers loaded",
        message: `${getCustomersResponse.data.length} customers loaded`,
        color: "teal",
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });

      return getCustomersResponse.data;
    } catch (e) {
      console.error(e);

      updateNotification({
        id: "loading-customers",
        title: "There's a problem",
        message: "We can't load the customers",
        color: "red",
        autoClose: 3000,
      });

      return [];
    }
  };

  return {
    customers,
    getCustomers,
  };
};
