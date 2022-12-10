export interface IAppointment {
  user: string;
  toDo: boolean;
  project: string;
  task_description: string;
  track_option: "start_and_end";
  source: "manual";
  start: string;
  stop: string;
  customer: string;
  day: string;
}
