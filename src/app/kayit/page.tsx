import { AuthForm } from "@/components/account/auth-form";
export const metadata = { title: "Hesap oluştur" };
export default function Page() {
  return <AuthForm mode="register" />;
}
