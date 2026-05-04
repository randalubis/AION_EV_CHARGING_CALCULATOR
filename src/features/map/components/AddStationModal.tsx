import { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useForm, Controller, useFieldArray, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  X, ChevronLeft, ChevronRight, Check, MapPin, Navigation, Plus, Trash2, Crosshair, AlertTriangle,
} from 'lucide-react';
import { submitStation, findNearbyStation } from '../services/submissionApi';
import { submissionSchema, STEP_FIELDS, type SubmissionFormValues } from '../schemas/submissionSchema';
import type { AmenityType, ConnectorType } from '../types/base';

interface AddStationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestPickFromMap?: () => void;
  initialLocation?: { lat: number; lng: number } | null;
}

const PROVINCES = [
  'Aceh', 'Bali', 'Banten', 'Bengkulu', 'DI Yogyakarta', 'DKI Jakarta', 'Gorontalo',
  'Jambi', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'Kalimantan Barat', 'Kalimantan Selatan',
  'Kalimantan Tengah', 'Kalimantan Timur', 'Kalimantan Utara', 'Kepulauan Bangka Belitung',
  'Kepulauan Riau', 'Lampung', 'Maluku', 'Maluku Utara', 'Nusa Tenggara Barat',
  'Nusa Tenggara Timur', 'Papua', 'Papua Barat', 'Papua Barat Daya', 'Papua Pegunungan',
  'Papua Selatan', 'Riau', 'Sulawesi Barat', 'Sulawesi Selatan', 'Sulawesi Tengah',
  'Sulawesi Tenggara', 'Sulawesi Utara', 'Sumatera Barat', 'Sumatera Selatan', 'Sumatera Utara',
].sort();

const OPERATORS = [
  'PLN (SPKLU)', 'Shell Recharge', 'Voltron', 'Hyundai', 'BMW', 'Mercedes-Benz',
  'AION', 'Wuling', 'Tesla', 'Charge+', 'ION', 'Makara', 'Starvo', 'Charge IT',
  'Lainnya',
];

const CONNECTOR_TYPES: { value: ConnectorType; label: string }[] = [
  { value: 'type2', label: 'Type 2 (AC)' },
  { value: 'ccs2', label: 'CCS2 (DC)' },
  { value: 'chademo', label: 'CHAdeMO (DC)' },
  { value: 'gb/t', label: 'GB/T (DC)' },
  { value: 'tesla_supercharger', label: 'Tesla Supercharger' },
  { value: 'tesla_destination', label: 'Tesla Destination' },
];

const AMENITIES: { value: AmenityType; label: string; icon: string }[] = [
  { value: 'restroom', label: 'Toilet', icon: '🚻' },
  { value: 'cafe', label: 'Kafe', icon: '☕' },
  { value: 'restaurant', label: 'Restoran', icon: '🍽️' },
  { value: 'wifi', label: 'WiFi', icon: '📶' },
  { value: 'parking', label: 'Parkir', icon: '🅿️' },
  { value: 'mosque', label: 'Musholla', icon: '🕌' },
  { value: 'convenience_store', label: 'Minimarket', icon: '🏪' },
  { value: 'atm', label: 'ATM', icon: '🏧' },
];

const DUPLICATE_RADIUS_METERS = 50;

const STEP_TITLES = ['Lokasi', 'Detail Stasiun', 'Informasi Anda'] as const;

const DEFAULT_VALUES: SubmissionFormValues = {
  latitude: 0,
  longitude: 0,
  locationSource: 'manual',
  name: '',
  operator: '',
  operatorOther: '',
  address: '',
  city: '',
  province: '',
  operatingHours: '24 Jam',
  connectors: [],
  amenities: [],
  pricing: null,
  notes: '',
  submittedBy: { name: '', email: '', phone: '' },
};

