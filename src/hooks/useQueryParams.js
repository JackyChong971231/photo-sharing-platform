import { useLocation } from "react-router-dom";

const useQueryParams = () => {
  const { search } = useLocation(); // Get the query string from the URL
  return new URLSearchParams(search); // Parse the query string into an object
};

export default useQueryParams;