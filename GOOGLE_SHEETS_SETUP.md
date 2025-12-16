# Google Sheets Feedback Integration Setup

Follow these steps to connect your feedback form to your Google Spreadsheet.

## Step 1: Open Your Google Spreadsheet

1. Go to your spreadsheet: https://docs.google.com/spreadsheets/d/1gYi5VQXdfaTvgZsYgTwsiGN3WimFYHu6slMn4Ze6-18/edit

2. Make sure you have the following headers in Row 1:
   - **A1**: Timestamp
   - **B1**: Name
   - **C1**: Email
   - **D1**: Rating
   - **E1**: Feedback Type
   - **F1**: Message

## Step 2: Create a Google Apps Script

1. In your Google Spreadsheet, go to **Extensions > Apps Script**

2. Delete any existing code and paste the following:

```javascript
function doPost(e) {
  try {
    // Parse the incoming data
    var data = JSON.parse(e.postData.contents);
    
    // Open the spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Append the data as a new row
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.name,
      data.email,
      data.rating,
      data.feedbackType,
      data.message
    ]);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Enable CORS for web requests
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ 'status': 'ready' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Click **Save** (💾 icon) and name your project (e.g., "Feedback Form Handler")

## Step 3: Deploy as Web App

1. Click **Deploy > New deployment**

2. Click the gear icon ⚙️ next to "Select type" and choose **Web app**

3. Configure the deployment:
   - **Description**: Feedback Form Handler
   - **Execute as**: Me
   - **Who has access**: **Anyone** (this allows your website to send data)

4. Click **Deploy**

5. If prompted, authorize the app:
   - Click **Authorize access**
   - Select your Google account
   - Click **Advanced** > **Go to [project name] (unsafe)**
   - Click **Allow**

6. **Copy the Web app URL** - it will look like:
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```

## Step 4: Add the URL to Your Environment

1. Open your `.env.local` file in the project root

2. Add the following line with your Web App URL:
   ```
   GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```

3. Restart your development server for the changes to take effect

## Step 5: Test the Integration

1. Go to `http://localhost:3000/feedback`
2. Fill out the form and submit
3. Check your Google Spreadsheet - the data should appear!

## Troubleshooting

### Data not appearing in spreadsheet?
- Make sure the Web App URL is correct in `.env.local`
- Check that the Apps Script is deployed with "Anyone" access
- Look at the browser console for any errors

### Getting CORS errors?
- Redeploy the Apps Script as a new version
- Make sure "Who has access" is set to "Anyone"

### Script authorization issues?
- Go to Apps Script > Settings > Check "Show 'appsscript.json' manifest file"
- Add the necessary OAuth scopes if needed

---

Your feedback form is now ready to collect responses directly to your Google Spreadsheet! 🎉
