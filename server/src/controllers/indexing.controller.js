import prisma from "../config/db.js"
import { extractPdfText } from "../services/pdf.services.js"

export async function extractDocument(req, res) {
    const { id } = req.params;

    let document;

    try {
        document = await prisma.document.findUnique({
            where: { id },
        })

        if (!document) {
            return res.status(404).json({
                message: "Document not found.",
            })
        }

        await prisma.document.update({
            where: { id },
            data: { status: "PROCESSING", errorMessage: null }
        })

        const filePath = `uploads/${document.filename}`
        const extracted = await extractPdfText(filePath)

        return res.json({
            message: "PDF text extracted successfully.",
            documentId: id,
            pageCount: extracted.pageCount,
            pages: extracted.pages,
        })
    } catch (error) {
        console.error("PDF extraction failed:", error)

        if (document) {
            await prisma.document.update({
                where: { id },
                data: {
                    status: "FAILED",
                    errorMessage: "PDF text extraction failed."
                }
            }).catch(() => {})
        }

        return res.status(500).json({
            message: "Could not extract PDF text."        
        })
    }
}