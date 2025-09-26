const apikey = import.meta.env.VITE_API_KEY
const baseUrl = import.meta.env.VITE_BASE_URL

export const API_ENDPOINTS = {
  getQuotes: `${baseUrl}news?access_key=${apikey}`,
};