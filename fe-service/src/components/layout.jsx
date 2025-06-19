import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar";

export default function AppsLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <div className="w-64 flex-shrink-0 border-r bg-gray-50/40">
        <SidebarProvider>
          <AppSidebar />
        </SidebarProvider>
      </div>
      <main className="flex-1 overflow-auto px-4 py-8">{children}</main>
    </div>
  );
}
