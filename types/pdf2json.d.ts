declare module "pdf2json" {
    interface TextRun {
        T: string;
        S?: number;
        TS?: number[];
    }

    interface TextItem {
        R: TextRun[];
        x?: number;
        y?: number;
        w?: number;
    }

    interface Page {
        Texts: TextItem[];
        Width?: number;
        Height?: number;
    }

    interface PDFData {
        Pages: Page[];
        Meta?: {
            Title?: string;
            Author?: string;
            Subject?: string;
            Creator?: string;
            Producer?: string;
        };
    }

    interface ParserError {
        parserError: string;
    }

    class PDFParser {
        constructor(context?: any, verbosity?: boolean);

        on(event: "pdfParser_dataReady", callback: (pdfData: PDFData) => void): void;
        on(event: "pdfParser_dataError", callback: (errData: ParserError) => void): void;

        parseBuffer(buffer: Buffer): void;
        loadPDF(pdfFilePath: string): void;

        getRawTextContent(): string;
    }

    export = PDFParser;
}
