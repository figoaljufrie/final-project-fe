import { Metadata } from "next";
import DashboardLayout from "@/components/ui/DashboardLayout";

export const metadata: Metadata = {
  title: "Tenant Dashboard | Nginepin",
  description: "Manage your properties and bookings.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}