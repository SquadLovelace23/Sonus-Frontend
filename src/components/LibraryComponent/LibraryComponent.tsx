import React from 'react';
import { NavLink } from "react-router-dom";
import ProfileModal from "../ProfileModal/ProfileModal";
import './library.css';
import { getAllPlaylistsByUserId, getLikedPlaylistsByUserId } from "../../services/playlist.service";
import { FC, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Playlist } from "../../interfaces/models.interfaces";
import { useUserContext } from "../../utils/useUserContext";
import { getLikedAlbumsByUserId } from "../../services/album.service";
import { Album } from "../../interfaces/models.interfaces";
import PlaylistModal from "../PlaylistModal/PlaylistModal";
import { useTranslation } from "react-i18next";

const LibraryComponent: FC = () => {
    const {currentUser} = useUserContext();
    const [playlists, setPlaylists] = useState([]);
    const {getAccessTokenSilently} = useAuth0();
    const [likedAlbums, setLikedAlbums] = useState<Album[]>([]);
    const [likedPlaylists, setLikedPlaylists] = useState<Playlist[]>([]);
    const [updatePlaylists, setUpdatePlaylists] = useState(false);
    const {t} = useTranslation();

    const handleUpdatePlaylists = () => {
        setUpdatePlaylists((prev) => !prev);
    };

    useEffect(() => {
        const fetchPlaylist = async () => {
            if (currentUser?.id) {
                try {
                    const playlistData = await getAllPlaylistsByUserId(currentUser?.id.toString(), getAccessTokenSilently);
                    if (playlistData) {
                        setPlaylists(playlistData);
                    }
                } catch (error) {
                    console.error(error)
                }
            }
        }
        fetchPlaylist();
    }, [currentUser?.id, getAccessTokenSilently, updatePlaylists])

    useEffect(() => {
        const fetchLikedAlbums = async () => {
            if (currentUser?.id) {
                try {
                    const likedAlbumsData = await getLikedAlbumsByUserId(currentUser?.id.toString(), getAccessTokenSilently);
                    if (likedAlbumsData) {
                        const albums = likedAlbumsData.map((data: { Albums: Album; }) => data.Albums)
                        setLikedAlbums(albums);
                    }
                } catch (error) {
                    console.error(error)
                }
            }
        }
        fetchLikedAlbums();
    }, [currentUser?.id, getAccessTokenSilently])

    useEffect(() => {
        const fetchLikedPlaylists = async () => {
            if (currentUser?.id) {
                try {
                    const likedPlaylistData = await getLikedPlaylistsByUserId(currentUser?.id.toString(), getAccessTokenSilently);
                    if (likedPlaylistData) {
                        const playlists = likedPlaylistData.map((data: { Playlists: Playlist; }) => data.Playlists)
                        setLikedPlaylists(playlists);
                    }
                } catch (error) {
                    console.error(error)
                }
            }
        }
        fetchLikedPlaylists();
    }, [currentUser?.id, getAccessTokenSilently])

    return (
        <main className="card-main">
            <ProfileModal />
                <section className="display-panel-content">
                    <PlaylistModal updatePlaylists={handleUpdatePlaylists}/>
                    <h2 className="playlist-title">{t('Playlists')}</h2>
                        <article className="library-playlist-swiper">
                            <NavLink to={`/favourites/${currentUser?.id}`} className="playlist">
                                <div style={{ backgroundImage: `url(${'https://res.cloudinary.com/dwsgzijc7/image/upload/v1701262675/Sonus/Albums/fav_ndgbyk.png'})`}} className="image-playlist" />
                                <p className="playlist-name">{t('Favourites')}</p>
                            </NavLink>
                            {likedPlaylists && likedPlaylists.map((playlists: Playlist) => (
                                    <NavLink key={String(playlists.id)} to={`/playlist/${playlists.id}`} className="playlist">
                                        <div style={{ backgroundImage: `url(${playlists.cover})`}} className="image-playlist" />
                                        <p className="playlist-name">{playlists.name}</p>
                                    </NavLink>
                                ))}
                            {Array.isArray(playlists) && playlists.map((playlist: Playlist) => (
                                    <NavLink key={String(playlist.id)} to={`/playlist/${playlist.id}`} className="playlist">
                                        <div style={{ backgroundImage: `url(${playlist.cover})`}} className="image-playlist" />
                                        <p className="playlist-name">{playlist.name}</p>
                                    </NavLink>
                                ))}
                        </article>
                    <h2 className="albums-title">{t('Albums')}</h2>
                    <article className="library-albums-swiper">
                        {likedAlbums && likedAlbums.map((albums: Album) => (
                            <NavLink key={String(albums.id)} to={`/album/${albums.id}`} className="albums">
                                <div style={{ backgroundImage: `url(${albums.cover})`}} className="image-albums" />
                                <p className="albums-name">{albums.name}</p>
                                <p className="albums-artist-name">{albums.Artist[0].name}</p>
                            </NavLink>
                        ))}
                    </article>
                </section>
        </main>
    )
}

export default LibraryComponent