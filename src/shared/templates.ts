export interface Template {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  githubUrl?: string;
  isOfficial: boolean;
}

export const DEFAULT_TEMPLATE_ID = "react";

export const templatesData: Template[] = [
  {
    id: "react",
    title: "React.js Template",
    description: "Uses React.js, Vite, Shadcn, Tailwind and TypeScript.",
    imageUrl:
      "https://github.com/user-attachments/assets/5b700eab-b28c-498e-96de-8649b14c16d9",
    isOfficial: true,
  },
  {
    id: "next",
    title: "Next.js Template",
    description: "Uses Next.js, React.js, Shadcn, Tailwind and TypeScript.",
    imageUrl:
      "https://github.com/user-attachments/assets/96258e4f-abce-4910-a62a-a9dff77965f2",
    githubUrl: "https://github.com/dyad-sh/nextjs-template",
    isOfficial: true,
  },
  {
    id: "angular",
    title: "Angular Template",
    description: "Uses Angular, Vite, Shadcn, Tailwind and TypeScript.",
    imageUrl:
      "https://private-user-images.githubusercontent.com/211942879/462262085-9f8a86e9-2625-4cdf-9e47-c3b0d615cf4d.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTM0MDIzODgsIm5iZiI6MTc1MzQwMjA4OCwicGF0aCI6Ii8yMTE5NDI4NzkvNDYyMjYyMDg1LTlmOGE4NmU5LTI2MjUtNGNkZi05ZTQ3LWMzYjBkNjE1Y2Y0ZC5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUwNzI1JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MDcyNVQwMDA4MDhaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1hYWE4MjVjZmE3M2NjMTRmMjdjMmU0OWViMjYzNjc1NGFmMThlZGZmNzg0NDg5OTlhOGJkYTAxOWE4M2ZhMjEzJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.HthoHiWIcMyIESdnE-89t5zN6kgVdZ9fixmD6FSu8j4",
    githubUrl: "https://github.com/Jeff-Kazzee/Dyad-Template-Angular",
    isOfficial: true,
  },
];

export function getTemplateOrThrow(templateId: string): Template {
  const template = templatesData.find((template) => template.id === templateId);
  if (!template) {
    throw new Error(`Template ${templateId} not found`);
  }
  return template;
}