export function AddStationModal({ isOpen, onClose, onRequestPickFromMap, initialLocation }: AddStationModalProps) {
  const methods = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onChange',
  });
  const { reset, setValue, trigger, handleSubmit, formState: { isSubmitting } } = methods;

  const [step, setStep] = useState(1);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  // Sync incoming location (e.g. user picked from map and reopened modal)
  useEffect(() => {
    if (initialLocation) {
      setValue('latitude', initialLocation.lat, { shouldValidate: true });
      setValue('longitude', initialLocation.lng, { shouldValidate: true });
      setValue('locationSource', 'map_click', { shouldValidate: true });
    }
  }, [initialLocation, setValue]);

  const handleDialogChange = (open: boolean) => {
    if (!open && !isSubmitting) {
      onClose();
      // Reset on full close (not on intermediate "go pick from map")
      setTimeout(() => {
        reset(DEFAULT_VALUES);
        setStep(1);
        setSubmitSuccess(false);
        setSubmitError(null);
        setDuplicateWarning(null);
      }, 200);
    }
  };

  const goNext = async () => {
    const fields = STEP_FIELDS[step as 1 | 2];
    const valid = await trigger(fields as Parameters<typeof trigger>[0]);
    if (valid) setStep(step + 1);
  };

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);

    if (!duplicateWarning) {
      const nearby = await findNearbyStation(values.latitude, values.longitude, DUPLICATE_RADIUS_METERS);
      if (nearby) {
        setDuplicateWarning(
          `Stasiun "${nearby.name}" sudah terdaftar sekitar ${Math.round(nearby.distanceMeters)}m dari sini. Tetap kirim?`,
        );
        return;
      }
    }

    const result = await submitStation({
      ...values,
      submittedBy: { ...values.submittedBy },
    });

    if (result.success) {
      setSubmitSuccess(true);
    } else {
      setSubmitError(result.error || 'Gagal mengirim data. Silakan coba lagi.');
    }
  });

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleDialogChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          aria-describedby={undefined}
        >
          <FormProvider {...methods}>
            <form
              onSubmit={onSubmit}
              className="bg-forest-dark border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
            >
              {!submitSuccess && (
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    {step > 1 && (
                      <button
                        type="button"
                        onClick={() => setStep(step - 1)}
                        className="p-1 text-white/50 hover:text-white"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                    )}
                    <div className="min-w-0">
                      <Dialog.Title className="text-base font-bold text-white leading-tight">
                        Tambah Stasiun
                      </Dialog.Title>
                      <p className="text-white/40 text-xs mt-0.5">
                        Langkah {step} dari 3 — {STEP_TITLES[step - 1]}
                      </p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-1" aria-hidden>
                    {[1, 2, 3].map(i => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i === step ? 'bg-[#FFC300]'
                            : i < step ? 'bg-[#27AE60]' : 'bg-white/20'
                        }`}
                      />
                    ))}
                  </div>
                  <Dialog.Close asChild>
                    <button type="button" className="p-1 text-white/50 hover:text-white" aria-label="Tutup">
                      <X className="w-5 h-5" />
                    </button>
                  </Dialog.Close>
                </div>
              )}

              <div className="flex-1 overflow-y-auto p-5">
                {submitSuccess ? (
                  <SuccessView onClose={() => handleDialogChange(false)} />
                ) : (
                  <>
                    {step === 1 && <StepLocation onRequestPickFromMap={onRequestPickFromMap} />}
                    {step === 2 && <StepDetails />}
                    {step === 3 && (
                      <StepSubmitter
                        submitError={submitError}
                        duplicateWarning={duplicateWarning}
                      />
                    )}
                  </>
                )}
              </div>

              {!submitSuccess && (
                <div className="flex items-center justify-between p-4 border-t border-white/10">
                  <Dialog.Close asChild>
                    <button type="button" className="text-white/50 hover:text-white text-sm">Batal</button>
                  </Dialog.Close>
                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={goNext}
                      className="flex items-center gap-2 bg-[#FFC300] text-forest-dark px-5 py-2 rounded-lg font-semibold hover:bg-[#e6b000] transition-colors"
                    >
                      Lanjut
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 bg-[#27AE60] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[#219653] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Mengirim...
                        </>
                      ) : duplicateWarning ? (
                        <>
                          <AlertTriangle className="w-4 h-4" />
                          Tetap Kirim
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Kirim
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </form>
          </FormProvider>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );

}

// ─── Step 1: Location ─────────────────────────────────────────────

function StepLocation({ onRequestPickFromMap }: { onRequestPickFromMap?: () => void }) {
  const { watch, setValue, formState: { errors } } = useFormContext<SubmissionFormValues>();
  const latitude = watch('latitude');
  const longitude = watch('longitude');
  const locationSource = watch('locationSource');
  const hasLocation = locationSource !== 'manual' && (latitude !== 0 || longitude !== 0);

  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const handleGetCurrentLocation = () => {
    setGeoError(null);
    if (!navigator.geolocation) {
      setGeoError('Geolocation tidak didukung di browser ini');
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setValue('latitude', pos.coords.latitude, { shouldValidate: true });
        setValue('longitude', pos.coords.longitude, { shouldValidate: true });
        setValue('locationSource', 'gps', { shouldValidate: true });
        setGeoLoading(false);
      },
      (err) => {
        const map: Record<number, string> = {
          [err.PERMISSION_DENIED]: 'Izin lokasi ditolak. Mohon izinkan akses lokasi.',
          [err.POSITION_UNAVAILABLE]: 'Informasi lokasi tidak tersedia',
          [err.TIMEOUT]: 'Waktu permintaan lokasi habis',
        };
        setGeoError(map[err.code] || 'Gagal mendapatkan lokasi');
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#FFC300]/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-[#FFC300]" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Pilih Lokasi</h3>
        <p className="text-white/60 text-sm">Tentukan lokasi stasiun charging</p>
      </div>

      <div className="space-y-4">
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={geoLoading}
          className="w-full p-4 bg-forest-mid border border-white/10 rounded-xl hover:border-[#FFC300]/50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#27AE60]/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Navigation className="w-5 h-5 text-[#27AE60]" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">Gunakan Lokasi Saya</p>
              <p className="text-white/50 text-sm">Ambil dari GPS perangkat</p>
            </div>
            {geoLoading && (
              <div className="w-5 h-5 border-2 border-[#FFC300] border-t-transparent rounded-full animate-spin" />
            )}
          </div>
        </button>

        {geoError && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm">
            {geoError}
          </div>
        )}

        {onRequestPickFromMap && (
          <button
            type="button"
            onClick={onRequestPickFromMap}
            className="w-full p-4 bg-forest-mid border border-white/10 rounded-xl hover:border-[#FFC300]/50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Crosshair className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Pilih dari Peta</p>
                <p className="text-white/50 text-sm">Tutup form dan ketuk lokasi di peta</p>
              </div>
            </div>
          </button>
        )}

        {hasLocation && (
          <div className="p-4 bg-[#FFC300]/10 border border-[#FFC300]/30 rounded-xl">
            <p className="text-[#FFC300] font-medium mb-1">Lokasi Terpilih</p>
            <p className="text-white/70 text-sm">
              Lat: {latitude.toFixed(6)}, Lng: {longitude.toFixed(6)}
            </p>
          </div>
        )}

        {(errors.latitude || errors.longitude) && (
          <p className="text-red-400 text-sm">
            {errors.latitude?.message || errors.longitude?.message}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Step 2: Details ─────────────────────────────────────────────

function StepDetails() {
  const { register, control, watch, setValue, formState: { errors } } = useFormContext<SubmissionFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: 'connectors' });
  const operator = watch('operator');
  const amenities = watch('amenities');

  const toggleAmenity = (value: AmenityType) => {
    const next = amenities.includes(value)
      ? amenities.filter(a => a !== value)
      : [...amenities, value];
    setValue('amenities', next, { shouldValidate: true });
  };

  return (
    <div className="space-y-5">
      <h3 className="text-xl font-bold text-white">Detail Stasiun</h3>

      <Field label="Nama Stasiun *" error={errors.name?.message}>
        <input
          {...register('name')}
          placeholder="Contoh: SPKLU PLN Gandaria City"
          className={inputClass}
        />
      </Field>

      <Field label="Operator *" error={errors.operator?.message}>
        <select {...register('operator')} className={inputClass}>
          <option value="" className="bg-forest-dark">Pilih Operator</option>
          {OPERATORS.map(op => (
            <option key={op} value={op} className="bg-forest-dark">{op}</option>
          ))}
        </select>
      </Field>
      {operator === 'Lainnya' && (
        <Field label="Nama Operator Lainnya *" error={errors.operatorOther?.message}>
          <input {...register('operatorOther')} placeholder="Nama operator" className={inputClass} />
        </Field>
      )}

      <Field label="Alamat Lengkap *" error={errors.address?.message}>
        <textarea {...register('address')} rows={2} placeholder="Alamat lengkap stasiun" className={`${inputClass} resize-none`} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Kota *" error={errors.city?.message}>
          <input {...register('city')} placeholder="Jakarta" className={inputClass} />
        </Field>
        <Field label="Provinsi *" error={errors.province?.message}>
          <select {...register('province')} className={inputClass}>
            <option value="" className="bg-forest-dark">Pilih</option>
            {PROVINCES.map(p => (
              <option key={p} value={p} className="bg-forest-dark">{p}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Jam Operasional" error={errors.operatingHours?.message}>
        <input {...register('operatingHours')} placeholder="24 Jam" className={inputClass} />
      </Field>

      {/* Connectors */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-white/70 text-sm">Konektor *</label>
          <button
            type="button"
            onClick={() => append({ id: crypto.randomUUID(), type: 'ccs2', powerKw: 50, currentType: 'DC', count: 1 })}
            className="flex items-center gap-1 text-[#FFC300] text-sm hover:text-[#e6b000]"
          >
            <Plus className="w-4 h-4" />
            Tambah
          </button>
        </div>

        {fields.length === 0 && (
          <p className="text-white/40 text-sm py-4 text-center bg-forest-mid/50 rounded-lg">
            Belum ada konektor. Klik &quot;Tambah&quot; untuk menambahkan.
          </p>
        )}

        {fields.map((field, idx) => (
          <div key={field.id} className="flex items-center gap-2 mb-2">
            <Controller
              control={control}
              name={`connectors.${idx}.type`}
              render={({ field }) => (
                <select {...field} className={`flex-1 ${inputClass} text-sm`}>
                  {CONNECTOR_TYPES.map(t => (
                    <option key={t.value} value={t.value} className="bg-forest-dark">{t.label}</option>
                  ))}
                </select>
              )}
            />
            <input
              type="number"
              inputMode="numeric"
              {...register(`connectors.${idx}.powerKw`, { valueAsNumber: true })}
              placeholder="kW"
              className={`w-20 ${inputClass} text-sm`}
            />
            <Controller
              control={control}
              name={`connectors.${idx}.currentType`}
              render={({ field }) => (
                <select {...field} className={`w-20 ${inputClass} text-sm`}>
                  <option value="AC" className="bg-forest-dark">AC</option>
                  <option value="DC" className="bg-forest-dark">DC</option>
                </select>
              )}
            />
            <input
              type="number"
              inputMode="numeric"
              {...register(`connectors.${idx}.count`, { valueAsNumber: true })}
              placeholder="Qty"
              className={`w-16 ${inputClass} text-sm`}
            />
            <button
              type="button"
              onClick={() => remove(idx)}
              className="p-2 text-red-400 hover:text-red-300"
              aria-label="Hapus konektor"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {errors.connectors?.message && (
          <p className="text-red-400 text-xs mt-1">{errors.connectors.message}</p>
        )}
        {Array.isArray(errors.connectors) && errors.connectors.some(Boolean) && (
          <p className="text-red-400 text-xs mt-1">Periksa nilai konektor (kW dan jumlah harus &gt; 0)</p>
        )}
      </div>

      {/* Amenities */}
      <div>
        <label className="block text-white/70 text-sm mb-2">Fasilitas</label>
        <div className="flex flex-wrap gap-2">
          {AMENITIES.map(a => (
            <button
              key={a.value}
              type="button"
              onClick={() => toggleAmenity(a.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${
                amenities.includes(a.value)
                  ? 'bg-[#FFC300] text-forest-dark'
                  : 'bg-forest-mid text-white/70 hover:bg-forest-mid/80'
              }`}
            >
              <span>{a.icon}</span>
              <span>{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      <Field label="Harga (opsional)" error={errors.pricing?.message}>
        <div className="flex items-center gap-2">
          <span className="text-white/50">Rp</span>
          <Controller
            control={control}
            name="pricing"
            render={({ field }) => (
              <input
                type="number"
                inputMode="numeric"
                value={field.value ?? ''}
                onChange={e => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                onBlur={field.onBlur}
                placeholder="Harga per kWh"
                className={`flex-1 ${inputClass}`}
              />
            )}
          />
          <span className="text-white/50 text-sm">/kWh</span>
        </div>
      </Field>

      <Field label="Catatan Tambahan">
        <textarea
          {...register('notes')}
          rows={2}
          placeholder="Informasi tambahan tentang stasiun..."
          className={`${inputClass} resize-none`}
        />
      </Field>
    </div>
  );
}

// ─── Step 3: Submitter ─────────────────────────────────────────────

function StepSubmitter({
  submitError,
  duplicateWarning,
}: {
  submitError: string | null;
  duplicateWarning: string | null;
}) {
  const { register, watch, formState: { errors } } = useFormContext<SubmissionFormValues>();
  const values = watch();

  return (
    <div className="space-y-5">
      <h3 className="text-xl font-bold text-white">Informasi Anda</h3>
      <p className="text-white/60 text-sm">
        Data ini tidak akan ditampilkan publik. Hanya digunakan untuk verifikasi.
      </p>

      <Field label="Nama Lengkap *" error={errors.submittedBy?.name?.message}>
        <input {...register('submittedBy.name')} placeholder="Nama Anda" className={inputClass} />
      </Field>

      <Field label="Email *" error={errors.submittedBy?.email?.message}>
        <input
          {...register('submittedBy.email')}
          type="email"
          placeholder="email@example.com"
          className={inputClass}
        />
      </Field>

      <Field label="Nomor Telepon (opsional)">
        <input {...register('submittedBy.phone')} type="tel" placeholder="0812xxxxxxx" className={inputClass} />
      </Field>

      <div className="p-4 bg-forest-mid/50 rounded-xl space-y-2">
        <p className="text-white font-medium">Ringkasan Pengajuan</p>
        <div className="text-sm space-y-1">
          <p className="text-white/60">
            <span className="text-white/40">Stasiun:</span> {values.name}
          </p>
          <p className="text-white/60">
            <span className="text-white/40">Lokasi:</span> {values.city}, {values.province}
          </p>
          <p className="text-white/60">
            <span className="text-white/40">Konektor:</span> {values.connectors.length} tipe
          </p>
        </div>
      </div>

      {duplicateWarning && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="flex-1 text-sm text-amber-200">{duplicateWarning}</p>
        </div>
      )}

      <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <p className="text-blue-300 text-sm">
          Dengan mengirimkan formulir ini, Anda menyatakan bahwa informasi yang diberikan
          adalah benar dan Anda memiliki izin untuk membagikan data lokasi ini.
        </p>
      </div>

      {submitError && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-red-300 text-sm">{submitError}</p>
        </div>
      )}
    </div>
  );
}

// ─── Success ─────────────────────────────────────────────

function SuccessView({ onClose }: { onClose: () => void }) {
  return (
    <div className="text-center py-8">
      <div className="w-20 h-20 bg-[#27AE60]/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <Check className="w-10 h-10 text-[#27AE60]" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-3">Pengajuan Berhasil!</h3>
      <p className="text-white/60 mb-6 max-w-sm mx-auto">
        Terima kasih telah berkontribusi. Data stasiun charging Anda telah dikirim
        dan akan ditinjau oleh tim kami dalam 1-3 hari kerja.
      </p>
      <button
        type="button"
        onClick={onClose}
        className="bg-[#FFC300] text-forest-dark px-6 py-2.5 rounded-lg font-semibold hover:bg-[#e6b000] transition-colors"
      >
        Tutup
      </button>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────

const inputClass =
  'w-full bg-forest-mid border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder:text-white/30 focus:border-[#FFC300] focus:outline-none';

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-white/70 text-sm mb-2">{label}</label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
