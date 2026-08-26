import { redirect } from "next/navigation";
import { getAdminSessionFromCookies } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminAppLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSessionFromCookies();
  if (!session) redirect("/admin/login");
  return <AdminShell username={session.username}>{children}</AdminShell>;
}
