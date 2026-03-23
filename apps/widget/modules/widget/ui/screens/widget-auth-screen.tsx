import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormMessage,
  FormField,
  FormItem,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";

import { WidgetHeader } from "../components/widget-header";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Doc } from "@workspace/backend/_generated/dataModel.js";
import { mutation } from "@workspace/backend/_generated/server";

const formSchema = z.object({
  name: z.string().min(1, "Name must be at least 1 character"),
  email: z.string().email("Please enter a valid email address"),
});

export const WidgetAuthScreen = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const organizationId = "123";

  const createContactSession = useMutation(api.public.contactSessions.create);

  const addUserToDatabase = useMutation(api.users.addUser);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // console.log("Form submitted with data:", data);
    if (!organizationId) {
      return;
    }

    const metadata: Doc<"contactSessions">["metadata"] = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      languages: navigator.languages?.join(","),
      platform: navigator.platform,
      vendor: navigator.vendor,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezoneOffset: new Date().getTimezoneOffset(),
      cookieEnabled: navigator.cookieEnabled,
      referrer: document.referrer || "direct",
      currentUrl: window.location.href,
    };

    const contactSessionId = await createContactSession({
      ...values,
      organizationId,
      metadata,
    });

    const userId = await addUserToDatabase();

    // console.log("Created contact session with ID:", contactSessionId);
    console.log("Added user to database with ID:", userId);
  };
  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold">
          <p className="text-3xl">Hi there!</p>
          <p className="text-lg">Lets &apos get you started!</p>
        </div>
      </WidgetHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 px-2 py-6"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="h-10 bg-background"
                    placeholder="Name"
                    type="text"
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
                <FormControl>
                  <Input placeholder="Email" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <div className="flex justify-end px-2 py-6">
        <Button
          disabled={form.formState.isSubmitting}
          size="lg"
          type="submit"
          onClick={form.handleSubmit(onSubmit)}
        >
          Continue
        </Button>
      </div>
    </>
  );
};
