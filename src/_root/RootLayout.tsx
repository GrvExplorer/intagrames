import { useToast } from "@/components/ui/use-toast";
import { sidebarLinks } from "@/constants";
import { useUserContext } from "@/context/AuthContext";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { INavLink } from "@/types";
import { Loader } from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

function RootLayout() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, setIsAuthenticated } = useUserContext();

  const { mutateAsync: signOut, isLoading: isSigningOut } = useSignOutAccount();

  const location = useLocation();

  const handelSignOut = async () => {
    try {
      const response = await signOut();
      if (response) {
        setIsAuthenticated(false);
        console.log("isSigningOut", await signOut());
        navigate("/sign-in");
        return toast({
          title: "Logout Successful",
          description: "You have been logged out successfully.",
        });
      }
      toast({
        title: "Logout Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div className="grid grid-cols-3 gap-10 ">
      <div className="hidden w-80 flex-col justify-between bg-dark-3  pb-4 pl-8 pt-10 md:flex fixed h-screen left-0 top-0">
        <div className="mr-8 flex flex-col gap-20">
          <Link to="/" className="w-80">
            <img src="/assets/images/logo.svg" alt="logo" />
          </Link>

          <div className="flex h-1 items-center gap-4">
            <Link to={`/profile/${user?.id}`}>
              <div className="w-16">
                <img
                  className="rounded-full object-cover"
                  src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
                  alt="profile picture"
                />
              </div>
            </Link>

            <div className=" w-full">
              <p className="text-lg font-bold">{user?.name}</p>
              <p className="text-sm text-gray-600">@{user?.username} </p>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            {sidebarLinks.map((link: INavLink) => {
              const isActiveRoute = location.pathname === link.route;
              return (
                <>
                  <Link to={link.route} key={link.label}>
                    <div
                      className={` group flex w-full cursor-pointer gap-4 rounded-md p-4 py-4 ${isActiveRoute && "bg-primary-600"} hover:bg-primary-600`}
                    >
                      <img
                        className={`group-hover:invert-white ${isActiveRoute && "invert-white"}`}
                        src={link.imgURL}
                        alt=""
                      />
                      <p className="font-semibold">{link.label} </p>
                    </div>
                  </Link>
                </>
              );
            })}
          </div>
        </div>

        <div className="mr-8">
          <div
            className="group flex w-full cursor-pointer gap-4 rounded-md p-4 py-4 hover:bg-primary-600"
            onClick={handelSignOut}
          >
            <img
              src="/assets/icons/logout.svg"
              className="group-hover:invert-white"
              alt=""
            />
            <p className="font-semibold">
              {isSigningOut ? (
                <Loader className="m-auto animate-spin" />
              ) : (
                "Logout"
              )}
            </p>
          </div>
        </div>
      </div>
      <div className=""></div>
      <div className="mt-10 mb-8 w-full col-start-2 col-end-4">
        <Outlet />
      </div>
    </div>
  );
}

export default RootLayout;
