import { env } from "@marcahora/env/web";
import axios from "axios";

const api = axios.create({
  baseURL: `${env.NEXT_PUBLIC_SERVER_URL}`,
  withCredentials: true,
});

export default api;
