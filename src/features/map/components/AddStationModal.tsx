import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Check, MapPin, Navigation, Upload, Plus, Trash2 } from 'lucide-react';
import { submitStationToSheets } from '../services/submissionApi';
import type { StationSubmissionFormData, ConnectorSubmission, AmenityType, ConnectorType } from '../types';

interface AddStationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLocation?: { lat: number; lng: number } | null;
}

const PROVINCES = [
  'Aceh', 'Bali', 'Banten', 'Bengkulu', 'DI Yogyakarta', 'DKI Jakarta', 'Gorontalo',
  'Jambi', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'Kalimantan Barat', 'Kalimantan Selatan',
  'Kalimantan Tengah', 'Kalimantan Timur', 'Kalimantan Utara', 'Kepulauan Bangka Belitung',
  'Kepulauan Riau', 'Lampung', 'Maluku', 'Maluku Utara', 'Nusa Tenggara Barat',
  'Nusa Tenggara Timur', 'Papua', 'Papua Barat', 'Papua Barat Daya', 'Papua Pegunungan',
  'Papua Selatan', 'Riau', 'Sulawesi Barat', 'Sulawesi Selatan', 'Sulawesi Tengah',
  'Sulawesi Tenggara', 'Sulawesi Utara', 'Sumatera Barat', 'Sumatera Selatan', 'Sumatera Utara'
].sort();

