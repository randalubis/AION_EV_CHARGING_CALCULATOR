import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

interface HowToUseDialogProps {
  trigger: React.ReactNode;
}

const STEPS: { color: 'green' | 'blue' | 'yellow' | 'green2'; text: string }[] = [
  { color: 'green', text: 'Pilih satu mobil EV dan satu mobil ICE (bensin) untuk dibandingkan.' },
  { color: 'blue', text: 'Atur jarak tempuh tahunan dan pola charging (rumah vs SPKLU publik).' },
  { color: 'yellow', text: 'Atur jenis asuransi, wilayah, dan apakah pajak STNK mau dimasukkan.' },
  { color: 'green2', text: 'Hasil estimasi muncul otomatis di bawah — biaya total, penghematan, dan break-even.' },
];

const PALETTE: Record<string, string> = {
  green: 'bg-[#27AE60]/20 text-[#27AE60]',
  green2: 'bg-[#27AE60]/20 text-[#27AE60]',
  blue: 'bg-blue-500/20 text-blue-400',
  yellow: 'bg-[#FFC300]/20 text-[#FFC300]',
};

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
            <Dialog.Title className="text-white font-bold text-lg">Cara Pakai TCO Calculator</Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-1 text-white/50 hover:text-white" aria-label="Tutup">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <ol className="space-y-3">
            {STEPS.map((step, i) => (
              <li key={i} className="flex items-start gap-3 bg-white/5 rounded-lg p-3">
                <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold flex-shrink-0 ${PALETTE[step.color]}`}>
                  {i + 1}
                </span>
                <span className="text-white/70 text-sm">{step.text}</span>
              </li>
            ))}
          </ol>

          <div className="mt-5 pt-4 border-t border-white/10">
            <p className="text-white/40 text-xs">
              TCO mencakup harga beli, bahan bakar/listrik, perawatan, asuransi, pajak,
              dan depresiasi nilai jual. Lihat &quot;Metodologi&quot; di halaman untuk detail rumus.
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
