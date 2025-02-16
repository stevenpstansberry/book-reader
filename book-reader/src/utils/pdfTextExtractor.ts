import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

// Manually specify the same worker as @react-pdf-viewer/core
GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

// Function to extract text from a given PDF file
export async function extractTextFromPDF(file: File): Promise<{ [key: number]: string }> {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      try {
        const typedArray = new Uint8Array(reader.result as ArrayBuffer);
        const pdf = await getDocument({ data: typedArray }).promise;

        const textByPage: { [key: number]: string } = {};

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          
          // Extract text items and join them
          const pageText = textContent.items.map((item: any) => item.str).join(" ");
          textByPage[pageNum] = pageText;
        }

        resolve(textByPage);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error("Failed to read the file"));
    reader.readAsArrayBuffer(file);
  });
}
