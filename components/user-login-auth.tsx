"use client";
import { cn } from "@/lib/utils";
import { Icons } from "./icons";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}
interface IUser {
  email: string;
  password: string;
}

export function UserLoginForm({ className, ...props }: UserAuthFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState<IUser>({
    email: "",
    password: "",
  });

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    const res = await signIn<"credentials">("credentials", {
      ...inputValue,
      redirect: false,
    });

    if (!res?.ok) {
      toast({
        title: "Ooops...",
        description: res?.error,
        variant: "destructive",
        action: (
          <ToastAction altText="Tente Novamente">Tente Novamente</ToastAction>
        ),
      });
    } else {
      router.push("/");
    }

    // setTimeout(() => {
    //   setIsLoading(false);
    // }, 5000);

    setInputValue({ email: "", password: "" });

    setIsLoading(false);
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue((prev) => {
      return {
        ...prev,
        [event.target.name]: event.target.value,
      };
    });
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="name@exaple.com"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              name="email"
              value={inputValue.email}
              onChange={(event) => handleChange(event)}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="senha"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isLoading}
              name="password"
              value={inputValue.password}
              onChange={(event) => handleChange(event)}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Entrar
          </Button>
        </div>
      </form>
    </div>
  );
}
