import {
  BookOpen,
  Briefcase,
  Check,
  GraduationCap,
  LockKeyhole,
  MessageCircle,
  MessageSquare,
  Sparkles,
  Upload,
  Users,
  Zap,
  FileText,
} from "lucide-react";

export const benefits = [
  { label: "Chat with any document", icon: MessageSquare },
  { label: "Summarize in seconds", icon: Sparkles },
  { label: "Cite sources with page numbers", icon: BookOpen },
  { label: "Fast, secure and private", icon: LockKeyhole },
];

export const features = [
  {
    icon: MessageSquare,
    title: "Chat with any document",
    text: "Ask questions and get answers grounded in the content you upload.",
    colorTheme: "violet",
  },
  {
    icon: Zap,
    title: "Summarize in seconds",
    text: "Turn long, dense documents into clear summaries and useful takeaways.",
    colorTheme: "amber",
  },
  {
    icon: BookOpen,
    title: "Source-backed answers",
    text: "See relevant excerpts and page numbers so you can verify every insight.",
    colorTheme: "teal",
  },
  {
    icon: LockKeyhole,
    title: "Your data stays private",
    text: "A privacy-first foundation for working with the documents that matter to you.",
    colorTheme: "rose",
  },
];

export const workflowSteps = [
  {
    number: "01",
    title: "Upload your PDF",
    text: "Drag and drop a report, paper, notes, or any document you want to understand.",
    icon: Upload,
  },
  {
    number: "02",
    title: "Let DocuMind process it",
    text: "We extract, organize, and index the content so you can search it naturally.",
    icon: Sparkles,
  },
  {
    number: "03",
    title: "Ask and explore",
    text: "Get clear answers with sources, summaries and insights you can trace back to the page.",
    icon: MessageCircle,
  },
];

export const useCases = [
  {
    title: "Students",
    text: "Understand textbooks, lecture notes and research papers faster.",
    icon: GraduationCap,
    colorTheme: "blue",
  },
  {
    title: "Researchers",
    text: "Analyze papers, extract findings and compare sources efficiently.",
    icon: FileText,
    colorTheme: "rose",
  },
  {
    title: "Professionals",
    text: "Work with reports, proposals and internal documents more efficiently.",
    icon: Briefcase,
    colorTheme: "amber",
  },
  {
    title: "Knowledge teams",
    text: "Share insights and collaborate with documents that matter to your team.",
    icon: Users,
    colorTheme: "purple",
  },
];

export const testimonials = [
  {
    quote: "DocuMind saved me hours of reading. The cited answers are incredibly helpful!",
    name: "Priya Sharma",
    role: "Computer Science Student",
    avatar: "/src/assets/avatars/priya.jpg",
    rating: 5,
  },
  {
    quote: "As a researcher, this is a game changer. I can summarize and compare papers in minutes.",
    name: "Rohit Mehta",
    role: "Research Scholar",
    avatar: "/src/assets/avatars/rohit.jpg",
    rating: 5,
  },
  {
    quote: "Our team uses DocuMind to go through long reports. It's fast, accurate and easy to use.",
    name: "Ananya Verma",
    role: "Product Manager",
    avatar: "/src/assets/avatars/ananya.jpg",
    rating: 5,
  },
];

export const pricingPlans = [
  {
    name: "Free",
    subtitle: "Perfect for getting started.",
    price: "₹0",
    period: "/ month",
    popular: false,
    ctaText: "Get started",
    ctaVariant: "ghost",
    features: [
      "5 documents per month",
      "Basic AI model",
      "Citations with page numbers",
      "Community support",
    ],
  },
  {
    name: "Pro",
    badge: "Most Popular",
    subtitle: "For students and professionals.",
    price: "₹499",
    period: "/ month",
    popular: true,
    ctaText: "Get Pro",
    ctaVariant: "primary",
    features: [
      "Unlimited documents",
      "Advanced AI models",
      "Faster processing",
      "Priority support",
      "Export summaries",
    ],
  },
  {
    name: "Team",
    subtitle: "For teams and organizations.",
    price: "₹1,499",
    period: "/ month",
    popular: false,
    ctaText: "Contact sales",
    ctaVariant: "ghost",
    features: [
      "Everything in Pro",
      "Team collaboration",
      "Shared workspaces",
      "Admin controls",
      "Dedicated support",
    ],
  },
];

export const faqsCol1 = [
  {
    question: "What types of documents are supported?",
    answer:
      "DocuMind currently supports PDF documents up to 50MB, including academic research papers, university textbooks, business reports, legal briefs, technical specifications, and lecture slides. We extract text, headings, tables, and page metadata cleanly.",
  },
  {
    question: "How accurate are the answers?",
    answer:
      "DocuMind uses advanced retrieval-augmented generation (RAG) to ground every answer strictly in the text of your uploaded document. We include exact page citations with every insight so you can click and verify against the source material directly.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Yes, your data is private and secure. All uploads and documents are encrypted both in transit and at rest. We never use your private documents to train public AI models, and you maintain complete ownership of your data at all times.",
  },
  {
    question: "Can I use it for commercial purposes?",
    answer:
      "Yes! Both our Pro and Team tiers include full commercial licensing for consultants, analysts, agencies, and businesses processing client and company documents.",
  },
];

export const faqsCol2 = [
  {
    question: "Do you offer a free plan?",
    answer:
      "Yes! Our free plan lets you try DocuMind with a limited number of documents per month. You can upgrade anytime for more usage and advanced features.",
    defaultOpen: true,
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Absolutely. There are no contracts or commitments. You can upgrade, downgrade, or cancel your subscription at any time with one click from your account settings.",
  },
  {
    question: "How does citation work?",
    answer:
      "When you ask a question, DocuMind pinpoints the exact sections and page numbers containing the relevant evidence. Clickable citation chips appear below each response, highlighting the exact reference page in the document viewer.",
  },
];

export { Check };
