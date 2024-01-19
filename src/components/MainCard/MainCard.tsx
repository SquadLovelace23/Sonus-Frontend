import { Link, NavLink } from "react-router-dom";
import Footer from "../Footer/Footer";
import ProfileModal from "../ProfileModal/ProfileModal";
import './main.card.css';
import { useEffect, useState } from "react";
import { getAllArtists } from "../../services/artist.service";
import { Album, Artist, Genre, Playlist, Song } from "../../interfaces/models.interfaces";
import { getAllAlbums } from "../../services/album.service";
import { getAllPlaylists } from "../../services/playlist.service";
import { getAllGenres } from "../../services/genre.service";
import { getAllSongs } from "../../services/song.service";
import { usePlayer } from "../../context/PlayerContext";
import { Swiper, SwiperSlide,  } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import {useTranslation} from 'react-i18next';
import { useAuth0 } from "@auth0/auth0-react";
import toast, { Toaster } from 'react-hot-toast';

const MainCard = () => {
    const [artists, setArtists] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [genres, setGenres] = useState([]);
    const [mostPlayed, setMostPlayed] = useState([])
    const { setSong } = usePlayer();
    const {t} = useTranslation()
    const { isAuthenticated } = useAuth0();
    
    const handleSong = (song: Song) => {
        if (isAuthenticated) {
            localStorage.removeItem('lastPathSongs');
            localStorage.setItem('originalOrder', JSON.stringify(song));
            setSong(song);
        } else {
            toast.error(t('You need to log in!'))
        }
    };
    
    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const artistData = await getAllArtists();
                if (artistData) {
                    setArtists(artistData);
                }
            } catch (error) {
                console.error(error)
            }
        }
        fetchArtists();
    }, [])

    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const albumData = await getAllAlbums();
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
        const fetchPlaylist = async () => {
            try {
                const playlistData = await getAllPlaylists();
                if (playlistData) {
                    setPlaylists(playlistData);
                }
            } catch (error) {
                console.error(error)
            }
        }
        fetchPlaylist();
    }, [])

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const genresData = await getAllGenres();
                if (genresData) {
                    setGenres(genresData);
                }
            } catch (error){
                console.error(error)
            }
        }
        fetchGenres();
    }, [])

    useEffect(() => {
        const fetchMostPlayed = async () => {
            try {
                const mostPlayedData = await getAllSongs();
                if (mostPlayedData) {
                    
                    setMostPlayed(mostPlayedData);
                }
            } catch (error){
                console.error(error)
            }
        }
        fetchMostPlayed();
    }, [])
    
    return (
        <>
            <Toaster
                position="top-right"
                toastOptions={{
                    error: {
                        iconTheme: {
                            primary: 'var(--clr-white)',
                            secondary: 'var(--clr-black)',
                        },
                        style: {
                            background: 'var(--clr-dark)',
                            color: 'var(--clr-white)',
                        },
                    },
                    success: {
                        iconTheme: {
                            primary: 'var(--clr-white)',
                            secondary: 'var(--clr-black)',
                        },
                        style: {
                            background: 'var(--clr-dark)',
                            color: 'var(--clr-white)',
                        },
                    }
                }}
            />
            <main className="card-main">
                <ProfileModal />
                    <section className="display-panel-content">
                        <h2 className="genre-title">{t('Genres')}</h2>
                        <article className="genres-swiper">
                            <Swiper navigation={true} modules={[Navigation]} slidesPerView={4} spaceBetween={20} loop={true} breakpoints={{
                                300: {
                                    slidesPerView: 2
                                },
                                700: {
                                    slidesPerView: 4
                                }
                            }}>
                                {genres && genres.map((genre: Genre) => (
                                    <SwiperSlide>
                                        <NavLink to={`/genre/${genre.id}`} className="genres">
                                            <p className="genre-text">{genre.name}</p>
                                        </NavLink>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </article>
                        <h2 className="most-played-title">{t('Most played songs')}</h2>
                        <article className="most-played-swiper">
                            {mostPlayed.sort((a: Song, b: Song) => {
                                const aListened = a.listened || 0;
                                const bListened = b.listened || 0;
                                return bListened - aListened;
                            }).slice(0, 9).map( (song: Song) => (
                                <div onDoubleClick={() => handleSong(song)} className="most-played">
                                    <div style={{ backgroundImage: `url(${song.cover})`}} className="image-most-played" />
                                    <div className="most-played-song-details">
                                        <p className="most-played-text">{song.name}</p>
                                        <Link to={`/artist/${song.Artist[0].id}`} className="most-played-artist">{song.Artist[0].name}</Link>
                                        <p className="tracks">{t('Played')} {song.listened?.toLocaleString()} {t('times')}</p>
                                    </div> 
                                </div>
                            ))}
                        </article>
                        <h2 className="artist-title">{t('Artists')}</h2>
                        <article className="artist-swiper">
                            <Swiper navigation={true} modules={[Navigation]} slidesPerView={4} spaceBetween={20} loop={true} breakpoints={{
                                300: {
                                    slidesPerView: 2
                                },
                                700: {
                                    slidesPerView: 4
                                }
                            }}>
                                {artists && artists.map((artist: Artist) => (
                                    <SwiperSlide>
                                        <NavLink key={String(artist.id)} to={`/artist/${artist.id}`} className="artist">
                                            <div style={{ backgroundImage: `url(${artist.img})`}} className="image-artist" />
                                            <p className="artist-name">{artist.name}</p>
                                        </NavLink>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </article>
                        <h2 className="playlist-title">{t('Playlists')}</h2>
                        <article className="playlist-swiper">
                            <Swiper navigation={true} modules={[Navigation]} slidesPerView={4} spaceBetween={20} loop={true} breakpoints={{
                                300: {
                                    slidesPerView: 2
                                },
                                700: {
                                    slidesPerView: 4
                                }
                            }}>
                                {playlists && playlists.map((playlist: Playlist) => (
                                    <SwiperSlide>
                                        <NavLink key={String(playlist.id)} to={`/playlist/${playlist.id}`} className="playlist">
                                            <div style={{ backgroundImage: `url(${playlist.cover})`}} className="image-playlist" />
                                            <p className="playlist-name">{playlist.name}</p>
                                        </NavLink>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </article>
                        <h2 className="albums-title">{t('Albums')}</h2>
                        <article className="albums-swiper">
                            <Swiper navigation={true} modules={[Navigation]} slidesPerView={4} spaceBetween={20} loop={true} breakpoints={{
                                300: {
                                    slidesPerView: 2
                                },
                                700: {
                                    slidesPerView: 4
                                }
                            }}>
                                {albums && albums.map((album: Album) => (
                                    <SwiperSlide>
                                        <NavLink key={String(album.id)} to={`/album/${album.id}`} className="albums">
                                            <div style={{ backgroundImage: `url(${album.cover})`}} className="image-albums" />
                                            <p className="albums-name">{album.name}</p>
                                            <p className="albums-artist-name">{album.Artist[0].name}</p>
                                        </NavLink>
                                    </SwiperSlide>
                                    ))}
                            </Swiper>
                        </article>
                    </section>
                <Footer />
            </main>
        </>
    )
}

export default MainCard