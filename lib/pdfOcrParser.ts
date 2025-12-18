// OCR parsing is disabled - this is a stub that returns empty string
// OCR requires additional system dependencies (Tesseract) that may not be available

export async function parsePdfWithOCR(buffer: Buffer): Promise<string> {
    console.log("[pdfOcrParser] OCR is disabled - returning empty string");
    return "";
}
