
import { HarpLogoDark } from "@/lib/logo";

export function SidebarV2() {
  return (
    <aside className="fixed left-0 top-0 flex h-screen w-[265px] shrink-0 flex-col bg-primary p-[40px]">
      <HarpLogoDark className="h-[27px] w-[71px]" />
    </aside>
  );
}