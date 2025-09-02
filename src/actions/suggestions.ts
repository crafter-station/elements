"use server";

import { google } from "googleapis";

const SHEETS_CONFIG = {
  SPREADSHEET_ID: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
  SHEETS: {
    ANONYMOUS: "Anonymous!A:E", // For anonymous users only (with email validation)
    AUTHENTICATED: "Authenticated!A:E", // For logged-in users (unlimited)
  },
};

export async function submitElementSuggestion(formData: FormData) {
  try {
    const provider = formData.get("provider") as string;
    const customProvider = formData.get("customProvider") as string;
    const description = formData.get("description") as string;
    const email = formData.get("email") as string;
    const _userId = formData.get("userId") as string;
    const isAuthenticated = formData.get("isAuthenticated") === "true";

    if (!provider || !description || !email) {
      throw new Error("Provider, description, and email are required");
    }

    const finalProvider = provider === "unknown" ? customProvider : provider;

    // Configure Google Sheets authentication
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // Determine target sheet based on user authentication
    let targetSheet = SHEETS_CONFIG.SHEETS.AUTHENTICATED; // Default for logged users

    if (!isAuthenticated) {
      targetSheet = SHEETS_CONFIG.SHEETS.ANONYMOUS;

      // ONLY validate for Anonymous sheet - check if email already exists
      try {
        const existingData = await sheets.spreadsheets.values.get({
          spreadsheetId: SHEETS_CONFIG.SPREADSHEET_ID,
          range: SHEETS_CONFIG.SHEETS.ANONYMOUS,
        });

        const rows = existingData.data.values || [];

        // Check if this email has already submitted to Anonymous sheet
        const hasSubmittedByEmail = rows.some((row, index) => {
          if (index === 0) return false; // Skip header row
          const rowEmail = row[3]; // Email column
          return rowEmail === email;
        });

        if (hasSubmittedByEmail) {
          return {
            success: false,
            error: "ANONYMOUS_LIMIT_REACHED",
            message:
              "This email has already been used for an anonymous suggestion. Please sign in to submit unlimited suggestions.",
          };
        }
      } catch (error) {
        console.log("Could not check Anonymous sheet:", error);
        // Continue with submission if we can't check
      }
    }

    const rowData = [
      new Date().toISOString(), // Timestamp
      finalProvider, // Provider
      description, // Description
      email, // User Email
      "Pending", // Status
    ];

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SHEETS_CONFIG.SPREADSHEET_ID,
      range: targetSheet,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [rowData],
      },
    });

    const sheetName = targetSheet.split("!")[0];
    console.log(
      `Element suggestion saved to ${sheetName} sheet:`,
      response.data,
    );

    return {
      success: true,
      sheet: sheetName,
      userType: isAuthenticated ? "authenticated" : "anonymous",
    };
  } catch (error) {
    console.error("Failed to submit suggestion:", error);
    return { success: false, error: "SUBMISSION_FAILED" };
  }
}
