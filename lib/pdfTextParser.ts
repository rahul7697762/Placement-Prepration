import PDFParser from "pdf2json";

export async function parsePdfText(buffer: Buffer): Promise<string> {
    console.log("[pdfTextParser] Starting PDF text extraction with pdf2json...");
    console.log("[pdfTextParser] Buffer size:", buffer.length, "bytes");

    return new Promise((resolve) => {
        try {
            const pdfParser = new PDFParser(null, true); // true = don't combine text

            pdfParser.on("pdfParser_dataError", (errData: any) => {
                console.error("[pdfTextParser] PDF Parse Error:", errData.parserError);
                resolve(""); // Return empty string on error, don't crash
            });

            pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
                try {
                    // Extract text from all pages
                    let fullText = "";

                    if (pdfData?.Pages) {
                        for (const page of pdfData.Pages) {
                            if (page?.Texts) {
                                for (const textItem of page.Texts) {
                                    if (textItem?.R) {
                                        for (const run of textItem.R) {
                                            if (run?.T) {
                                                // Decode URI-encoded text
                                                const decodedText = decodeURIComponent(run.T);
                                                fullText += decodedText + " ";
                                            }
                                        }
                                    }
                                }
                                fullText += "\n"; // New line after each page
                            }
                        }
                    }

                    // Clean up extra whitespace
                    fullText = fullText
                        .replace(/\s+/g, " ")
                        .replace(/\n\s+/g, "\n")
                        .trim();

                    console.log("[pdfTextParser] PDF parsed successfully");
                    console.log("[pdfTextParser] Number of pages:", pdfData?.Pages?.length || 0);
                    console.log("[pdfTextParser] Text length:", fullText.length);
                    console.log("[pdfTextParser] First 200 chars:", fullText.substring(0, 200));

                    resolve(fullText);
                } catch (extractError) {
                    console.error("[pdfTextParser] Text extraction error:", extractError);
                    resolve("");
                }
            });

            // Parse the buffer
            pdfParser.parseBuffer(buffer);

        } catch (error) {
            console.error("[pdfTextParser] Fatal error:", error);
            resolve(""); // Return empty string, never crash
        }
    });
}
