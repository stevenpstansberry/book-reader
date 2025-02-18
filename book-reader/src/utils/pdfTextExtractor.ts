export async function extractTextFromPDF(file: File): Promise<{ [key: number]: string }> {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      try {
        // Ensure this runs ONLY on the server
        if (typeof window !== "undefined") {
          reject(new Error("PDF text extraction must run on the server."));
          return;
        }

        // Dynamically import pdfjs-dist only when needed (server-side)
        const pdfjs = await import("pdfjs-dist");

        // Set the worker source manually
        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

        const typedArray = new Uint8Array(reader.result as ArrayBuffer);
        const pdf = await pdfjs.getDocument({ data: typedArray }).promise;

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
