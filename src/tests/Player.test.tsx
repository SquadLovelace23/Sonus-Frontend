import React from "react";
import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import Player from "../components/Player/Player";
import { useLocation as actualUseLocation } from "react-router-dom";

const mockSetSong = jest.fn();

jest.mock("../services/song.service", () => ({
  getAllSongs: jest.fn(),
  getLikedSongsByUserId: jest.fn(),
  getSongByAlbum: jest.fn(),
  getSongByArtist: jest.fn(),
  getSongByGenre: jest.fn(),
  getSongByPlaylist: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
}));

jest.mock("../context/PlayerContext", () => ({
  usePlayer: () => ({
    currentSong: {
      url: "mocked-audio-url",
    },
    setSong: mockSetSong,
    isShuffled: false,
  }),
}));

describe("Player component", () => {
  test("renders play, pause, forward and previous buttons", (done) => {
    const mockLocation = {
      search: "?mock=query",
      state: { mockState: true },
      hash: "#mock-hash",
    };

    (actualUseLocation as jest.Mock).mockImplementation(() => mockLocation);

    const { getByLabelText } = render(<Player />);

    const playPauseBtn = getByLabelText("Play");
    const forwardBtn = getByLabelText("Skip");
    const previousBtn = getByLabelText("Previous");

    expect(playPauseBtn).toBeInTheDocument();
    expect(forwardBtn).toBeInTheDocument();
    expect(previousBtn).toBeInTheDocument();

    fireEvent.click(playPauseBtn);
    fireEvent.click(forwardBtn);
    fireEvent.click(previousBtn);

    setTimeout(() => {
      expect(mockSetSong).toHaveBeenCalledTimes(1);
      done();
    }, 0);

    const progress = getByLabelText("Audio progress control").textContent;
    expect(progress).toEqual("");

    const volume = getByLabelText("Volume control").textContent;
    expect(volume).toEqual("");
  });
});
