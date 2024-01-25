import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Searchbar from "../components/Searchbar/Searchbar";
import { PlayerProvider } from "../context/PlayerContext";
import "@testing-library/jest-dom";
import { UserContextProvider } from "../context/UserContext";

jest.mock("@auth0/auth0-react", () => ({
  useAuth0: jest.fn(() => ({
    getAccessTokenSilently: jest.fn(() => "mocked-access-token"),
  })),
}));

jest.mock("swiper/modules", () => ({
  Navigation: {
    __esModule: true,
    default: jest.fn(),
  },
}));

jest.mock("swiper/react", () => ({
  __esModule: true,
  Swiper: ({ children }: any) => (
    <div className="mocked-swiper">{children}</div>
  ),
  SwiperSlide: ({ children }: any) => (
    <div className="mocked-swiper-slide">{children}</div>
  ),
}));

jest.mock("../services/song.service", () => ({
  getAllSongs: jest.fn(() => Promise.resolve([])),
}));

jest.mock("../services/playlist.service", () => ({
  getAllPlaylists: jest.fn(() => Promise.resolve([])),
}));

jest.mock("../services/user.service", () => ({
  getAllUsers: jest.fn(() => Promise.resolve([])),
}));

describe("Searchbar Component", () => {
  it("renders search results correctly for playlists and songs", async () => {
    const mockPlaylists = [
      { id: 1, name: "Mi carro", cover: "playlist-cover.jpg" },
    ];

    const mockSongs = [
      {
        id: 1,
        name: "Mi carro",
        cover: "song-cover.jpg",
        Artist: [{ name: "Artist1" }],
        Album: [{ name: "Album1" }],
      },
    ];

    require("../services/song.service").getAllSongs.mockResolvedValue(
      mockSongs
    );
    require("../services/playlist.service").getAllPlaylists.mockResolvedValue(
      mockPlaylists
    );

    render(
      <UserContextProvider>
        <PlayerProvider>
          <Router>
            <Searchbar />
          </Router>
        </PlayerProvider>
      </UserContextProvider>
    );

    const searchInput = screen.getByPlaceholderText("Search...");
    fireEvent.change(searchInput, { target: { value: "Mi carro" } });
    await waitFor(() => {
      waitFor(() => expect(screen.getByText("Playlists")).toBeInTheDocument());
      waitFor(() =>
        expect(screen.getAllByText("Mi carro")).toBeInTheDocument()
      );
      waitFor(() => expect(screen.getByText("All songs")).toBeInTheDocument());
    });
  });
});
