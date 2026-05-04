import { supabase } from '../../../lib/supabase';
import type { StationSubmissionFormData } from '../types';

export interface SubmissionResponse {
  success: boolean;
  id?: string;
  error?: string;
}

function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return typeof err === 'string' ? err : 'Unknown error';
}

export async function submitStation(
  formData: StationSubmissionFormData,
): Promise<SubmissionResponse> {
  try {
    const { submittedBy, ...payload } = formData;

    const { data, error } = await supabase
      .from('station_submissions')
      .insert({
        payload,
        submitted_by_name: submittedBy.name,
        submitted_by_email: submittedBy.email,
        submitted_by_phone: submittedBy.phone || null,
      })
      .select('id')
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, id: data.id };
  } catch (err: unknown) {
    return {
      success: false,
      error: 'Gagal mengirim data: ' + errorMessage(err),
    };
  }
}

interface NearbyStation {
  id: string;
  name: string;
  distanceMeters: number;
}

/**
 * Find an existing station within `radiusMeters` of the given coords.
 * Uses the stations_in_bbox RPC with a small bounding box (~100m wide), then
 * checks exact distance client-side.
 */
export async function findNearbyStation(
  lat: number,
  lng: number,
  radiusMeters = 50,
): Promise<NearbyStation | null> {
  // ~0.001° lat ≈ 111m. ~0.001° lng ≈ 111m × cos(lat). At Indonesia lats this is roughly 110m.
  // 0.0009° gives us ~100m on a side, well over the 50m default radius.
  const pad = 0.0009;
  const { data, error } = await supabase.rpc('stations_in_bbox', {
    min_lng: lng - pad,
    min_lat: lat - pad,
    max_lng: lng + pad,
    max_lat: lat + pad,
    result_limit: 10,
  });

  if (error || !data || data.length === 0) return null;

  let closest: NearbyStation | null = null;
  for (const row of data as Array<{ id: string; name: string; latitude: number; longitude: number }>) {
    const meters = haversineMeters(lat, lng, row.latitude, row.longitude);
    if (meters <= radiusMeters && (closest === null || meters < closest.distanceMeters)) {
      closest = { id: row.id, name: row.name, distanceMeters: meters };
    }
  }

  return closest;
}

function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6_371_000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
