import { AuthForm } from "@/components/account/auth-form";
export const metadata = { title: "Parolamı yenile" };
export default function Page() {
  return <AuthForm mode="reset" />;
}
