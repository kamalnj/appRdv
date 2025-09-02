import { CircleX } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  buttonText: string;
  onContinue?: () => void;
}

export default function DeleteModal({
  isOpen,
  onClose,
  buttonText,
  onContinue,
}: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-white dark:bg-gray-800 p-6 shadow-xl border dark:border-gray-700 text-center">
        <div className="flex justify-center mb-4">
          <CircleX className="h-12 w-12 text-red-500" />
        </div>

        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Vous êtes sûr</h2>

        <button
          onClick={() => {
            onClose();
            if (onContinue) onContinue();
          }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition duration-200"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
