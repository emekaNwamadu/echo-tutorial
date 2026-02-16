"use client";
import { Button } from "@workspace/ui/components/button";
import { add } from "@workspace/math/add";
import { Input } from "@workspace/ui/components/input";
import { useQuery, Authenticated, Unauthenticated } from "convex/react";
// import { api } from "../../../packages/backend/convex/_generated/api";
// import { api } from "@workspace/backend/convex/_generated/api";
// import { api } from "@workspace/backend/convex/_generated/api";
import { api } from "@workspace/backend/_generated/api";
import { SignIn, SignInButton, SignUp, UserButton } from "@clerk/nextjs";

export default function Page() {
  const users = useQuery(api.users.getMany);
  return (
    <>
      <Authenticated>
        <div className="flex items-center justify-center min-h-svh">
          <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold">Hello web/app </h1>
            <Button size="sm">Button </Button>
            <UserButton></UserButton>
            <p>
              {add(2, 5)} {JSON.stringify(users)}
              <SignInButton>Sign in</SignInButton>
            </p>
            <Input />
          </div>
        </div>
      </Authenticated>
      <Unauthenticated>
        <p>Must be signed in !</p>
        <SignInButton>Sign in</SignInButton>
      </Unauthenticated>
    </>
  );
}
