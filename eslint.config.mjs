import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [".next/**", "out/**", "build/**", "dist/**", "node_modules/**", "next-env.d.ts"],
  },
  {
    /* `react/no-unescaped-entities` flags every `'` and `"` in JSX
       text. The Compass codebase is content-heavy (MDX-style demos,
       editorial copy) and quotes are unavoidable. The rule catches
       no real bugs — modern browsers render entity-literal and
       unescaped characters identically. Disabled so `next build`
       stays green with `eslint.ignoreDuringBuilds: false` while
       ESLint continues catching genuinely useful issues (unused
       vars, missing hook deps, exhaustive-deps, etc.). */
    rules: {
      "react/no-unescaped-entities": "off",
    },
  },
];

export default eslintConfig;
