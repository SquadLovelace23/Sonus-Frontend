import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Player from "../components/Player/Player";
import { useLocation as actualUseLocation } from 'react-router-dom';

jest.mock('../services/song.service');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), 
  useLocation: jest.fn(),
}));

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
    const mockLocation = {
      pathname: "/mock-path",
      search: "?mock=query",
      state: { mockState: true },
      hash: "#mock-hash",
    };

    (actualUseLocation as jest.Mock).mockImplementation(() => mockLocation);
    
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
