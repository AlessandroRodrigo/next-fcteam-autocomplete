import { AppointmentService } from "@/services/appointment.service";
import { showNotification } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons";
import dayjs from "dayjs";
import { useMutation } from "react-query";

export function useCreateAppointmentMutation() {
  return useMutation({
    mutationKey: "createAppointment",
    mutationFn: AppointmentService.createAppointment,
    onSettled(data, error, variables) {
      showNotification({
        id: variables.day,
        title: "Creating appointment",
        message: `Creating appointment for date "${dayjs(variables.day).format(
          "DD/MM/YYYY"
        )}"`,
        loading: true,
        disallowClose: true,
        autoClose: false,
      });
    },
    onError(error, variables) {
      console.error(error);

      showNotification({
        id: variables.day,
        title: "There's a problem",
        message: "Something went wrong",
        color: "red",
      });
    },
    onSuccess(data, variables) {
      showNotification({
        id: variables.day,
        title: "Appointment created",
        color: "teal",
        message: `Appointment for date "${dayjs(variables.day).format(
          "DD/MM/YYYY"
        )}" created`,
        icon: <IconCheck size={16} />,
        autoClose: false,
      });
    },
  });
}
