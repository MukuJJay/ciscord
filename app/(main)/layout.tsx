import NavigationBar from "@/components/navigation/navigation-bar";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full">
      <nav className="w-[75px] h-full fixed inset-0 z-30 md:hidden">
        <NavigationBar />
      </nav>
      <main className="h-full w-full pl-[75px] md:p-0">{children}</main>
    </div>
  );
};

export default MainLayout;
