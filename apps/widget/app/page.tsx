"use client";
import { Button } from "@workspace/ui/components/button";
import { add } from "@workspace/math/add";
import { Input } from "@workspace/ui/components/input";
import { useMutation, useQuery } from "convex/react";
// import { api } from "../../../packages/backend/convex/_generated/api";
// import { api } from "@workspace/backend/convex/_generated/api";
// import { api } from "@workspace/backend/convex/_generated/api";
import { api } from "@workspace/backend/_generated/api";

export default function Page() {
  const users = useQuery(api.users.getMany);
  const addUser = useMutation(api.users.add);

  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello widget/app </h1>
        <Button
          onClick={() => {
            addUser();
          }}
          size="sm"
        >
          Button{" "}
        </Button>
        <p>
          {add(2, 5)} {JSON.stringify(users)}
        </p>
        <Input />
      </div>
    </div>
  );
}
