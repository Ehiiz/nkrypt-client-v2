import Modal from "../../_components/mainModal";
export default function Loader() {
  return (
    <Modal>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-white bg-opacity-40">
        <div className="relative w-full flex flex-col items-center justify-center max-w-lg p-4">
          <p className="font-aeonik">Nkrypt</p>
        </div>
      </div>
    </Modal>
  );
}
