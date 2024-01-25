import React from "react";
import { render, act, screen, waitFor } from "@testing-library/react";
import { uploadRequest } from "../services/upload.service";
import PlaylistModal from "../components/PlaylistModal/PlaylistModal";

jest.mock("../services/upload.service", () => ({
  uploadRequest: jest.fn(),
}));

jest.mock("../services/playlist.service", () => ({
  createPlaylistByUserId: jest.fn(),
}));

describe("PlaylistModal", () => {
  test("renders without crashing", async () => {
    (uploadRequest as jest.Mock).mockResolvedValue("mockImageUrl");
    const updatePlaylists = jest.fn();

    await act(async () => {
      const { container } = render(
        <PlaylistModal updatePlaylists={updatePlaylists} />
      );

      const imgInput = container.querySelector(".img-input");
      waitFor(() => expect(imgInput).toBeInTheDocument());
    });
    screen.debug();
  });
});
