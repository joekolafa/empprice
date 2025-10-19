/**
 * Get the sheet ID out of a sheets URL.
 */
export function parseSheetId(sheetUrl: string) {
  const strippedPrefix = sheetUrl.replaceAll(
    'https://docs.google.com/spreadsheets/d/',
    ''
  );

  return strippedPrefix.substring(0, strippedPrefix.indexOf('/'));
}

/**
 * Load the contents of a Google Sheet as JSON.
 */
export async function getSheetJson(sheetId: string, sheet: string) {
  const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheet}?key=${process.env.GOOGLE_SHEETS_KEY}`;

  const response = await fetch(sheetUrl);

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  return await response.json();
}
