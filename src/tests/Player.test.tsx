import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Player from "../components/Player/Player";

jest.mock("../context/PlayerContext", () => ({
  usePlayer: () => ({
    currentSong: {
      url: "mocked-audio-url",
    },
    setSong: jest.fn(),
    isShuffled: false,
  }),
}));

describe("Player component", () => {
  test("renders play, pause, forward and previous buttons", () => {
    render(<Player />);

    screen.debug();
  });
});
