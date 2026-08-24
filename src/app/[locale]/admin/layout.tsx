import { setRequestLocale } from 'next-intl/server';
import AdminShell from '@/components/admin/AdminShell';

export default async function AdminLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  setRequestLocale(locale);
  return <AdminShell>{children}</AdminShell>;
}
