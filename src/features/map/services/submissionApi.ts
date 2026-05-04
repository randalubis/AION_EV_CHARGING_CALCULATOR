import type { StationSubmissionFormData } from '../types';

// Google Sheets Configuration
// Set up a Google Apps Script web app to handle submissions; see template at the bottom of this file.
const GOOGLE_SHEETS_WEBAPP_URL = import.meta.env.VITE_GOOGLE_SHEETS_WEBAPP_URL || '';

// In dev (no VITE_GOOGLE_SHEETS_WEBAPP_URL), submissions are stored in localStorage instead.
const USE_MOCK_SUBMISSION = !GOOGLE_SHEETS_WEBAPP_URL;

export interface SubmissionResponse {
  success: boolean;
  id?: string;
  error?: string;
}

interface PendingSubmission extends StationSubmissionFormData {
  id: string;
  status: 'pending';
  submittedAt: string;
}

function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return typeof err === 'string' ? err : 'Unknown error';
}

export async function submitStationToSheets(
  formData: StationSubmissionFormData
): Promise<SubmissionResponse> {
  if (USE_MOCK_SUBMISSION) {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockId = `SUB-${Date.now()}`;
    const existing = JSON.parse(localStorage.getItem('pending_submissions') || '[]') as PendingSubmission[];
    existing.push({
      id: mockId,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      ...formData,
    });
    localStorage.setItem('pending_submissions', JSON.stringify(existing));

    return { success: true, id: mockId };
  }

  try {
    const response = await fetch(GOOGLE_SHEETS_WEBAPP_URL, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'submit', data: formData }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();

    if (result.success === false) {
      throw new Error(result.error || 'Unknown error');
    }

    return { success: true, id: result.id };
  } catch (err: unknown) {
    const message = errorMessage(err);

    if (message.includes('Failed to fetch') || message.includes('NetworkError')) {
      return {
        success: false,
        error: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
      };
    }

    if (message.includes('CORS')) {
      return {
        success: false,
        error: 'Error koneksi ke server (CORS). Hubungi admin.',
      };
    }

    return {
      success: false,
      error: 'Gagal mengirim data: ' + message,
    };
  }
}

export function getPendingSubmissions(): PendingSubmission[] {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem('pending_submissions') || '[]') as PendingSubmission[];
}

// Google Apps Script template — paste into your Apps Script editor and redeploy after edits.
/*
function doPost(e) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  try {
    const payload = JSON.parse(e.postData.contents);
    if (payload.action !== 'submit') {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Invalid action' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const formData = payload.data;
    const id = 'SUB-' + Date.now();
    const timestamp = new Date().toISOString();

    sheet.appendRow([
      id,
      'pending',
      timestamp,
      formData.submittedBy.name,
      formData.submittedBy.email,
      formData.submittedBy.phone || '',
      formData.name,
      formData.operator,
      formData.operatorOther || '',
      formData.address,
      formData.city,
      formData.province,
      formData.latitude,
      formData.longitude,
      formData.locationSource,
      JSON.stringify(formData.connectors),
      formData.amenities.join(', '),
      formData.pricing != null ? formData.pricing : '',
      formData.operatingHours,
      formData.notes || '',
    ]);

    return ContentService.createTextOutput(JSON.stringify({ success: true, id }))
      .setHeaders(headers)
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
*/
