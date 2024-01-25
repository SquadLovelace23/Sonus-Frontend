import React from 'react';
import { render, waitFor, act, screen } from '@testing-library/react';
import { uploadRequest } from '../services/upload.service';
import { createPlaylistByUserId } from '../services/playlist.service';
import PlaylistModal from '../components/PlaylistModal/PlaylistModal';

jest.mock("../services/upload.service", () => ({
  uploadRequest: jest.fn(),
}));

jest.mock("../services/playlist.service", () => ({
  createPlaylistByUserId: jest.fn(),
  addSongToPlaylist: jest.fn(),
  deleteSongFromPlaylist: jest.fn(),
}));

describe('PlaylistModal', () => {
  test('renders without crashing', async () => {
    (uploadRequest as jest.Mock).mockResolvedValue('mockImageUrl');

    (createPlaylistByUserId as jest.Mock).mockResolvedValue({
      id: '1',
      name: 'Test Playlist',
      cover: 'mockImageUrl',
      numSong: 0,
      songId: [],
      userId: '1',
      likedPlaylist: [],
      liked: false,
      User: { name: 'Test User' },
      Playlist: [],
    });

    const updatePlaylists = jest.fn();

    await act(async () => {
      render(<PlaylistModal updatePlaylists={updatePlaylists} />);
    });

    await waitFor(() => {
      expect(updatePlaylists).toHaveBeenCalled();
    });

    screen.debug();
  });
});
