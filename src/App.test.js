import { render, screen } from "@testing-library/react";
import axios from "axios";
import App from "./App";

jest.mock("axios", () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

window.HTMLElement.prototype.scrollIntoView = jest.fn();

test("renders finance dashboard welcome heading", async () => {
  axios.get
    .mockResolvedValueOnce({
      data: {
        totalIncome: 0,
        totalExpense: 0,
        netBalance: 0,
        totalTransactions: 0,
        categoryCount: 0,
      },
    })
    .mockResolvedValueOnce({ data: [] })
    .mockResolvedValueOnce({ data: [] })
    .mockResolvedValueOnce({ data: [] })
    .mockResolvedValueOnce({ data: [] });

  render(<App />);

  expect(screen.getByText(/financial summary/i)).toBeInTheDocument();
  expect(await screen.findByText(/ask your data/i)).toBeInTheDocument();
});
