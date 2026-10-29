import { AuthForm } from "@/components/account/auth-form";
export const metadata = { title: "Giriş yap" };
export default function Page() {
  return <AuthForm mode="login" />;
}
