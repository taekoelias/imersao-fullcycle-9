import axios from "axios";

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STORE_API_URL
})