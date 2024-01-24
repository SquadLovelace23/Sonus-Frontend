import { useState, useEffect, FC } from "react";
import "./add.song.modal.css";
import React from 'react';
import { useUserContext } from "../../utils/useUserContext";
import { useAuth0 } from "@auth0/auth0-react";
import { Playlist, Song } from "../../interfaces/models.interfaces";
import toast from "react-hot-toast";
import {
  addSongToPlaylist,
  deleteSongFromPlaylist,
  getAllPlaylistsByUserId,
} from "../../services/playlist.service";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface AddSongModalProps {
  song: Song | null;
  updateSong: () => void;
}

const AddSongModal: FC<AddSongModalProps> = ({ song, updateSong }) => {
  const { currentUser } = useUserContext();
  const [isElementHidden, setIsElementHidden] = useState(true);
  const { getAccessTokenSilently } = useAuth0();
  const [playlists, setPlaylists] = useState([]);
  const { id: playlistIdFromRoute } = useParams<{ id: string }>();
  const isCurrentPlaylist = currentUser?.Playlist.some(
    (playlist) => playlist.id === playlistIdFromRoute
  );
  const { t } = useTranslation();

  const toggleElement = () => {
    setIsElementHidden(!isElementHidden);
  };

  useEffect(() => {
    const handleOutsideClick = (e: Event) => {
      if (isElementHidden) return;
      const target = e.target as Element;
      if (
        target &&
        !target.closest(".song-modal") &&
        target !== document.querySelector(".icon-tabler-dots") &&
        !target.closest("path")
      ) {
        toggleElement();
      }
    };

    const handleEscapeKey = (e: { key: string }) => {
      if (isElementHidden) return;
      if (e.key === "Escape") {
        toggleElement();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isElementHidden, currentUser, toggleElement]);

  const onSubmit = async (selectedPlaylistId: string) => {
    try {
      if (selectedPlaylistId && currentUser) {
        const token = await getAccessTokenSilently();
        const songAddedToPlaylist = await addSongToPlaylist(
          selectedPlaylistId,
          song?.id,
          currentUser?.id,
          token
        );
        if (songAddedToPlaylist) {
          toggleElement();
          toast.success(t("Song added successfully!"));
        } else {
          toast.error(t("Error adding to playlist."));
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchPlaylist = async () => {
      if (currentUser?.id) {
        try {
          const playlistData = await getAllPlaylistsByUserId(
            currentUser?.id.toString(),
            getAccessTokenSilently
          );
          if (playlistData) {
            setPlaylists(playlistData);
          }
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchPlaylist();
  }, [currentUser?.id, getAccessTokenSilently]);

  const handleDelete = async () => {
    const token = await getAccessTokenSilently();
    try {
      if (!playlistIdFromRoute || !song?.id) {
        console.error("Playlist ID or song ID is undefined");
        return;
      }
      const isDeleted = await deleteSongFromPlaylist(
        playlistIdFromRoute,
        song.id,
        token
      );
      if (isDeleted) {
        updateSong();
      } else {
        console.error("Failed to delete song from playlist");
      }
    } catch (error) {
      console.error("Error deleting song from playlist:", error);
    }
  };

  return (
    <>
      <article
        className={`song-modal ${
          isElementHidden ? "song-hidden-modal" : "song-visible-modal"
        }`}
      >
        {playlists.length === 0 ? (
          <p className="not-found-title">{t("No playlists found")}</p>
        ) : (
          <>
            <p className="modal-add-title">{t("Add to playlist")}</p>
            {playlists.map((playlist: Playlist) => (
              <p
                className="song-modal-titles"
                key={playlist.id.toString()}
                onClick={() => onSubmit(playlist.id)}
              >
                {playlist?.name}
              </p>
            ))}
          </>
        )}
      </article>
      {isCurrentPlaylist ? (
        <svg
          onClick={handleDelete}
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-trash"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M4 7l16 0" />
          <path d="M10 11l0 6" />
          <path d="M14 11l0 6" />
          <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
          <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
        </svg>
      ) : (
        <article className="song-action-wrapper">
          <svg
            onClick={toggleElement}
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-dots"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
            <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
            <path d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
          </svg>
        </article>
      )}
    </>
  );
};

export default AddSongModal;
