import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import {
  useCreateUserAccount,
  useSignInAccount,
} from "@/lib/react-query/queriesAndMutations";
import { SignupValidation } from "@/lib/validation";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";

function SignUpForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isCheckUserLoading } = useUserContext();

  const { mutateAsync: createUserAccount, isLoading: isCreatingNewUser } =
    useCreateUserAccount();
  const { mutateAsync: signInAccount, isLoading: isSigningInUser } =
    useSignInAccount();

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    //random
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    try {
      const newUser = await createUserAccount(values);

      if (!newUser) {
        toast({
          title: "Error while saving to db.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Account created successfully.",
        description: "We've created your account for you.",
      });

      const session = await signInAccount({
        email: values.email,
        password: values.password,
      });

      if (!session) {
        toast({
          title: "Error while signing in.",
          description: "We've created your account for you.",
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
            >Try Again</ToastAction>
          ),
        });
        navigate("/sign-in");
        return;
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
          title: 'Error while signing in.',
          description: "We've created your account for you can sign in now.",
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
            >Try Again</ToastAction>
          )
        })
      }
      



    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <div className="flex-center flex-col gap-8">
        <div className="sm:w-42 flex flex-col text-center">
          <div
            className=" flex w-420 justify-center
"
          >
            <img
              className="object-contain"
              src="/assets/images/logo.svg"
              alt="logo"
            />
          </div>

          <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
            Create a new account now
          </h2>
          <p className="small-medium md:base-regular mt-2 text-light-3">
            To use Snapgram enter your account{" "}
          </p>
        </div>

        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Name</FormLabel>
                <FormControl className="text-md w-96 border-none bg-[#1c1c1c] text-white outline-none focus:border-transparent">
                  <Input
                    className="focus:border-none focus:outline-none"
                    placeholder="Enter your name"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Username</FormLabel>
                <FormControl className="text-md w-96 border-none bg-[#1c1c1c] text-white outline-none focus:border-transparent">
                  <Input
                    className="focus:border-none focus:outline-none"
                    placeholder="Username"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is your public display name
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Email</FormLabel>
                <FormControl className="text-md w-96 border-none bg-[#1c1c1c] text-white outline-none focus:border-transparent">
                  <Input
                    className="focus:border-none focus:outline-none"
                    placeholder="Email"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Password</FormLabel>
                <FormControl className="text-md w-96 border-none bg-[#1c1c1c] text-white outline-none focus:border-transparent">
                  <Input
                    className="focus:border-none focus:outline-none"
                    autoComplete="off"
                    placeholder="Password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <Button className="mt-8 bg-purple-300 font-semibold" type="submit">
            {isCreatingNewUser || isSigningInUser || isCheckUserLoading ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Sign up"
            )}
          </Button>
          <p className="text-center">
            Already have an account?{" "}
            <a
              href="/sign-in"
              className="tracking-wide text-blue-700 hover:underline"
            >
              Sign In
            </a>{" "}
          </p>
        </form>
      </div>
    </Form>
  );
}

export default SignUpForm;
