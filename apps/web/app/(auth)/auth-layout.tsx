import { AuthLayout } from "@/modules/auth/ui/layouts/auth-layout";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return <AuthLayout>{children}</AuthLayout>;
};

export default Layout;
