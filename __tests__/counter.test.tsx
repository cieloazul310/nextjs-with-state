import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { act, render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Counter } from "@/components/vitest-example/counter";

const renderCounter = () => {
  return render(<Counter />);
};

describe("Counter", () => {
  beforeEach(() => {
    renderCounter();
  });
  afterEach(cleanup);

  test("should render with initial state of 1", async () => {
    expect(await screen.findByText(/^1$/)).toBeInTheDocument();
    expect(
      await screen.findByRole("button", { name: /one up/i }),
    ).toBeInTheDocument();
  });

  test("should increase count by clicking a button", async () => {
    const user = userEvent.setup();

    expect(await screen.findByText(/^1$/)).toBeInTheDocument();

    await act(async () => {
      await user.click(await screen.findByRole("button", { name: /one up/i }));
    });

    expect(await screen.findByText(/^2$/)).toBeInTheDocument();
  });
});
