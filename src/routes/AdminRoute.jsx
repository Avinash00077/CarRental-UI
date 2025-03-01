import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = ({ isAdminLogin }) => {
  console.log("Inside the admin Route");

  return isAdminLogin ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;