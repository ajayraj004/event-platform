import axios from "axios";

const api = axios.create({
  baseURL: "http://3.93.196.191:5050/api",
});

export default api;
