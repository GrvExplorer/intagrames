import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import { SignInValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

function SignInForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isCheckUserLoading } = useUserContext();
  const { mutateAsync: signInAccount, isLoading: isSigningInUser } =
    useSignInAccount();

  const form = useForm<z.infer<typeof SignInValidation>>({
    resolver: zodResolver(SignInValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof SignInValidation>) => {
    try {
      const session = await signInAccount({
        email: values.email,
        password: values.password,
      });
      console.log(session);

      if (!session) {
        toast({
          title: "Error while signing in.",
          description: "Check Your Email and Password.",
          variant: "destructive",
          action: (
            <ToastAction
              altText="Try again"
              onClick={() =>
                signInAccount({
                  email: values.email,
                  password: values.password,
                })
              }
            >
              Try Again
            </ToastAction>
          ),
        });
        throw new Error("No able to sign in");
      }

      const isLoggedIn = await checkAuthUser();

      if (isLoggedIn) {
        form.reset();
        navigate("/");
        return toast({
          title: "Account signed in successfully.",
          description: "You can use the app now.",
        });
      } else {
        return toast({
          title: "Error while signing in.",
          variant: "destructive",
          action: (
            <ToastAction
              altText="Try again"
              onClick={() =>
                signInAccount({
                  email: values.email,
                  password: values.password,
                })
              }
            >
              Try Again
            </ToastAction>
          ),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <div className="flex-center flex-col gap-8">
        <div className="sm:w-42 flex flex-col text-center">
          <div className="flex w-96 justify-center">
            <img
              src="/assets/images/logo.svg"
              className="object-contain"
              alt="logo"
            />
          </div>
          <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
            Log in to your account
          </h2>
          <p className="small-medium md:base-regular mt-2 text-light-3">
            Welcome back! enter your details{" "}
          </p>
        </div>

        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl className="text-md w-80 border-none bg-[#1c1c1c] text-white ">
                  <Input
                    {...field}
                    type="email"
                    placeholder="Enter your email"
                  />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl className="text-md w-80 border-none bg-[#1c1c1c] text-white">
                  <Input
                    {...field}
                    type="password"
                    autoComplete="off"
                    placeholder="Enter your password"
                  />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="mt-10 bg-purple-300">
            {isSigningInUser || isCheckUserLoading ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Sign In"
            )}
          </Button>
          <p className="text-center">
            Don't have an account?{" "}
            <a
              href="/sign-up"
              className="tracking-wide text-blue-700 hover:underline"
            >
              Sign Up
            </a>{" "}
          </p>
        </form>
      </div>
    </Form>
  );
}

export default SignInForm;
