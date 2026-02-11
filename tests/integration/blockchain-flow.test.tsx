import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";

describe("blockchain flow", () => {
  it("renders initial chain and mines new block", async () => {
    render(<Home />);
    expect(await screen.findByText("Blockchain Visualizer")).toBeInTheDocument();
    await screen.findByText("Block #0");
    const autoMineCountInput = screen.getByLabelText("Auto mine count input");
    await userEvent.clear(autoMineCountInput);
    await userEvent.type(autoMineCountInput, "1");
    const difficultySelector = screen.getByLabelText("Select mining difficulty");
    await userEvent.selectOptions(difficultySelector, "1");
    const input = screen.getByLabelText("Block data input");
    await userEvent.clear(input);
    await userEvent.type(input, "Alice pays Bob 10");
    const mineButton = screen.getByLabelText("Mine block button");
    await userEvent.click(mineButton);
    await waitFor(
      () => {
        const hasProgressLabel = screen.queryByText("Mining...") !== null;
        const hasMinedBlock = screen.queryByText("Block #1") !== null;
        expect(hasProgressLabel || hasMinedBlock).toBe(true);
      },
      { timeout: 1000 },
    );
    await waitFor(
      () => {
        expect(screen.getByText("Block #1")).toBeInTheDocument();
      },
      { timeout: 15000 },
    );
  });

  it("marks chain invalid after inline tamper edit", async () => {
    render(<Home />);
    await screen.findByText("Block #0");
    const editButton = await screen.findByLabelText("Edit block 0");
    await userEvent.click(editButton);
    const input = screen.getByLabelText("Edit block 0 data");
    await userEvent.clear(input);
    await userEvent.type(input, "Tampered data");
    await userEvent.click(screen.getByLabelText("Save block 0 edit"));
    await waitFor(() => {
      expect(screen.getByText("Chain Invalid")).toBeInTheDocument();
    });
  });
});
