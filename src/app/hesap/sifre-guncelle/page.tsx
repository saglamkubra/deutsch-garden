import { AuthForm } from "@/components/account/auth-form";
export const metadata = { title: "Yeni parola" };
export default function Page() {
  return <AuthForm mode="update" />;
}
