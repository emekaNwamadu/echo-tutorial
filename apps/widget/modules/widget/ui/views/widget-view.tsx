"use client";

// import { WidgetFooter } from "../components/widget-footer";
// import { WidgetHeader } from "../components/widget-header";

import { WidgetAuthScreen } from "../screens/widget-auth-screen";
interface Props {
  organizationId: string;
}
export const WidgetView = ({ organizationId }: Props) => {
  return (
    //TODO: confirm min-h-screen min-w-screen is needed here, or if we can just use h-full w-full
    <main className="min-h-screen min-w-screen flex h-full w-full flex-col overflow-hidden rounded-xl border bg-muted">
      <WidgetAuthScreen />
      {/* <WidgetFooter /> */}
    </main>
  );
};
