import eslint from "@eslint/js";
import react from "eslint-plugin-react/configs/jsx-runtime.js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  eslint.configs.recommended,
  react,
  ...tseslint.configs.recommended,
  prettier,
);
