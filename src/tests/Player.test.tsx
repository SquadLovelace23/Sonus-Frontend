import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
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
    const { getByLabelText } = render(<Player />);

    const playPauseBtn = getByLabelText("Play");
    const forwardBtn = getByLabelText("Skip");
    const previousBtn = getByLabelText("Previous");

    fireEvent.click(playPauseBtn);
    fireEvent.click(forwardBtn);
    fireEvent.click(previousBtn);

    screen.debug();
  });
});
