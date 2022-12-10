import axios from "axios";

export const api = axios.create({
  baseURL: "https://fcteam-api.fcamara.com.br/v1",
});
