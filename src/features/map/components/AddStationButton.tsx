import { Plus } from 'lucide-react';

interface AddStationButtonProps {
  onClick: () => void;
}

export function AddStationButton({ onClick }: AddStationButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 left-6 z-50 flex items-center gap-2 bg-[#FFC300] text-forest-dark px-4 py-3 rounded-full shadow-lg hover:bg-[#e6b000] transition-all hover:scale-105 active:scale-95"
      title="Tambah Stasiun Charging"
    >
      <Plus className="w-5 h-5" />
      <span className="font-semibold text-sm hidden sm:inline">Tambah Stasiun</span>
    </button>
  );
}
