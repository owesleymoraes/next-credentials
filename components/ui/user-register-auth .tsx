"use client";
import { cn } from "@/lib/utils";
import { ChangeEvent, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icons } from "./icons";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}
interface IUser {
  name: string;
  email: string;
  password: string;
}

export function UserRegisterForm({ className, ...props }: UserAuthFormProps) {
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState<IUser>({
    name: "",
    email: "",
    password: "",
  });

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    const request = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(inputValue),
    });

    const response = await request.json();

    console.log("USER REGISTER FORM", response);

    if (!request.ok) {
      toast({
        title: "Ooooops...",
        description: response.error,
        variant: "destructive",
        action: (
          <ToastAction altText="Tente Novamente">Tente Novamente</ToastAction>
        ),
      });
    } else {
    }

    // setTimeout(() => {
    //   setIsLoading(false);
    // }, 5000);

    setInputValue({ name: "", email: "", password: "" });

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
              Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="nome"
              disabled={isLoading}
              name="name"
              value={inputValue.name}
              onChange={(event) => handleChange(event)}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="nome@example.com"
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
            Registrar
          </Button>
        </div>
      </form>
    </div>
  );
}
