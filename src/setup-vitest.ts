// src/setup-vitest.ts

import { vi } from "vitest";
import "@testing-library/jest-dom/vitest";

vi.mock("zustand"); // to make it works like Jest (auto-mocking)
