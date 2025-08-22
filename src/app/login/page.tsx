"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
import { useAuth } from "@/hooks/useAuth";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmitLogin = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      const { user, access } = response.data;
      if (!user || !access) {
        toast.error("Unexpected response from server");
        return;
      }

      login(user, access);
      toast.success("Logged in successfully");
      router.push("/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="flex w-full overflow-hidden shadow-xl md:max-w-5xl">
        {/* left */}
        <div className="flex w-full flex-col items-start justify-between bg-gray-50 p-12 md:w-1/2">
          <h2 className="text-xl">Welcome back!</h2>
          <h1 className="text-4xl font-bold uppercase">Elowen</h1>
          <div className="flex items-center gap-2 text-sm">
            <p>New here?</p>
            <Link
              href="/register"
              className="relative inline-block font-bold after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
            >
              Create an account
            </Link>
          </div>
        </div>

        {/* right */}
        <div className="flex w-1/2 flex-col p-12">
          <CardHeader className="p-0">
            <CardTitle className="text-3xl">Login with your e-mail</CardTitle>
          </CardHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmitLogin)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="mt-8">
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
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

              <Button className="btn-sweep-effect w-full rounded-none border border-black bg-black p-8 uppercase text-white before:bg-white hover:text-black">
                <span>{isLoading ? "Logging in..." : "Login"}</span>
              </Button>
            </form>
          </Form>

          <div className="px-20 py-4">
            <Separator className="bg-gray-500" />
          </div>

          <div>
            <p className="text-center text-sm text-gray-500">Or login with</p>
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

export default LoginPage;
