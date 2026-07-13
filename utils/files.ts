import path from 'path';

export const IMGUI = path.resolve(process.cwd(), 'Files', 'ImgUI.png');
export const PDFUI = path.resolve(process.cwd(), 'Files', 'PdfUI.pdf');
export const IMGStory = path.resolve(process.cwd(), 'Files', 'ImgStory.png');
export const PDFStory = path.resolve(process.cwd(), 'Files', 'PdfStory.pdf');
export const csvFile = path.resolve(process.cwd(), 'Files', 'createProject().csv');

export function parseCSV(content: string): string[][] {
    const rows: string[][] = [];
    let row: string[] = [];
    let field = '';
    let inQuotes = false;

    for (let i = 0; i < content.length; i++) {
        const char = content[i];
        if (char === '"') {
            if (inQuotes && content[i + 1] === '"') {
                field += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            row.push(field);
            field = '';
        } else if (char === '\r' && !inQuotes) {
            if (content[i + 1] === '\n') i++;
            row.push(field);
            rows.push(row);
            row = [];
            field = '';
        } else if (char === '\n' && !inQuotes) {
            row.push(field);
            rows.push(row);
            row = [];
            field = '';
        } else {
            field += char;
        }
    }

    if (row.length > 0 || field !== '') {
        row.push(field);
        rows.push(row);
    }

    return rows;
}