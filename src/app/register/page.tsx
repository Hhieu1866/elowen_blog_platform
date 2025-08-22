"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAuth, type AuthUser } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      const response = await api.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      // auto-login after register
      const { user, access } = response.data as {
        user: AuthUser;
        access?: string;
      };
      if (access && user) login(user, access);
      toast.success("Registration successful!");
      router.push("/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <Card className="flex w-full flex-col overflow-hidden shadow-xl md:max-w-5xl md:flex-row">
        {/* left */}
        <div className="flex w-full flex-col items-start justify-between gap-10 bg-zinc-100 p-6 md:w-1/2 md:gap-0 md:p-12">
          <h2 className="text-xl">Welcome!</h2>
          <h1 className="text-4xl font-bold uppercase">Elowen</h1>
          <div className="flex items-center gap-2 text-sm">
            <p>Are you a member?</p>
            <Link
              href="/login"
              className="relative inline-block font-bold after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
            >
              Log in now
            </Link>
          </div>
        </div>

        {/* right */}
        <div className="flex w-full flex-col p-6 md:w-1/2 md:p-12">
          <CardHeader className="p-0">
            <CardTitle className="text-xl md:text-3xl">
              Register with your e-mail
            </CardTitle>
          </CardHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="mt-8">
                    <FormLabel className="uppercase text-gray-400">
                      Username (*)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your name"
                        className="rounded-none border-b border-l-0 border-r-0 border-t-0 border-gray-200 py-5 transition-colors duration-300 ease-in-out placeholder:text-gray-300 focus:border-black focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-gray-400">
                      Email (*)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="E-mail"
                        className="rounded-none border-b border-l-0 border-r-0 border-t-0 border-gray-200 py-5 transition-colors duration-300 ease-in-out placeholder:text-gray-300 focus:border-black focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="uppercase text-gray-400">
                        Password (*)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Password"
                          className="rounded-none border-b border-l-0 border-r-0 border-t-0 border-gray-200 py-5 transition-colors duration-300 ease-in-out placeholder:text-gray-300 focus:border-black focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="uppercase text-gray-400">
                        Repeat Password (*)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          className="rounded-none border-b border-l-0 border-r-0 border-t-0 border-gray-200 py-5 transition-colors duration-300 ease-in-out placeholder:text-gray-300 focus:border-black focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                          placeholder="Repeat Password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* <FormField
                control={form.control}
                name="acceptTerms"
                render={({ field }) => (
                  <FormItem className="flex items-start space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm leading-none">
                      I have read and accept the Terms and Conditions
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <Button className="btn-sweep-effect w-full rounded-none border border-black bg-black p-8 uppercase text-white before:bg-white hover:text-black">
                <span>{isLoading ? "Registering..." : "Create Account"}</span>
              </Button>
            </form>
          </Form>

          <div className="px-20 py-4">
            <Separator className="bg-gray-500" />
          </div>

          <div className="">
            <p className="text-center text-sm text-gray-500">
              Or register with
            </p>
            <div className="mt-3 flex flex-col gap-3">
              <div className="flex w-full gap-3">
                <Button variant="outline" className="flex-1">
                  Twitter
                </Button>
                <Button variant="outline" className="flex-1">
                  Facebook
                </Button>
              </div>
              <Button variant="outline" className="w-full">
                Google
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;
