import { NextRequest, NextResponse } from 'next/server';

// Google Apps Script Web App URL for Google Sheets integration
// You'll need to replace this with your actual Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL || '';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        // Validate required fields
        if (!data.name || !data.email || !data.message || !data.rating) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // If Google Script URL is configured, send data to Google Sheets
        if (GOOGLE_SCRIPT_URL) {
            try {
                const response = await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: data.name,
                        email: data.email,
                        rating: data.rating,
                        feedbackType: data.feedbackType,
                        message: data.message,
                        timestamp: data.timestamp || new Date().toISOString()
                    }),
                });

                if (!response.ok) {
                    console.error('Failed to send to Google Sheets:', await response.text());
                }
            } catch (sheetError) {
                console.error('Error sending to Google Sheets:', sheetError);
                // Continue even if Google Sheets fails - we don't want to block the user
            }
        } else {
            // Log feedback for debugging when no Google Script URL is configured
            console.log('Feedback received (Google Script URL not configured):', data);
        }

        return NextResponse.json(
            { message: 'Feedback submitted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error processing feedback:', error);
        return NextResponse.json(
            { error: 'Failed to process feedback' },
            { status: 500 }
        );
    }
}
