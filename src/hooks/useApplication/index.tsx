import { useContext } from "react";
import { ApplicationContext } from "../../contexts/ApplicationContext";

const useApplication = () => {
  return {
    ...useContext(ApplicationContext),
  };
};
export default useApplication;
