"use client";

import { useAtomValue } from "jotai";
import { AlertTriangle } from "lucide-react";
import { errorMessageAtom } from "../../atoms/widget-atoms";
import { WidgetHeader } from "../components/widget-header";

export const WidgetErrorScreen = () => {
  const errorMessage = useAtomValue(errorMessageAtom);

  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold">
          <p className="text-3xl">Hi there!</p>
          <p className="text-lg">Lets &apos get you started!</p>
        </div>
      </WidgetHeader>
      <div className="flex flex-col items-center justify-center gap-y-4 px-2 py-6">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
        <p className="text-lg text-center">
          {errorMessage || "Invalid configuration"}
        </p>
      </div>
    </>
  );
};
