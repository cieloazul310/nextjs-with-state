import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { act, render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CounterStoreProvider } from "@/providers/counter-store-provider";
import { Card } from "@/components/card";

const renderCard = () => {
  return render(
    <CounterStoreProvider>
      <Card />
    </CounterStoreProvider>,
  );
};

describe("Card", () => {
  beforeEach(() => {
    renderCard();
  });
  afterEach(cleanup);

  test("should render with initial state of 0", async () => {
    expect(await screen.findByText(/^0$/)).toBeInTheDocument();
    expect(
      await screen.findByRole("button", { name: /\+/i }),
    ).toBeInTheDocument();
  });

  test("should increase count by clicking a button", async () => {
    const user = userEvent.setup();

    expect(await screen.findByText(/^0$/)).toBeInTheDocument();

    await act(async () => {
      await user.click(await screen.findByRole("button", { name: /\+/i }));
    });

    expect(await screen.findByText(/^1$/)).toBeInTheDocument();
  });
});
