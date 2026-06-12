import { z } from 'zod';

const CONNECTOR_TYPES = ['type2', 'ccs2', 'chademo', 'gb/t', 'tesla_supercharger', 'tesla_destination'] as const;
const AMENITY_TYPES = ['restroom', 'cafe', 'restaurant', 'wifi', 'parking', 'mosque', 'convenience_store', 'atm'] as const;

export const connectorSchema = z.object({
  id: z.string(),
  type: z.enum(CONNECTOR_TYPES),
  powerKw: z.number().positive('Daya harus lebih dari 0'),
  currentType: z.enum(['AC', 'DC']),
  count: z.number().int().positive('Jumlah harus lebih dari 0'),
});

// Indonesia bounding box (slightly padded)
const INDONESIA_LAT_MIN = -11;
const INDONESIA_LAT_MAX = 6;
const INDONESIA_LNG_MIN = 95;
const INDONESIA_LNG_MAX = 141;

export const submissionSchema = z
  .object({
    latitude: z
      .number()
      .min(INDONESIA_LAT_MIN, 'Lokasi harus di Indonesia')
      .max(INDONESIA_LAT_MAX, 'Lokasi harus di Indonesia'),
    longitude: z
      .number()
      .min(INDONESIA_LNG_MIN, 'Lokasi harus di Indonesia')
      .max(INDONESIA_LNG_MAX, 'Lokasi harus di Indonesia'),
    locationSource: z.enum(['gps', 'map_click', 'manual']),

    name: z.string().trim().min(3, 'Nama minimal 3 karakter'),
    operator: z.string().min(1, 'Operator harus dipilih'),
    operatorOther: z.string().trim(),
    address: z.string().trim().min(5, 'Alamat minimal 5 karakter'),
    city: z.string().trim().min(2, 'Kota harus diisi'),
    province: z.string().min(1, 'Provinsi harus dipilih'),
    operatingHours: z.string().trim().min(1, 'Jam operasional harus diisi'),

    connectors: z.array(connectorSchema).min(1, 'Tambahkan minimal 1 konektor'),
    amenities: z.array(z.enum(AMENITY_TYPES)),
    pricing: z.number().positive('Harga harus lebih dari 0').nullable(),
    notes: z.string(),

    submittedBy: z.object({
      name: z.string().trim().min(2, 'Nama harus diisi'),
      email: z.email('Format email tidak valid'),
      phone: z.string().trim(),
    }),
  })
  .superRefine((data, ctx) => {
    if (data.operator === 'Lainnya' && !data.operatorOther.trim()) {
      ctx.addIssue({
        code: 'custom',
        path: ['operatorOther'],
        message: 'Nama operator harus diisi',
      });
    }
  });

export type SubmissionFormValues = z.infer<typeof submissionSchema>;

export const STEP_FIELDS = {
  1: ['latitude', 'longitude', 'locationSource'] as const,
  2: ['name', 'operator', 'operatorOther', 'address', 'city', 'province', 'operatingHours', 'connectors', 'pricing'] as const,
  3: ['submittedBy.name', 'submittedBy.email'] as const,
};
