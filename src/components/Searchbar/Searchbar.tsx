import { NavLink, useSearchParams } from "react-router-dom";
import Footer from "../Footer/Footer";
import ProfileModal from "../ProfileModal/ProfileModal";
import './searchbar.css';
import { useEffect, useState } from "react";
import { getAllSongs } from "../../services/song.service";
import { useAuth0 } from "@auth0/auth0-react";
import { Song, Playlist, User } from "../../interfaces/models.interfaces";
import { getAllPlaylists } from "../../services/playlist.service";
import { usePlayer } from "../../context/PlayerContext";
import { Swiper, SwiperSlide,  } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useTranslation } from "react-i18next";
import { getAllUsers } from "../../services/user.service";

const Searchbar = () => {
    const {t} = useTranslation()
    const { getAccessTokenSilently } = useAuth0()
    const [songs, setSongs] = useState([]);
    const [playlists, setPlaylists] = useState([])
    const [searchParams, setSearchParams] = useSearchParams()
    const query = searchParams.get("q") ?? ""
    const { setSong } = usePlayer();
    const [users, setUsers] = useState([]);

    const handleSong = (song: Song) => {
        localStorage.removeItem('lastPathSongs');
        setSong(song);
    };

    useEffect(() => {
        const fetchAllSongs = async () => {
            try {
                const songsData = await getAllSongs();

                if (songsData) {
                    setSongs(songsData);
                }
            } catch (error) {
                console.error(error)
            }
        }

        fetchAllSongs();
    }, [searchParams, getAccessTokenSilently])

    useEffect(() => {
        const fetchAllPlaylists = async () => {
            try {
                const playlistData = await getAllPlaylists();

                if (playlistData) {
                    setPlaylists(playlistData);
                }
            } catch (error) {
                console.error(error)
            }
        }

        fetchAllPlaylists();
    }, [searchParams])

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const usersData = await getAllUsers();

                if (usersData) {
                    setUsers(usersData);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchAllUsers();
    }, [searchParams]);

    const handleInput = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = target
        setSearchParams({ q: value })
    }

    const uniqueArtists: Song[] = Array.from(new Set(songs.map((song: Song) => song.Artist[0].name)))
        .map(name => songs.find((song: Song) => song.Artist[0].name === name)) as unknown as Song[];

    const uniqueAlbums: Song[] = Array.from(new Set(songs.map((song: Song) => song.Album[0].name)))
        .map(name => songs.find((song: Song) => song.Album[0].name === name)) as unknown as Song[];

    return (
        <main className="card-main">
            <ProfileModal />
            <section className="display-panel-content">
                <div className="search-wrapper">
                    <div className="search-bar">
                        <div className="search-container">
                            <input className="search-input" type="search" value={query} onChange={handleInput} placeholder={t('Search...')} />
                            <svg viewBox="0 0 24 24" className="search__icon">
                                <g>
                                    <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z">
                                    </path>
                                </g>
                            </svg>
                        </div>
                    </div>
                </div>
                {query && (
                    <h2 className="artist-title">{t('Users')}</h2>
                )}
                <article className="searchbar-artist-swiper">
                    <Swiper navigation={true} modules={[Navigation]} slidesPerView={4} spaceBetween={20} loop={true} breakpoints={{
                            300: {
                                slidesPerView: 2
                            },
                            700: {
                                slidesPerView: 4
                            }
                        }}>
                    {users && users
                        .filter((user: User) => {
                            if (!query) return;
                            if (query) {
                                const userNameToLowerCase = user.name?.toLowerCase();
                                return userNameToLowerCase?.includes(query.toLowerCase());
                            }
                        })
                        .map((user: User) => (
                            <SwiperSlide>
                                <div className="user-search-result">
                                    <NavLink to={`/profile/${user.name}`} className="artist">
                                        <div className="image-artist" style={{ backgroundImage: `url(${user.avatar})` }} />
                                        <p className="artist-name">{user.name}</p>
                                    </NavLink>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </article>
                {query && (
                    <h2 className="most-played-title">{t('All songs')}</h2>
                )}
                <article className="most-played-swiper">
                    {songs && songs
                        .filter((song: Song) => {
                            if (!query) return
                            if (query) {
                                const songNameToLowerCase = song.name.toLowerCase()
                                const artistNameToLowerCase = song.Artist[0].name.toLowerCase()
                                return songNameToLowerCase.includes(query.toLowerCase()) || artistNameToLowerCase.includes(query.toLowerCase())
                            }
                        })
                        .map((song: Song) => (
                            <div className="most-played" onDoubleClick={() => handleSong(song)}>
                                <div className="image-most-played" style={{ backgroundImage: `url(${song.cover})`}} />
                                <div className="most-played-song-details">
                                    <p className="most-played-text">{song?.name}</p>
                                    <p className="tracks">{song.Artist[0].name}</p>
                                </div>
                            </div>
                        ))}
                </article>
                {query && (
                    <h2 className="artist-title">{t('Artists')}</h2>
                )}
                <article className="searchbar-artist-swiper">
                    <Swiper navigation={true} modules={[Navigation]} slidesPerView={4} spaceBetween={20} loop={true} breakpoints={{
                        300: {
                            slidesPerView: 2
                        },
                        700: {
                            slidesPerView: 4
                        }
                    }}>
                        {uniqueArtists && uniqueArtists
                            .filter((song: Song) => {
                                if (!query) return
                                if (query) {
                                    const artistNameToLowerCase = song.Artist[0].name.toLowerCase()
                                    return artistNameToLowerCase.includes(query.toLowerCase())
                                }
                            })
                            .map((song: Song) => (
                                <SwiperSlide>
                                    <NavLink to={`/artist/${song.artistId}`} className="artist">
                                        <div style={{ backgroundImage: `url(${song.Artist[0].img})`}} className="image-artist" />
                                        <p className="artist-name">{song.Artist[0].name}</p>
                                    </NavLink>
                                </SwiperSlide>
                            ))}
                    </Swiper>
                </article>
                {query && (
                    <h2 className="playlist-title">{t('Playlists')}</h2>
                )}
                <article className="searchbar-playlist-swiper">
                    <Swiper navigation={true} modules={[Navigation]} slidesPerView={4} spaceBetween={20} loop={true} breakpoints={{
                        300: {
                            slidesPerView: 2
                        },
                        700: {
                            slidesPerView: 4
                        }
                    }}>
                        {playlists && playlists
                            .filter((playlist: Playlist) => {
                                if (!query) return
                                if (query) {
                                    const playlistNameToLowerCase = playlist.name.toLowerCase()
                                    return playlistNameToLowerCase.includes(query.toLowerCase())
                                }
                            })
                            .map((playlist: Playlist) => (
                                <SwiperSlide>
                                    <NavLink to={`/playlist/${playlist.id}`} className="playlist">
                                        <div className="image-playlist" style={{ backgroundImage: `url(${playlist.cover})`}} />
                                        <p className="playlist-name">{playlist.name}</p>
                                    </NavLink>
                                </SwiperSlide>
                            ))}
                    </Swiper>
                </article>
                {query && (
                    <h2 className="albums-title">{t('Albums')}</h2>
                )}
                <article className="searchbar-albums-swiper">
                    <Swiper navigation={true} modules={[Navigation]} slidesPerView={4} spaceBetween={20} loop={true} breakpoints={{
                        300: {
                            slidesPerView: 2
                        },
                        700: {
                            slidesPerView: 4
                        }
                    }}>
                        {uniqueAlbums && uniqueAlbums
                            .filter((song: Song) => {
                                if (!query) return
                                if (query) {
                                    const albumNameToLowerCase = song.Album[0].name.toLowerCase()
                                    const artistNameToLowerCase = song.Artist[0].name.toLowerCase()
                                    return albumNameToLowerCase.includes(query.toLowerCase()) || artistNameToLowerCase.includes(query.toLowerCase())
                                }
                            })
                            .map((song: Song) => (
                                <SwiperSlide>
                                    <NavLink to={`/album/${song.albumId}`} className="albums">
                                        <div className="image-albums" style={{ backgroundImage: `url(${song.cover})`}} />
                                        <p className="albums-name">{song.Album[0].name}</p>
                                    </NavLink>
                                </SwiperSlide>
                            ))}
                    </Swiper>
                </article>
            </section>
            <Footer />
        </main>
    )
}

export default Searchbar