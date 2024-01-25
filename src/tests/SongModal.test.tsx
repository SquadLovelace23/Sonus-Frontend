import React from "react";
import { screen, render, fireEvent, waitFor } from "@testing-library/react";
import AddSongModal from "../components/AddSongModal/AddSongModal";

jest.mock("../services/playlist.service", () => ({
  addSongToPlaylist: jest.fn(),
  deleteSongFromPlaylist: jest.fn(),
}));

describe("AddSongModal component", () => {
  it("should add a song to the playlist when onSubmit is called", async () => {
    const mockAddSongToPlaylist = jest.fn(() => true);

    const { getByText } = render(
      <AddSongModal
        song={{
          id: "song123",
          name: "Song Name",
          url: "https://example.com/song.mp3",
          cover: "https://example.com/cover.jpg",
          isLiked: true,
          Artist: [{ id: "artistid", name: "Artist Name", img: "artist.jpg" }],
          Album: [
            {
              id: "albumid",
              name: "Album Name",
              cover: "album.jpg",
              liked: false,
              artist: ["Artist"],
              Artist: [
                { id: "artistid", name: "Artist Name", img: "artist.jpg" },
              ],
              Album: [],
            },
          ],
          Song: [
            {
              id: "songid",
              name: "Song Name",
              url: "song.mp3",
              cover: "song.jpg",
              isLiked: false,
              Artist: [
                { id: "artistid", name: "Artist Name", img: "artist.jpg" },
              ],
              Album: [],
              Song: [],
            },
          ],
        }}
        updateSong={() => {}}
      />
    );

    fireEvent.click(getByText("Open Modal"));

    fireEvent.click(getByText("Playlist 1"));
    screen.debug();

    await waitFor(() => {
      expect(mockAddSongToPlaylist).toHaveBeenCalledWith(
        "selectedPlaylistId",
        "song123",
        "user123",
        "mocked-token"
      );
    });
  });

  it("should delete a song from the playlist when handleDelete is called", async () => {
    const mockDeleteSongFromPlaylist = jest.fn(() => true);

    const { getByTestId } = render(
      <AddSongModal
        song={{
          id: "song123",
          name: "Song Name",
          url: "https://example.com/song.mp3",
          cover: "https://example.com/cover.jpg",
          isLiked: true,
          Artist: [{ id: "artistid", name: "Artist Name", img: "artist.jpg" }],
          Album: [
            {
              id: "albumid",
              name: "Album Name",
              cover: "album.jpg",
              liked: false,
              artist: ["Artist"],
              Artist: [
                { id: "artistid", name: "Artist Name", img: "artist.jpg" },
              ],
              Album: [],
            },
          ],
          Song: [
            {
              id: "songid",
              name: "Song Name",
              url: "song.mp3",
              cover: "song.jpg",
              isLiked: false,
              Artist: [
                { id: "artistid", name: "Artist Name", img: "artist.jpg" },
              ],
              Album: [],
              Song: [],
            },
          ],
        }}
        updateSong={() => {}}
      />
    );

    fireEvent.click(getByTestId("delete-button"));
    screen.debug();
    await waitFor(() => {
      expect(mockDeleteSongFromPlaylist).toHaveBeenCalledWith(
        "playlistIdFromRoute",
        "song123",
        "mocked-token"
      );
    });
  });
});
