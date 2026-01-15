"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {toast} from "sonner"
import { RegisterFormValues, registerSchema } from "../registerSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { SignUpForm } from "@/components/login-form";

export const SignUpView = () => {
  const trpc = useTRPC()
  const router = useRouter()
  const queryClient = useQueryClient()
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", username: "" },
  });
  
  const register = useMutation(trpc.auth.register.mutationOptions({
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.auth.session.queryFilter())
      router.push("/")
    }
  }))
  const onSubmit = (values: RegisterFormValues)  => {
    register.mutate(values)
  }
  return (
    <div className=" flex bg-[#4c4c4c] min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <SignUpForm form={form} onSubmit={onSubmit} isLoading={register.isPending}  />
      </div>
    </div>
  );
};
