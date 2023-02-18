import { IAppointment } from "@/interfaces/services/appointment.interface";

export class AppointmentModel implements IAppointment {
  customer: string = "";
  day: string = "";
  project: string = "";
  source: "manual" = "manual";
  start: string = "";
  stop: string = "";
  task_description: string = "";
  toDo: boolean = false;
  track_option: "start_and_end" = "start_and_end";
  user: string = "";

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
