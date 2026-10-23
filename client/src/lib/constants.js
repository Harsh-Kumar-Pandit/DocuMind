import {
  BookOpen,
  Check,
  LockKeyhole,
  MessageCircle,
  Sparkles,
  Upload,
  Zap,
} from "lucide-react";

export const benefits = [
  ["Chat with PDFs", MessageCircle],
  ["Summarize and extract insights", Sparkles],
  ["Cite sources with page numbers", BookOpen],
  ["Fast, secure and private", LockKeyhole],
];

export const features = [
  {
    icon: MessageCircle,
    title: "Chat with any document",
    text: "Ask questions and get answers grounded in the content you upload.",
  },
  {
    icon: Zap,
    title: "Summarize in seconds",
    text: "Turn long, dense documents into clear summaries and useful takeaways.",
  },
  {
    icon: BookOpen,
    title: "Source-backed answers",
    text: "See relevant excerpts and page numbers so you can verify every insight.",
  },
  {
    icon: LockKeyhole,
    title: "Your data stays private",
    text: "A privacy-first foundation for working with the documents that matter to you.",
  },
];

export const workflowSteps = [
  [
    "01",
    "Upload your PDF",
    "Drop in a report, paper, or any document you want to understand.",
    Upload,
  ],
  [
    "02",
    "Let DocuMind process it",
    "We organize the content so you can search it naturally.",
    Sparkles,
  ],
  [
    "03",
    "Ask and explore",
    "Get clear answers with sources you can trace back to the page.",
    MessageCircle,
  ],
];

export const faqs = [
  [
    "What types of documents can I upload?",
    "DocuMind is designed for PDF documents, including research papers, reports, notes, and other text-heavy files.",
  ],
  [
    "How does document-based chat work?",
    "DocuMind processes the text in your document so you can ask natural-language questions and explore answers grounded in that content.",
  ],
  [
    "Can I see the sources behind an answer?",
    "Yes. The product experience is designed to show relevant page numbers and excerpts alongside answers.",
  ],
  [
    "Can I return to my documents later?",
    "Document history and saved workspaces are planned for a future version. This public page previews the product direction.",
  ],
  [
    "Is DocuMind free?",
    "A free plan is planned for launch. Paid plans and billing details will be shared when they are ready.",
  ],
];

export { Check };
