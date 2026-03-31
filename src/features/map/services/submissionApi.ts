import type { StationSubmissionFormData } from '../types';

// Google Sheets Configuration
// You'll need to set up a Google Apps Script web app to handle submissions
const GOOGLE_SHEETS_WEBAPP_URL = import.meta.env.VITE_GOOGLE_SHEETS_WEBAPP_URL || '';

// For development/testing, you can use a mock submission
const USE_MOCK_SUBMISSION = !GOOGLE_SHEETS_WEBAPP_URL;

export interface SubmissionResponse {
  success: boolean;
  id?: string;
  error?: string;
}

/**
 * Submit a new charging station to Google Sheets
 * 
 * To set up:
 * 1. Create a Google Sheet with columns matching the data structure
 * 2. Open Extensions > Apps Script
 * 3. Deploy as Web App (Execute as: Me, Access: Anyone)
 * 4. Set VITE_GOOGLE_SHEETS_WEBAPP_URL in your .env
 */
export async function submitStationToSheets(
  formData: StationSubmissionFormData
): Promise<SubmissionResponse> {
  if (USE_MOCK_SUBMISSION) {
    // Mock submission for testing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockId = `SUB-${Date.now()}`;
    console.log('Mock submission:', { id: mockId, data: formData });
    
    // Store in localStorage for demo purposes
    const existing = JSON.parse(localStorage.getItem('pending_submissions') || '[]');
    existing.push({
      id: mockId,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      ...formData
    });
    localStorage.setItem('pending_submissions', JSON.stringify(existing));
    
    return { success: true, id: mockId };
  }

  try {
    const response = await fetch(GOOGLE_SHEETS_WEBAPP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'submit',
        data: formData
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return { success: true, id: result.id };
  } catch (error) {
    console.error('Submission error:', error);
    return { 
      success: false, 
      error: 'Gagal mengirim data. Silakan coba lagi.' 
    };
  }
}

/**
 * Get user's pending submissions from localStorage
 */
export function getPendingSubmissions(): any[] {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem('pending_submissions') || '[]');
}

/**
 * Get approved submissions from Google Sheets
 * This would be called on app load to merge with existing stations
 */
export async function getApprovedSubmissions(): Promise<any[]> {
  if (USE_MOCK_SUBMISSION) {
    // Return mock approved submissions
    return [];
  }

  try {
    const response = await fetch(`${GOOGLE_SHEETS_WEBAPP_URL}?action=getApproved`);
    if (!response.ok) throw new Error('Failed to fetch');
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
}

// Google Apps Script Code (paste this in your Google Apps Script editor):
/*
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  
  if (data.action === 'submit') {
    return handleSubmit(data.data);
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    success: false,
    error: 'Invalid action'
  })).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const action = e.parameter.action;
  
  if (action === 'getApproved') {
    return handleGetApproved();
  }
  
  return ContentService.createTextOutput(JSON.stringify([]))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleSubmit(formData) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  const id = 'SUB-' + Date.now();
  const timestamp = new Date().toISOString();
  
  const row = [
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
    '', // Photo URLs - would need separate upload handling
    formData.pricing || '',
    formData.operatingHours,
    formData.notes || '',
    '', // reviewedAt
    '', // reviewedBy
    '', // rejectionReason
    ''  // adminNotes
  ];
  
  sheet.appendRow(row);
  
  // Send email notification to admin
  sendAdminNotification(formData);
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    id: id
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleGetApproved() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  const approvedRows = data.slice(1)
    .filter(row => row[1] === 'approved')
    .map(row => {
      const obj = {};
      headers.forEach((header, i) => {
        obj[header] = row[i];
      });
      return obj;
    });
  
  return ContentService.createTextOutput(JSON.stringify(approvedRows))
    .setMimeType(ContentService.MimeType.JSON);
}

function sendAdminNotification(formData) {
  const adminEmail = 'your-admin-email@example.com'; // Change this
  const subject = 'New Charging Station Submission: ' + formData.name;
  const body = `
    A new charging station has been submitted:
    
    Name: ${formData.name}
    Operator: ${formData.operator}
    Location: ${formData.address}, ${formData.city}, ${formData.province}
    Coordinates: ${formData.latitude}, ${formData.longitude}
    
    Submitter: ${formData.submittedBy.name} (${formData.submittedBy.email})
    
    Review at: https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit
  `;
  
  MailApp.sendEmail(adminEmail, subject, body);
}
*/
