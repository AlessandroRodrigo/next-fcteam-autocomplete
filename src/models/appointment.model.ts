import { IAppointment } from "@/interfaces/services/appointment.interface";

export class AppointmentModel implements IAppointment {
  customer = "";
  day = "";
  project = "";
  source: "manual" = "manual";
  start = "";
  stop = "";
  task_description = "";
  toDo = false;
  track_option: "start_and_end" = "start_and_end";
  user = "";

  constructor(appointment: IAppointment) {
    Object.assign(this, appointment);
  }

  static factory(
    appointment: Omit<IAppointment, "source" | "toDo" | "track_option">
  ): AppointmentModel {
    return new AppointmentModel({
      source: "manual",
      toDo: false,
      track_option: "start_and_end",
      ...appointment,
    });
  }
}
