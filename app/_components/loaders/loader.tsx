import Image from "next/image";

import desktoplogo from "@/public/icons/opto learning logo desktop.svg";
import Modal from "../mainModal";

export default function Loader() {
  return (
    <Modal>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-white bg-opacity-40">
        <div className="relative w-full flex flex-col items-center justify-center max-w-lg p-4">
          <Image
            src={desktoplogo}
            alt="Menu Icon"
            className="cursor-pointer animate-pulse w-[200px] h-[200px]"
          />
        </div>
      </div>
    </Modal>
  );
}
