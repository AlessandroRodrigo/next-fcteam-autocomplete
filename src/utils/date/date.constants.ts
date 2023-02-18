import { Holiday } from "@/interfaces/utils/date/date-constants.interface";

export const holidays: Holiday[] = [
  { date: "2023-01-01", name: "Confraternização mundial", type: "national" },
  { date: "2023-02-21", name: "Carnaval", type: "national" },
  { date: "2023-04-07", name: "Sexta-feira Santa", type: "national" },
  { date: "2023-04-09", name: "Páscoa", type: "national" },
  { date: "2023-04-21", name: "Tiradentes", type: "national" },
  { date: "2023-05-01", name: "Dia do trabalho", type: "national" },
  { date: "2023-06-08", name: "Corpus Christi", type: "national" },
  { date: "2023-09-07", name: "Independência do Brasil", type: "national" },
  { date: "2023-10-12", name: "Nossa Senhora Aparecida", type: "national" },
  { date: "2023-11-02", name: "Finados", type: "national" },
  { date: "2023-11-15", name: "Proclamação da República", type: "national" },
  { date: "2023-12-25", name: "Natal", type: "national" },
  {
    date: "2023-01-25",
    name: "Aniversário de São Paulo",
    type: "state",
  },
  {
    date: "2023-07-09",
    name: "Revolução Constitucionalista de 1932",
    type: "state",
  },
  {
    date: "2023-11-20",
    name: "Consciência Negra",
    type: "state",
  },
];
