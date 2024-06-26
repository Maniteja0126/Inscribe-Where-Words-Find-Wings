import React, { useState } from "react";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { cn } from "@/lib/utils";
import { BackgroundBeams } from "@/components/ui/background-beams";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { signupInput } from "@maniteja2601/medium-blog"
import ButtomMessage from "@/components/ButtonMessage";
import { toast, Toaster } from "sonner";
import { BACKEND_URL } from "@/config";



export const  Signup = () => {
  // const BACKEND_URL = import.meta.env.BACKEND_URL
  const navigate = useNavigate();
  const [requiredError, setRequiredError] = useState({
    emailReq: false,
    passReq: false,
  });
  const [signupInputs, setSignupInputs] = useState<signupInput>({
    email: "",
    password: "",
    name: "",
  });
  const sendRequest = async () => {
    if (!signupInputs.email || !signupInputs.password) {
      setRequiredError({
        emailReq: signupInputs.email ? false : true,
        passReq: signupInputs.password ? false : true,
      });
      return;
    }
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/v1/user/signup`,
        signupInputs
      );
      const jwt = res.data
      localStorage.setItem("token", jwt);
      navigate("/blogs");
    } catch (error) {
      console.log(error);
      return toast("Error Signing up", {
        action: {
          label: "Close",
          onClick: () => toast.dismiss(),
        },
      });
    }
  };

  return (
    <div className="h-screen w-full bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      <div className="z-10">
        <div className="max-w-md w-full mx-auto rounded-xl md:rounded-2xl p-4 md:p-8 pb-1 md:pb-1 shadow-input bg-white dark:bg-black">
          <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
            Welcome to Inscribe
          </h2>
          <p className="text-neutral-600 text-sm max-w-sm mt-2 mr-10 dark:text-neutral-300">
            Enter your information to create an account
          </p>

          <form className="my-8">
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
              <LabelInputContainer>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  autoComplete="name"
                  placeholder="Mani Teja"
                  type="text"
                  onChange={(e) => {
                    setSignupInputs((p) => ({
                      ...p,
                      name: e.target.value,
                    }));
                  }}
                />
              </LabelInputContainer>
            </div>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                autoComplete="email"
                placeholder="abc@gmail.com"
                type="email"
                onChange={(e) => {
                  setSignupInputs((p) => ({
                    ...p,
                    email: e.target.value,
                  }));
                  setRequiredError((prevState) => ({
                    ...prevState,
                    emailReq: false,
                  }));
                }}
              />
              {requiredError.emailReq && (
                <span className=" text-red-500 text-sm">Email is required</span>
              )}
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                placeholder="••••••••"
                type="password"
                onChange={(e) => {
                  setSignupInputs((p) => ({
                    ...p,
                    password: e.target.value,
                  }));
                  setRequiredError((prevState) => ({
                    ...prevState,
                    passReq: false,
                  }));
                }}
              />
              {requiredError.passReq && (
                <span className=" text-red-500 text-sm">
                  Password is required
                </span>
              )}
            </LabelInputContainer>

            <button
              onClick={(e) => {
                e.preventDefault();
                sendRequest();
              }}
              className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            >
              Sign up &rarr;
              <BottomGradient />
            </button>

            <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-6 h-[1px] w-full" />
            <ButtomMessage
              label="Already have an account?"
              linktext="SignIn"
              to="/signin"
            />
          </form>
        </div>
      </div>
      <BackgroundBeams />
      <Toaster />
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
