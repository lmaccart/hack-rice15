interface OverlayWrapperProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export default function OverlayWrapper({ title, onClose, children }: OverlayWrapperProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-3 py-3 sm:px-6 sm:py-4 flex items-center justify-between z-10">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-800 pr-2">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl sm:text-4xl font-light leading-none min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="p-3 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
