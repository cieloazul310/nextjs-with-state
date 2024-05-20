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
  afterEach(() => {
    cleanup();
    sessionStorage.clear();
  });

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
      await user.click(await screen.findByRole("button", { name: /^\+$/ }));
    });

    expect(await screen.findByText(/^1$/)).toBeInTheDocument();
  });

  test("increase, decrease and reset", async () => {
    const user = userEvent.setup();
    const increaseButton = await screen.findByRole("button", { name: /^\+$/ });
    const decreaseButton = await screen.findByRole("button", { name: /^-$/ });
    const resetButton = await screen.findByRole("button", { name: /^Reset$/ });

    expect(await screen.findByText(/^0$/)).toBeInTheDocument();

    await act(async () => {
      await user.click(increaseButton);
      await user.click(increaseButton);
      await user.click(increaseButton);
    });
    expect(await screen.findByText(/^3$/)).toBeInTheDocument();

    await act(async () => {
      await user.click(decreaseButton);
    });
    expect(await screen.findByText(/^2$/)).toBeInTheDocument();

    await act(async () => {
      await user.click(resetButton);
    });
    expect(await screen.findByText(/^0$/)).toBeInTheDocument();
  });
});
