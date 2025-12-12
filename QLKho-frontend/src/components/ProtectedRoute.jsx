import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../services/axiosConfig";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      alert("Vui lòng đăng nhập để tiếp tục.");
      navigate("/");
    }
  }, [navigate]);

  return isAuthenticated() ? children : null;
};

export default ProtectedRoute;


































































































































