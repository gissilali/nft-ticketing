import axios from "axios";

const useAxios = () => {
  axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  axios.defaults.withCredentials = true;
  return {
    axios,
  };
};

export default useAxios;
