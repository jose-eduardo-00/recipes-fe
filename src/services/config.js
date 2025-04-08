import axios from "axios";

export const http = axios.create({
  baseURL: "http://localhost:3000",
  // baseURL: "",
});

export const baseUrl = "http://localhost:3000";
// export const baseUrl = "";
