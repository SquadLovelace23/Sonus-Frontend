import { useState, useEffect, ChangeEvent } from "react";
import "./playlist.modal.css";
import { useUserContext } from "../../utils/useUserContext";
import { useAuth0 } from "@auth0/auth0-react";
import { uploadRequest } from "../../services/upload.service";
import { Playlist } from "../../interfaces/models.interfaces";
import toast from "react-hot-toast";
import { createPlaylistByUserId } from "../../services/playlist.service";
import { useTranslation } from "react-i18next";

type PlaylistModalProps = {
  updatePlaylists: () => void;
};

const PlaylistModal: React.FC<PlaylistModalProps> = ({ updatePlaylists }) => {
  const { currentUser } = useUserContext();
  const [isElementHidden, setIsElementHidden] = useState(true);
  const { getAccessTokenSilently } = useAuth0();
  const [imgSrc, setImgSrc] = useState<string | null>();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [file, setFile] = useState<File>();
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
        !target.closest(".playlist-modal") &&
        target !== document.querySelector(".icon-tabler-square-rounded-plus") &&
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

  const handleChange = async (e: ChangeEvent<HTMLInputElement> | null) => {
    if (e && e.target && e.target.files && e.target.files.length !== null) {
      const file = e.target.files[0];
      setFile(file);
      const uploadedImageUrl = await uploadRequest(file);
      setImgSrc(uploadedImageUrl);
    }
  };

  const onSubmit = async () => {
    try {
      if (playlist && playlist.name && file) {
        const token = getAccessTokenSilently();
        const uploadedImageUrl = await uploadRequest(file);
        if (uploadedImageUrl) {
          const newPlaylist: Playlist = {
            name: playlist.name,
            cover: uploadedImageUrl,
            numSong: playlist.numSong,
            songId: playlist.songId,
            userId: currentUser?.id,
            likedPlaylist: playlist.likedPlaylist,
            id: playlist.id,
            liked: playlist.liked,
            User: playlist.User,
            Playlist: [],
          };
          const response = await createPlaylistByUserId(
            newPlaylist,
            currentUser?.id || "",
            await token
          );
          if (response) {
            setPlaylist(response);
            toggleElement();
            updatePlaylists();
            toast.success(t("Playlist created successfully!"));
            setPlaylist(null);
            setFile(undefined);
            setImgSrc(null);
          } else {
            toast.error(t("Error creating playlist."));
          }
        }
      } else {
        toast.error(t("Name and cover are required."));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPlaylist(
      (prevPlaylist) =>
        ({
          ...prevPlaylist,
          [name]: value,
        } as Playlist)
    );
  };

  return (
    <>
      <section className="library-action-container">
        <article
          className={`playlist-modal ${
            isElementHidden ? "playlist-hidden-modal" : "playlist-visible-modal"
          }`}
        >
          <div
            style={{ backgroundImage: `url(${imgSrc})` }}
            className="modal-song-thumbnail"
          />
          <div className="upload-container">
            <input className="img-input" type="file" onChange={handleChange} />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-upload"
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
              <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
              <path d="M7 9l5 -5l5 5" />
              <path d="M12 4l0 12" />
            </svg>
          </div>
          <form className="modal-form">
            <input
              className="modal-input"
              type="text"
              placeholder={t("Name...")}
              autoComplete="off"
              name="name"
              value={playlist?.name || ""}
              onChange={handleInputChange}
            />
          </form>
          <button type="button" className="modal-btn" onClick={onSubmit}>
            <p className="modal-btn-text">{t("Create")}</p>
          </button>
        </article>
        <article className="library-action-wrapper">
          <svg
            onClick={toggleElement}
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-square-rounded-plus"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z" />
            <path d="M15 12h-6" />
            <path d="M12 9v6" />
          </svg>
        </article>
      </section>
    </>
  );
};

export default PlaylistModal;
