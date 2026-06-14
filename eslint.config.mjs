import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  // Keep the starter on the flat config export that actually runs under the pinned ESLint/Next toolchain.
  // NOTE: eslint-plugin-jsx-a11y is included by eslint-config-next/core-web-vitals and its recommended
  // rules are already active (e.g., anchor-is-valid, alt-text). We do not import it again to avoid
  // "Cannot redefine plugin" config errors.
  ...nextCoreWebVitals,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "**/_archive/**"]),
]);
