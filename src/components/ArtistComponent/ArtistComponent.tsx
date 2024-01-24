import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import Footer from '../Footer/Footer';
import ProfileModal from '../ProfileModal/ProfileModal';
import './artist.css';
import { useState, useEffect } from 'react';
import { getArtistById } from '../../services/artist.service';
import { Album, Artist, Song } from '../../interfaces/models.interfaces';
import { getAlbumByArtist } from '../../services/album.service';
import { getSongByArtist } from '../../services/song.service';
import { usePlayer } from '../../context/PlayerContext';
import {useTranslation} from 'react-i18next';

const ArtistComponent = () => {
    const { id } = useParams<{ id?: string }>();
    const [artist, setArtists] = useState<Artist | null>(null);
    const [albums, setAlbums] = useState([]);
    const [songs, setSongs] = useState([]);
    const { setSong } = usePlayer();
    const {t} = useTranslation()

    const handleSong = (song: Song) => {
        localStorage.removeItem('lastPathSongs');
        localStorage.setItem('originalOrder', JSON.stringify(songs));
        setSong(song);
    };

    useEffect(() => {
        const fetchArtist = async () => {
            try {
                const artistData = await getArtistById(id);
                if (artistData) {
                    setArtists(artistData);
                }
            } catch (error) {
                console.error(error)
            }
        }

        fetchArtist();
    }, [id])

    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const albumData = await getAlbumByArtist(id);
                if (albumData) {
                    setAlbums(albumData);
                }
            } catch (error) {
                console.error(error)
            }
        }
        fetchAlbums();
    }, [])

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const songData = await getSongByArtist(id);
                if (songData) {
                    setSongs(songData);
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchSongs();
    }, [])

    return (
        <>
            <main className="display-panel">
                <section className="card-main">
                    <ProfileModal />
                    <div className="artist-display-panel-content">
                        <section className="artist-profile">
                            {artist && (
                                <React.Fragment key={String(artist.id)}>
                                    <article style={{ backgroundImage: `url(${artist.img})` }} className="artist-profile-img" />
                                    <article className="artist-profile-details">
                                        <p className="artist-profile-name">{artist.name}</p>
                                    </article>
                                </React.Fragment>
                            )}
                        </section>
                        <h2 className="most-played-title">{t('Songs')}</h2>
                        <article className="most-played-swiper">
                            {songs && songs.map((song: Song) => (
                                <div onDoubleClick={() => handleSong(song)} key={String(song.id)} className="most-played">
                                    <div style={{ backgroundImage: `url(${song.cover})` }} className="image-most-played" />
                                    <div className="most-played-song-details">
                                        <p className="most-played-text">{song.name}</p>
                                        <p className="tracks">{song.Album[0].name}</p>
                                    </div>
                                </div>
                            ))}
                        </article>
                        <h2 className="albums-title">{t('Albums')}</h2>
                        <article className="artist-albums-swiper">
                            {albums && albums.map((album: Album) => (
                                <NavLink key={String(album.id)} to={`/album/${album.id}`} className="albums">
                                    <div style={{ backgroundImage: `url(${album.cover})` }} className="image-albums" />
                                    <p className="albums-name">{`${album.name}`}</p>
                                </NavLink>
                            ))}
                        </article>
                        <Footer />
                    </div>
                </section>
            </main>
        </>
    )
}

export default ArtistComponent