import { AuthForm } from "@/components/account/auth-form";
export const metadata = { title: "E-posta doğrulama" };
export default function Page() {
  return <AuthForm mode="verify" />;
}
