import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

interface HowToUseDialogProps {
  trigger: React.ReactNode;
}

export function HowToUseDialog({ trigger }: HowToUseDialogProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999]
                     bg-forest-dark border border-white/10 rounded-2xl
                     w-[calc(100%-2rem)] max-w-md max-h-[90vh] overflow-y-auto p-5"
          aria-describedby={undefined}
        >
          <div className="flex items-start justify-between mb-4">
            <Dialog.Title className="text-white font-bold text-lg">Cara Pakai Peta SPKLU</Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-1 text-white/50 hover:text-white" aria-label="Tutup">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="space-y-3">
            <Step n={1} color="green" text="Klik penanda di peta atau kartu di samping untuk lihat detail stasiun." />
            <Step n={2} color="blue" text="Detail stasiun muncul di panel — samping di desktop, bawah di mobile." />
            <Step n={3} color="yellow" text="Tekan Navigasi untuk membuka rute di Google Maps." />
            <Step n={4} color="green" text="Tidak menemukan stasiun? Bantu lengkapi data dengan tombol + di pojok kanan bawah." />
          </div>

          <div className="mt-5 pt-4 border-t border-white/10">
            <p className="text-white/40 text-xs">
              Data dari PLN SPKLU. Ketersediaan real-time dan harga belum tersedia untuk semua stasiun.
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Step({ n, color, text }: { n: number; color: 'green' | 'blue' | 'yellow'; text: string }) {
  const palette = {
    green: 'bg-[#27AE60]/20 text-[#27AE60]',
    blue: 'bg-blue-500/20 text-blue-400',
    yellow: 'bg-volt/20 text-volt',
  }[color];

  return (
    <div className="flex items-start gap-3 bg-white/5 rounded-lg p-3">
      <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold flex-shrink-0 ${palette}`}>
        {n}
      </span>
      <span className="text-white/70 text-sm">{text}</span>
    </div>
  );
}
