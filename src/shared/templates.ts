export interface Template {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  githubUrl?: string;
  isOfficial: boolean;
}

export const DEFAULT_TEMPLATE_ID = "scratch";

export const templatesData: Template[] = [
  {
    id: "scratch",
    title: "Start from Scratch",
    description:
      "An empty project. Add any files, frameworks, or tools you want. No boilerplate included.",
    imageUrl:
      "https://ps.w.org/super-blank/assets/banner-1544x500.png?rev=3179041",
    isOfficial: true,
  },
  {
    id: "optima-ai",
    title: "Optima AI by HansTech",
    description:
      "Optima AI is an advanced, multi-model conversational AI platform, supporting multiple providers including xAI, Gemini, Mistral, Groq, and more.",
    imageUrl:
      "https://github.com/Hansade2005/optima/raw/main/app/(chat)/opengraph-image.png",
    githubUrl: "https://github.com/Hansade2005/optima",
    isOfficial: true,
  },
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
    id: "qrgpt",
    title: "qrGPT – AI QR Code Generator",
    description:
      "QrGPT is an AI tool for you to generate beautiful QR codes using AI with one click. Powered by Vercel and Replicate.",
    imageUrl:
      "https://vercel.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F48ot6w4zzULMpPF7frPIdJ%2F381fb11e4ec64459c359b8c55b139bb2%2FCleanShot_2023-09-22_at_15.38.23_2x.png&w=1920&q=75",
    githubUrl: "https://github.com/nutlope/qrGPT",
    isOfficial: true,
  },
  {
    id: "ecommerce-remix-crystallize",
    title: "Ecommerce Template with Crystallize and Remix",
    description:
      "A fully-featured eCommerce boilerplate built using Remix and Crystallize with performance in mind.",
    imageUrl:
      "https://vercel.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F1Pifbeel3gAM5CeLg8Ay0B%2F3e728c6bf7cb01b7518e31e25cd7bb1b%2FScreenshot_2023-05-10_at_20.16.14_-_Veljko_Simakovic.png&w=1920&q=75",
    githubUrl: "https://github.com/CrystallizeAPI/furniture-remix",
    isOfficial: true,
  },
  {
    id: "finwise-landing-page",
    title: "Finwise: SaaS Landing Page",
    description:
      "Lightweight, easy to customize landing page template for SaaS, built with Next.js and Tailwind.",
    imageUrl:
      "https://vercel.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F3mWrk0YjcDMlhdk7OR5SEc%2F2ea03a8ac3a5f751adb43b066cf1da9b%2Ffinwise-thumbnail.png&w=1920&q=75",
    githubUrl: "https://github.com/nexi-launch/finwise-landing-page",
    isOfficial: true,
  },
  {
    id: "odyssey",
    title: "Odyssey",
    description:
      "A modern, full-featured theme for a business or startup marketing site.",
    imageUrl:
      "https://vercel.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F1CXqjlGU4uJ9UMoOfsB1wD%2Fb386044c1f4833ea73670af2852dc718%2Fodyssey-hero_-_Tony_Sullivan.png&w=1920&q=75",
    githubUrl: "https://github.com/treefarmstudio/odyssey-theme",
    isOfficial: true,
  },
  {
    id: "spotify-astro-transitions",
    title: "Spotify Clone with Astro View Transitions",
    description:
      "Spotify clone built with Astro View Transitions integration for fluid navigation + TailwindCSS + Svelte.",
    imageUrl:
      "https://vercel.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F59uwliGeS8XoE5nHRBEsfI%2F2232d50cdddae956828ddb501ff2d993%2FCleanShot_2023-09-05_at_16.13.01_2x.png&w=1920&q=75",
    githubUrl: "https://github.com/igorm84/spotify-astro-transitions",
    isOfficial: true,
  },
  {
    id: "simple-php-website-template",
    title: "Simple PHP Website Template",
    description:
      "A simple web site template based on PHP. Features: Routing scheme (domain.com/), 404 mapping, basic structure with CSS/JS, authentication (name/email/password), can be used without a database.",
    imageUrl:
      "https://www.devopsschool.com/blog/wp-content/uploads/2022/03/php-programming-language.jpg",
    githubUrl: "https://github.com/berndlutz/simple-php-website-template",
    isOfficial: true,
  },
  {
    id: "ngx-admin",
    title: "ngx-admin (Angular Dashboard)",
    description: "Customizable admin dashboard template based on Angular 10+.",
    imageUrl:
      "https://camo.githubusercontent.com/9c0b763c3804abdfd5057f146d2c056108a96a896cd4e4c0cfdd6503269ebd04/68747470733a2f2f692e696d6775722e636f6d2f6d4664717667472e706e67",
    githubUrl: "https://github.com/akveo/ngx-admin",
    isOfficial: true,
  },
  {
    id: "nuxt3-awesome-starter",
    title: "Nuxt 3 Awesome Starter",
    description:
      "A Nuxt 3 template and boilerplate with a lot of useful features. Nuxt 3 + Tailwindcss + Nuxt Layer.",
    imageUrl:
      "https://github.com/viandwi24/nuxt3-awesome-starter/raw/v2/assets/images/banner.png",
    githubUrl: "https://github.com/viandwi24/nuxt3-awesome-starter",
    isOfficial: true,
  },
  {
    id: "react-native-boilerplate",
    title: "React Native Boilerplate",
    description:
      "Optimized architecture for cross-platform mobile apps with clear separation of UI and business logic. Fully documented for easy understanding and use.",
    imageUrl:
      "https://github.com/thecodingmachine/react-native-boilerplate/raw/main/documentation/static/img/tom-github-banner.png",
    githubUrl: "https://github.com/thecodingmachine/react-native-boilerplate",
    isOfficial: true,
  },
  {
    id: "expo-local-first-template",
    title: "Expo Local-first Template",
    description:
      "A template for your local-first Expo project: Bun, Expo 53, TypeScript, TailwindCSS, DrizzleORM, Sqlite, EAS, GitHub Actions, Env Vars, expo-router, react-hook-form.",
    imageUrl:
      "https://github.com/expo-starter/expo-local-first-template/raw/main/assets/github-banner.png?raw=true",
    githubUrl: "https://github.com/expo-starter/expo-local-first-template",
    isOfficial: true,
  },
  {
    id: "flask-vuejs-template",
    title: "Flask + Vue.js Web Application Template",
    description:
      "A Flask + Vue.js web application template for full-stack development.",
    imageUrl:
      "https://github.com/gtalarico/flask-vuejs-template/raw/master/docs/vue-logo.png",
    githubUrl: "https://github.com/gtalarico/flask-vuejs-template",
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
