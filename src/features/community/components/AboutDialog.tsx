import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

interface AboutDialogProps {
  trigger: React.ReactNode;
}

const TIPS: { color: 'green' | 'blue' | 'yellow' | 'green2'; text: string }[] = [
  { color: 'green', text: 'Pilih tab — Per Merek, Per Wilayah, atau Per Minat — sesuai cara kamu mau cari.' },
  { color: 'blue', text: 'Klik kartu komunitas untuk membuka link Facebook atau formulir pendaftaran.' },
  { color: 'yellow', text: 'Beberapa komunitas pakai formulir verifikasi (Google Form) sebelum kamu bisa join.' },
  { color: 'green2', text: 'Link rusak? Tekan "Lapor link rusak" di kartu — admin akan periksa dan update.' },
];

const PALETTE: Record<string, string> = {
  green: 'bg-[#27AE60]/20 text-[#27AE60]',
  green2: 'bg-[#27AE60]/20 text-[#27AE60]',
  blue: 'bg-blue-500/20 text-blue-400',
  yellow: 'bg-volt/20 text-volt',
};

export function AboutDialog({ trigger }: AboutDialogProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999]
                     bg-carbon-950 border border-white/10 rounded-2xl
                     w-[calc(100%-2rem)] max-w-md max-h-[90vh] overflow-y-auto p-5"
          aria-describedby={undefined}
        >
          <div className="flex items-start justify-between mb-4">
            <Dialog.Title className="text-white font-bold text-lg">Tentang Direktori Komunitas</Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-1 text-white/50 hover:text-white" aria-label="Tutup">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <p className="text-white/60 text-sm mb-5">
            evhub.id <strong>bukan pemilik atau pengurus</strong> komunitas-komunitas di bawah —
            kami hanya kurator daftar. Saat kamu klik kartu, kamu akan dibawa keluar ke platform
            asli komunitas (Facebook atau formulir registrasi).
          </p>

          <ol className="space-y-3 mb-5">
            {TIPS.map((step, i) => (
              <li key={i} className="flex items-start gap-3 bg-white/5 rounded-lg p-3">
                <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold flex-shrink-0 ${PALETTE[step.color]}`}>
                  {i + 1}
                </span>
                <span className="text-white/70 text-sm">{step.text}</span>
              </li>
            ))}
          </ol>

          <div className="pt-4 border-t border-white/10">
            <p className="text-white/60 text-sm mb-2">
              <strong className="text-white">Punya komunitas yang belum terdaftar?</strong>
            </p>
            <p className="text-white/50 text-sm">
              Kirim usulan ke{' '}
              <a
                href="mailto:hello@evhub.id?subject=Usulan%20komunitas%20EV"
                className="text-volt hover:underline"
              >
                hello@evhub.id
              </a>{' '}
              dengan nama komunitas, link grup/formulir, dan info brand/wilayah/minat. Kami akan
              tinjau dan tambahkan.
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