const OPERATORS = [
  'PLN (SPKLU)', 'Shell Recharge', 'Voltron', 'Hyundai', 'BMW', 'Mercedes-Benz',
  'AION', 'Wuling', 'Tesla', 'Charge+', 'ION', 'Makara', 'Starvo', 'Charge IT',
  'Lainnya'
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

const INITIAL_FORM_DATA: StationSubmissionFormData = {
  submittedBy: { name: '', email: '', phone: '' },
  name: '',
  operator: '',
  operatorOther: '',
  address: '',
  city: '',
  province: '',
  latitude: null,
  longitude: null,
  locationSource: null,
  connectors: [],
  amenities: [],
  photos: [],
  pricing: '',
  operatingHours: '24 Jam',
  notes: ''
};

export function AddStationModal({ isOpen, onClose, initialLocation }: AddStationModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<StationSubmissionFormData>({
    ...INITIAL_FORM_DATA,
    latitude: initialLocation?.lat ?? null,
    longitude: initialLocation?.lng ?? null,
    locationSource: initialLocation ? 'map_click' : null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [geolocationLoading, setGeolocationLoading] = useState(false);
  const [geolocationError, setGeolocationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setStep(1);
      setFormData(INITIAL_FORM_DATA);
      setSubmitSuccess(false);
    }
  };

  const handleGetCurrentLocation = () => {
    setGeolocationLoading(true);
    setGeolocationError(null);
    
    if (!navigator.geolocation) {
      setGeolocationError('Geolocation tidak didukung di browser ini');
      setGeolocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          locationSource: 'gps'
        }));
        setGeolocationLoading(false);
      },
      (error) => {
        let errorMsg = 'Gagal mendapatkan lokasi';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = 'Izin lokasi ditolak. Mohon izinkan akses lokasi.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = 'Informasi lokasi tidak tersedia';
            break;
          case error.TIMEOUT:
            errorMsg = 'Waktu permintaan lokasi habis';
            break;
        }
        setGeolocationError(errorMsg);
        setGeolocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleAddConnector = () => {
    const newConnector: ConnectorSubmission = {
      id: Date.now().toString(),
      type: 'ccs2',
      powerKw: 50,
      currentType: 'DC',
      count: 1
    };
    setFormData(prev => ({
      ...prev,
      connectors: [...prev.connectors, newConnector]
    }));
  };

  const handleRemoveConnector = (id: string) => {
    setFormData(prev => ({
      ...prev,
      connectors: prev.connectors.filter(c => c.id !== id)
    }));
  };

  const handleUpdateConnector = (id: string, field: keyof ConnectorSubmission, value: any) => {
    setFormData(prev => ({
      ...prev,
      connectors: prev.connectors.map(c => 
        c.id === id ? { ...c, [field]: value } : c
      )
    }));
  };

  const handleToggleAmenity = (amenity: AmenityType) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...newFiles].slice(0, 5) // Max 5 photos
      }));
    }
  };

  const handleRemovePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        return !!(formData.latitude && formData.longitude);
      case 2:
        return !!(
          formData.name.trim() &&
          formData.operator &&
          formData.address.trim() &&
          formData.city.trim() &&
          formData.province &&
          formData.connectors.length > 0
        );
      case 3:
        return !!(
          formData.submittedBy.name.trim() &&
          formData.submittedBy.email.trim()
        );
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const result = await submitStationToSheets(formData);
      
      if (result.success) {
        setSubmitSuccess(true);
      } else {
        alert(result.error || 'Gagal mengirim data. Silakan coba lagi.');
      }
    } catch (error) {
      alert('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#FFC300]/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-[#FFC300]" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Pilih Lokasi</h3>
        <p className="text-white/60 text-sm">Tentukan lokasi stasiun charging</p>
      </div>

      <div className="space-y-4">
        {/* GPS Option */}
        <button
          onClick={handleGetCurrentLocation}
          disabled={geolocationLoading}
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
            {geolocationLoading && (
              <div className="w-5 h-5 border-2 border-[#FFC300] border-t-transparent rounded-full animate-spin" />
            )}
          </div>
        </button>

        {geolocationError && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm">
            {geolocationError}
          </div>
        )}

        {/* Map Click Option */}
        <div className="p-4 bg-forest-mid border border-white/10 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-white font-medium">Klik di Peta</p>
              <p className="text-white/50 text-sm">Tutup modal dan klik lokasi di peta</p>
            </div>
          </div>
        </div>

        {/* Current Location Display */}
        {formData.latitude && formData.longitude && (
          <div className="p-4 bg-[#FFC300]/10 border border-[#FFC300]/30 rounded-xl">
            <p className="text-[#FFC300] font-medium mb-1">Lokasi Terpilih</p>
            <p className="text-white/70 text-sm">
              Lat: {formData.latitude.toFixed(6)}, Lng: {formData.longitude.toFixed(6)}
            </p>
            <p className="text-white/50 text-xs mt-1 capitalize">
              Sumber: {formData.locationSource === 'gps' ? 'GPS' : 'Klik Peta'}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-2">
      <h3 className="text-xl font-bold text-white">Detail Stasiun</h3>

      {/* Station Name */}
      <div>
        <label className="block text-white/70 text-sm mb-2">Nama Stasiun *</label>
        <input
          type="text"
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Contoh: SPKLU PLN Gandaria City"
          className="w-full bg-forest-mid border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder:text-white/30 focus:border-[#FFC300] focus:outline-none"
        />
      </div>

      {/* Operator */}
      <div>
        <label className="block text-white/70 text-sm mb-2">Operator *</label>
        <select
          value={formData.operator}
          onChange={e => setFormData(prev => ({ ...prev, operator: e.target.value }))}
          className="w-full bg-forest-mid border border-white/20 rounded-lg px-4 py-2.5 text-white focus:border-[#FFC300] focus:outline-none"
        >
          <option value="" className="bg-forest-dark">Pilih Operator</option>
          {OPERATORS.map(op => (
            <option key={op} value={op} className="bg-forest-dark">{op}</option>
          ))}
        </select>
        {formData.operator === 'Lainnya' && (
          <input
            type="text"
            value={formData.operatorOther}
            onChange={e => setFormData(prev => ({ ...prev, operatorOther: e.target.value }))}
            placeholder="Nama operator lainnya"
            className="w-full mt-2 bg-forest-mid border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder:text-white/30 focus:border-[#FFC300] focus:outline-none"
          />
        )}
      </div>

      {/* Address */}
      <div>
        <label className="block text-white/70 text-sm mb-2">Alamat Lengkap *</label>
        <textarea
          value={formData.address}
          onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
          placeholder="Alamat lengkap stasiun"
          rows={2}
          className="w-full bg-forest-mid border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder:text-white/30 focus:border-[#FFC300] focus:outline-none resize-none"
        />
      </div>

      {/* City & Province */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-white/70 text-sm mb-2">Kota *</label>
          <input
            type="text"
            value={formData.city}
            onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))}
            placeholder="Jakarta"
            className="w-full bg-forest-mid border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder:text-white/30 focus:border-[#FFC300] focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-white/70 text-sm mb-2">Provinsi *</label>
          <select
            value={formData.province}
            onChange={e => setFormData(prev => ({ ...prev, province: e.target.value }))}
            className="w-full bg-forest-mid border border-white/20 rounded-lg px-4 py-2.5 text-white focus:border-[#FFC300] focus:outline-none"
          >
            <option value="" className="bg-forest-dark">Pilih</option>
            {PROVINCES.map(prov => (
              <option key={prov} value={prov} className="bg-forest-dark">{prov}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Operating Hours */}
      <div>
        <label className="block text-white/70 text-sm mb-2">Jam Operasional</label>
        <input
          type="text"
          value={formData.operatingHours}
          onChange={e => setFormData(prev => ({ ...prev, operatingHours: e.target.value }))}
          placeholder="Contoh: 24 Jam atau 08:00 - 22:00"
          className="w-full bg-forest-mid border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder:text-white/30 focus:border-[#FFC300] focus:outline-none"
        />
      </div>

      {/* Connectors */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-white/70 text-sm">Konektor *</label>
          <button
            onClick={handleAddConnector}
            className="flex items-center gap-1 text-[#FFC300] text-sm hover:text-[#e6b000]"
          >
            <Plus className="w-4 h-4" />
            Tambah
          </button>
        </div>
        
        {formData.connectors.length === 0 && (
          <p className="text-white/40 text-sm py-4 text-center bg-forest-mid/50 rounded-lg">
            Belum ada konektor. Klik &quot;Tambah&quot; untuk menambahkan.
          </p>
        )}

        {formData.connectors.map((connector, index) => (
          <div key={connector.id} className="flex items-center gap-2 mb-2">
            <select
              value={connector.type}
              onChange={e => handleUpdateConnector(connector.id, 'type', e.target.value)}
              className="flex-1 bg-forest-mid border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:border-[#FFC300] focus:outline-none"
            >
              {CONNECTOR_TYPES.map(type => (
                <option key={type.value} value={type.value} className="bg-forest-dark">{type.label}</option>
              ))}
            </select>
            <input
              type="number"
              value={connector.powerKw}
              onChange={e => handleUpdateConnector(connector.id, 'powerKw', parseInt(e.target.value) || 0)}
              placeholder="kW"
              className="w-20 bg-forest-mid border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:border-[#FFC300] focus:outline-none"
            />
            <select
              value={connector.currentType}
              onChange={e => handleUpdateConnector(connector.id, 'currentType', e.target.value)}
              className="w-20 bg-forest-mid border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:border-[#FFC300] focus:outline-none"
            >
              <option value="AC" className="bg-forest-dark">AC</option>
              <option value="DC" className="bg-forest-dark">DC</option>
            </select>
            <input
              type="number"
              value={connector.count}
              onChange={e => handleUpdateConnector(connector.id, 'count', parseInt(e.target.value) || 1)}
              placeholder="Qty"
              min={1}
              className="w-16 bg-forest-mid border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:border-[#FFC300] focus:outline-none"
            />
            <button
              onClick={() => handleRemoveConnector(connector.id)}
              className="p-2 text-red-400 hover:text-red-300"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Amenities */}
      <div>
        <label className="block text-white/70 text-sm mb-2">Fasilitas</label>
        <div className="flex flex-wrap gap-2">
          {AMENITIES.map(amenity => (
            <button
              key={amenity.value}
              onClick={() => handleToggleAmenity(amenity.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${
                formData.amenities.includes(amenity.value)
                  ? 'bg-[#FFC300] text-forest-dark'
                  : 'bg-forest-mid text-white/70 hover:bg-forest-mid/80'
              }`}
            >
              <span>{amenity.icon}</span>
              <span>{amenity.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div>
        <label className="block text-white/70 text-sm mb-2">Harga (opsional)</label>
        <div className="flex items-center gap-2">
          <span className="text-white/50">Rp</span>
          <input
            type="number"
            value={formData.pricing}
            onChange={e => setFormData(prev => ({ ...prev, pricing: e.target.value }))}
            placeholder="Harga per kWh"
            className="flex-1 bg-forest-mid border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder:text-white/30 focus:border-[#FFC300] focus:outline-none"
          />
          <span className="text-white/50 text-sm">/kWh</span>
        </div>
      </div>

      {/* Photos */}
      <div>
        <label className="block text-white/70 text-sm mb-2">
          Foto Stasiun ({formData.photos.length}/5)
        </label>
        <div className="flex flex-wrap gap-2">
          {formData.photos.map((photo, index) => (
            <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden">
              <img
                src={URL.createObjectURL(photo)}
                alt={`Foto ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => handleRemovePhoto(index)}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
          {formData.photos.length < 5 && (
            <label className="w-20 h-20 bg-forest-mid border border-dashed border-white/30 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#FFC300]/50 transition-colors">
              <Upload className="w-5 h-5 text-white/50 mb-1" />
              <span className="text-white/50 text-xs">Upload</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-white/70 text-sm mb-2">Catatan Tambahan</label>
        <textarea
          value={formData.notes}
          onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Informasi tambahan tentang stasiun..."
          rows={2}
          className="w-full bg-forest-mid border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder:text-white/30 focus:border-[#FFC300] focus:outline-none resize-none"
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-5">
      <h3 className="text-xl font-bold text-white">Informasi Anda</h3>
      <p className="text-white/60 text-sm">
        Data ini tidak akan ditampilkan publik. Hanya digunakan untuk verifikasi.
      </p>

      <div>
        <label className="block text-white/70 text-sm mb-2">Nama Lengkap *</label>
        <input
          type="text"
          value={formData.submittedBy.name}
          onChange={e => setFormData(prev => ({ 
            ...prev, 
            submittedBy: { ...prev.submittedBy, name: e.target.value }
          }))}
          placeholder="Nama Anda"
          className="w-full bg-forest-mid border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder:text-white/30 focus:border-[#FFC300] focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-white/70 text-sm mb-2">Email *</label>
        <input
          type="email"
          value={formData.submittedBy.email}
          onChange={e => setFormData(prev => ({ 
            ...prev, 
            submittedBy: { ...prev.submittedBy, email: e.target.value }
          }))}
          placeholder="email@example.com"
          className="w-full bg-forest-mid border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder:text-white/30 focus:border-[#FFC300] focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-white/70 text-sm mb-2">Nomor Telepon (opsional)</label>
        <input
          type="tel"
          value={formData.submittedBy.phone}
          onChange={e => setFormData(prev => ({ 
            ...prev, 
            submittedBy: { ...prev.submittedBy, phone: e.target.value }
          }))}
          placeholder="0812xxxxxxx"
          className="w-full bg-forest-mid border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder:text-white/30 focus:border-[#FFC300] focus:outline-none"
        />
      </div>

      {/* Review Summary */}
      <div className="p-4 bg-forest-mid/50 rounded-xl space-y-2">
        <p className="text-white font-medium">Ringkasan Pengajuan</p>
        <div className="text-sm space-y-1">
          <p className="text-white/60">
            <span className="text-white/40">Stasiun:</span> {formData.name}
          </p>
          <p className="text-white/60">
            <span className="text-white/40">Lokasi:</span> {formData.city}, {formData.province}
          </p>
          <p className="text-white/60">
            <span className="text-white/40">Konektor:</span> {formData.connectors.length} tipe
          </p>
        </div>
      </div>

      <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <p className="text-blue-300 text-sm">
          Dengan mengirimkan formulir ini, Anda menyatakan bahwa informasi yang diberikan 
          adalah benar dan Anda memiliki izin untuk membagikan data lokasi ini.
        </p>
      </div>
    </div>
  );

  const renderSuccess = () => (
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
        onClick={handleClose}
        className="bg-[#FFC300] text-forest-dark px-6 py-2.5 rounded-lg font-semibold hover:bg-[#e6b000] transition-colors"
      >
        Tutup
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-forest-dark border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        {!submitSuccess && (
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="p-1 text-white/50 hover:text-white"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              <h2 className="text-lg font-bold text-white">Tambah Stasiun</h2>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i === step ? 'bg-[#FFC300]' : 
                    i < step ? 'bg-[#27AE60]' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={handleClose}
              className="p-1 text-white/50 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {submitSuccess ? renderSuccess() : (
            <>
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}
            </>
          )}
        </div>

        {/* Footer */}
        {!submitSuccess && (
          <div className="flex items-center justify-between p-4 border-t border-white/10">
            <button
              onClick={handleClose}
              className="text-white/50 hover:text-white text-sm"
            >
              Batal
            </button>
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!validateStep(step)}
                className="flex items-center gap-2 bg-[#FFC300] text-forest-dark px-5 py-2 rounded-lg font-semibold hover:bg-[#e6b000] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Lanjut
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!validateStep(step) || isSubmitting}
                className="flex items-center gap-2 bg-[#27AE60] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[#219653] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Mengirim...
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
      </div>
    </div>
  );
}
