"use client";

import { LoaderIcon } from "lucide-react";
import {
  contactSessionIdAtomFamily,
  errorMessageAtom,
  loadingMessageAtom,
  organizationIdAtom,
  screenAtom,
} from "../../atoms/widget-atoms";
import { useAtomValue, useSetAtom } from "jotai";
import { WidgetHeader } from "../components/widget-header";
import { use, useEffect, useState } from "react";
import { api } from "@workspace/backend/_generated/api";
import { useAction, useMutation } from "convex/react";
import { set } from "zod/v4-mini";
import { Id } from "@workspace/backend/_generated/dataModel";
type InitStep = "org" | "session" | "settings" | "vapi" | "done";

export const WidgetLoadingScreen = ({
  organizationId,
}: {
  organizationId: string | null;
}) => {
  const [step, setStep] = useState<InitStep>("org");
  const [SessionValid, setSessionValid] = useState(false);

  const loadingMessage = useAtomValue(loadingMessageAtom);
  const setOrganizationId = useSetAtom(organizationIdAtom);
  const setLoadingMessage = useSetAtom(loadingMessageAtom);
  const setErrorMessage = useSetAtom(errorMessageAtom);
  const setScreen = useSetAtom(screenAtom);

  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || "")
  );

  // Step 1: Validate organization ID
  const validateOrganization = useAction(api.public.organizations.validate);

  useEffect(() => {
    if (step !== "org") {
      return;
    }
    setLoadingMessage("Finding organizationId...");

    if (!organizationId) {
      setErrorMessage("Organization ID is required");
      setScreen("error");
      return;
    }

    setLoadingMessage("Validating organizationId...");
    validateOrganization({ organizationId })
      .then((result) => {
        if (result.valid) {
          setOrganizationId(organizationId);
          setStep("session");
        } else {
          setErrorMessage(result.reason || "Invalid configuration");
          setScreen("error");
        }
      })
      .catch((err) => {
        setErrorMessage(
          err.message ||
            "An error occurred while validating the organization ID"
        );
        setScreen("error");
      });
  }, [
    step,
    organizationId,
    setErrorMessage,
    setScreen,
    setOrganizationId,
    setStep,
    validateOrganization,
    setLoadingMessage,
  ]);

  // Step 2: Validate contact session (if organization ID is valid)
  const validateContactSession = useMutation(
    api.public.contactSessions.validate
  );
  useEffect(() => {
    if (step !== "session") {
      return;
    }

    setLoadingMessage("Finding contact Session Id...");

    if (!contactSessionId) {
      setSessionValid(false);
      setStep("done");
      return;
    }

    setLoadingMessage("Validating session...");

    validateContactSession({
      contactSessionId: contactSessionId as Id<"contactSessions">,
    })
      .then((result) => {
        setSessionValid(result.valid);
        setStep("done");
      })
      .catch((err) => {
        setSessionValid(false);
        setStep("done");
      });
  }, [step, contactSessionId, validateContactSession, setLoadingMessage]);

  useEffect(() => {
    if (step !== "done") {
      return;
    }
    const hasValidSession = contactSessionId && SessionValid;
    setScreen(hasValidSession ? "selection" : "auth");
  }, [step, contactSessionId, SessionValid, setScreen]);

  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold">
          <p className="text-3xl">Hi there!</p>
          <p className="text-lg">Lets &apos get you started!</p>
        </div>
      </WidgetHeader>
      <div className="flex flex-col items-center justify-center gap-y-4 px-2 py-6">
        <LoaderIcon className="animate-spin" />
        <p className="text-lg text-center">{loadingMessage || "Loading..."}</p>
      </div>
    </>
  );
};
