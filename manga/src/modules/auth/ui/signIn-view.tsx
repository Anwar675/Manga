"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { LoginFormValue, loginSchema, RegisterFormValues, registerSchema } from "../registerSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { SignInForm } from "@/components/ui/sign-in";



export const SignInView = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient()
  const router = useRouter();
  const form = useForm<LoginFormValue>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
 
  const login = useMutation(
      trpc.auth.login.mutationOptions({
        onError: (error) => {
          form.setError("root", {
          message: error.message || "Email hoặc mật khẩu không đúng",
      });
         
        },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.auth.session.queryFilter())
        router.push("/");
      },
    })
  );
   const onSubmit = (values: LoginFormValue) => {
    login.mutate(values);
  };
  

  return (
    <div className=" flex bg-[#4c4c4c] min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <SignInForm form={form} onSubmit={onSubmit}  />
      </div>
    </div>
  );
};
