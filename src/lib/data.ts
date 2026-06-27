export const profile = {
  name: "Zeel Shah",
  title: "AI/ML Engineer | LLM Systems | MLOps | Backend Developer",
  tagline: "Building intelligent systems that transform data into decisions.",
  roles: [
    "AI Engineer",
    "ML Developer",
    "LLM Systems Builder",
    "Backend Engineer",
    "MLOps Enthusiast",
  ],
  socials: {
    github: "https://github.com/zeelshah1805",
    linkedin: "https://linkedin.com/in/zeel-shah-k5",
    email: "zeelshah1805@gmail.com",
    phone: "+91 9875119096",
  },
};

export const stats = [
  { label: "Months Experience", value: 5, suffix: "" },
  { label: "Production Systems Shipped", value: 3, suffix: "" },
  { label: "Portfolio Projects", value: 5, suffix: "" },
  { label: "Open Source Programs", value: 1, suffix: "" },
];

export const aboutSkills = [
  "AI/ML Developer",
  "Python Developer",
  "FastAPI",
  "LLM Systems",
  "Model Training",
  "MLOps",
  "Data Engineering",
];

export type SkillCategory = "AI/ML" | "Backend" | "MLOps" | "Frontend";

export const techStack: {
  category: SkillCategory;
  color: string;
  skills: { name: string; level: number }[];
}[] = [
  {
    category: "AI/ML",
    color: "#00D9FF",
    skills: [
      { name: "Python", level: 95 },
      { name: "PyTorch", level: 90 },
      { name: "TensorFlow", level: 82 },
      { name: "Scikit-Learn", level: 88 },
      { name: "Transformers", level: 90 },
      { name: "LangChain", level: 85 },
      { name: "OpenCV", level: 80 },
    ],
  },
  {
    category: "Backend",
    color: "#00FFAA",
    skills: [
      { name: "FastAPI", level: 92 },
      { name: "Django", level: 80 },
      { name: "Node.js", level: 78 },
      { name: "PostgreSQL", level: 85 },
      { name: "Redis", level: 80 },
    ],
  },
  {
    category: "MLOps",
    color: "#8B5CF6",
    skills: [
      { name: "Docker", level: 88 },
      { name: "Kubernetes", level: 75 },
      { name: "MLflow", level: 82 },
      { name: "Airflow", level: 78 },
      { name: "AWS", level: 80 },
      { name: "GCP", level: 76 },
    ],
  },
  {
    category: "Frontend",
    color: "#00D9FF",
    skills: [
      { name: "React", level: 85 },
      { name: "Next.js", level: 84 },
      { name: "TypeScript", level: 82 },
    ],
  },
];

export const experience = [
  {
    role: "Associate Software Engineer — AI/ML & Backend",
    org: "SixSigma Cloud Solutions",
    period: "Feb 2026 — Present",
    desc: "Build production LLM and backend systems in Ahmedabad. Shipped a recruitment automation engine: email-triggered CV ingestion, NLP-based candidate ranking, and automated interview scheduling, end-to-end.",
    tags: ["LLMs", "NLP", "FastAPI", "REST APIs", "SQL"],
  },
  {
    role: "Open Source Contributor",
    org: "GirlScript Summer of Code",
    period: "May — Aug 2024",
    desc: "Contributed code, fixes, and documentation to open-source projects during the GSSoC program.",
    tags: ["Python", "Open Source", "Community"],
  },
  {
    role: "Python Automation Intern",
    org: "SukEm TechLab",
    period: "May — Jun 2024",
    desc: "Built Python automation scripts and tooling to streamline repetitive data and workflow tasks.",
    tags: ["Python", "Automation", "Scripting"],
  },
];

export type ProjectCategory =
  | "LLMs"
  | "Computer Vision"
  | "MLOps"
  | "Backend"
  | "Data Science";

export const projects: {
  title: string;
  category: ProjectCategory;
  desc: string;
  stack: string[];
  github: string;
  demo: string;
  gradient: string;
}[] = [
  {
    title: "Multi-Agent Research System",
    category: "LLMs",
    desc: "Orchestrated multi-agent pipeline where a planner agent decomposes a query, parallel worker agents search and analyze, and a synthesizer produces cited answers — with agent memory, retries, and per-run tracing. Scored 4.3/5 vs 3.1/5 for a single-agent baseline on a 20-question eval harness.",
    stack: ["LangGraph", "Langfuse", "Groq", "FastAPI", "Streamlit"],
    github: "https://github.com/zeelshah1805",
    demo: "#",
    gradient: "from-indigo-500/30 to-violet-600/20",
  },
  {
    title: "Advanced RAG Pipeline",
    category: "LLMs",
    desc: "Production RAG with hybrid search (BM25 + embeddings), query decomposition, cross-encoder reranking, and a citation system. Each component is a deliberate fix for a naive-RAG failure mode, proven with a RAGAS ablation table.",
    stack: ["LangChain", "FAISS", "RAGAS", "Cohere", "BM25"],
    github: "https://github.com/zeelshah1805",
    demo: "#",
    gradient: "from-cyan-500/30 to-blue-600/20",
  },
  {
    title: "LLM Fine-tuning + Eval Framework",
    category: "MLOps",
    desc: "QLoRA fine-tuning of a small open-source model on a domain task, plus a custom evaluation suite comparing base vs. fine-tuned across precision, hallucination rate, and task accuracy — trained free on Colab/Kaggle T4.",
    stack: ["QLoRA", "PEFT", "HuggingFace", "Transformers", "PyTorch"],
    github: "https://github.com/zeelshah1805",
    demo: "#",
    gradient: "from-fuchsia-500/30 to-pink-600/20",
  },
  {
    title: "AI Observability Dashboard",
    category: "MLOps",
    desc: "FastAPI service that instruments every LLM call for token cost, latency percentiles, error rates, and prompt-version performance, with a live dashboard and Prometheus metrics. Used to catch a prompt regression and cut p95 latency 34%.",
    stack: ["FastAPI", "Streamlit", "Prometheus", "Langfuse", "Docker"],
    github: "https://github.com/zeelshah1805",
    demo: "#",
    gradient: "from-violet-500/30 to-purple-600/20",
  },
  {
    title: "Recruitment Automation Engine",
    category: "Backend",
    desc: "Production agentic workflow shipped at SixSigma: email-triggered CV ingestion, NLP-based candidate ranking, and automated interview scheduling — end-to-end from inbox to calendar.",
    stack: ["Python", "LLM", "NLP", "REST APIs", "SQL"],
    github: "https://github.com/zeelshah1805",
    demo: "#",
    gradient: "from-emerald-500/30 to-teal-600/20",
  },
];

export const projectCategories: (ProjectCategory | "All")[] = [
  "All",
  "LLMs",
  "MLOps",
  "Backend",
];

export const achievements = [
  { label: "Production Systems", value: 3, suffix: "" },
  { label: "Portfolio Projects", value: 5, suffix: "" },
  { label: "Open Source Programs", value: 1, suffix: "" },
  { label: "Months Experience", value: 5, suffix: "" },
];

export const labMetrics = {
  accuracy: 98.3,
  precision: 97.1,
  recall: 96.4,
  f1: 96.7,
  confusion: [
    [142, 3, 1, 0],
    [2, 138, 4, 1],
    [0, 5, 151, 2],
    [1, 0, 3, 147],
  ],
};
