import { IAppointment } from "@/interfaces/services/appointment.interface";
import { api } from "@/lib/axios";

export class AppointmentService {
  static async createAppointment(
    appointment: IAppointment,
    token: string
  ): Promise<any> {
    return api.post(
      "/appointments",
      {
        appointment,
        appointmentType: "single",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
}
