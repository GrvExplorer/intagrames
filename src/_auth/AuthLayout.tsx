import { useUserContext } from "@/context/AuthContext";
import { Loader } from "lucide-react";
import { Navigate, Outlet } from "react-router-dom";

function AuthLayout() {
  const { isAuthenticated, isLoading: isCheckUserLoading } = useUserContext();
  return (
    <div>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <>
          {isCheckUserLoading ? (
            <div className="flex items-center">
              <Loader className="m-auto animate-spin" />
            </div>
          ) : (
            <div className="flex h-screen justify-between">
              <section className="flex flex-1 flex-col items-center justify-center py-10">
                <Outlet />
              </section>
              <img
                className="hidden w-1/2 bg-no-repeat object-cover xl:block"
                src="/assets/images/side-img.svg"
                alt="side img"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AuthLayout;
