
import * as mammoth from "mammoth";

export async function parseDocxText(buffer: Buffer): Promise<string> {
    console.log("[docxTextParser] Starting DOCX text extraction...");

    try {
        const result = await mammoth.extractRawText({ buffer: buffer });
        const text = result.value;
        const messages = result.messages;

        if (messages.length > 0) {
            console.log("[docxTextParser] Messages:", messages);
        }

        console.log("[docxTextParser] DOCX parsed successfully. Length:", text.length);
        return text;
    } catch (error) {
        console.error("[docxTextParser] Error parsing DOCX:", error);
        return "";
    }
}
