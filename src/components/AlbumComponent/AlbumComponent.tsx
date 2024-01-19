import { useEffect, useState } from 'react';
import Footer from '../Footer/Footer';
import ProfileModal from '../ProfileModal/ProfileModal';
import './album.css';
import SongsComponent from '../SongsComponent/SongsComponent';
import { Link, useParams } from 'react-router-dom';
import { Album } from '../../interfaces/models.interfaces';
import { getAlbumById, unlikeAlbum, updateUserLikes } from '../../services/album.service';
import React from 'react';
import { getSongByAlbum } from '../../services/song.service';
import { useUserContext } from '../../utils/useUserContext';

const AlbumComponent = () => {
    const { id } = useParams<{ id?: string }>();
    const [album, setAlbum] = useState<Album | null>(null);
    const [songs, setSongs] = useState([]);
    const { currentUser } = useUserContext();
    const [isLiked, setIsLiked] = useState(false);
    const [updateSongs, setUpdateSongs] = useState(false);
    
    const handleUpdateSongs = () => {
        setUpdateSongs((prev) => !prev);
    }

    useEffect(() => {
        const fetchAlbum = async () => {
            try {
                const albumData = await getAlbumById(id, currentUser?.id.toString() || '');
                if (albumData) {
                    setAlbum(albumData);
                    setIsLiked(albumData.isLiked || false)
                }
            } catch (error) {
                console.error(error)
            }
        }
        fetchAlbum();
    }, [id, currentUser])

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const songData = await getSongByAlbum(id);
                if (songData) {
                    setSongs(songData);
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchSongs();
    }, [id, updateSongs])

    const handleLike = async () => {
        setIsLiked((prevIsLiked) => !prevIsLiked);
        if (currentUser && album) {
            try {
                if (isLiked) {
                    await unlikeAlbum(currentUser.id.toString(), album.id.toString())
                } else {
                    await updateUserLikes(currentUser.id.toString(), album.id.toString(), !isLiked);
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

            return (
                <>
                    <main className="display-panel">
                        <section className="card-main">
                            <ProfileModal />
                            <div className="album-display-panel-content">
                                <section className="album-wrapper">
                                    <div style={{ backgroundImage: `url(${album?.cover})` }} className="album-details-cover" />
                                    <article className="album-details">
                                        {album && album.Artist && album.Artist.length > 0 && (
                                            <React.Fragment key={String(album.id)}>
                                                <p className="album-name">{album.name}</p>
                                                <Link to={`/artist/${album.Artist[0].id}`} className="album-details-artist-name">{album.Artist[0].name}</Link>                                            
                                            </React.Fragment>
                                        )}
                                    </article>
                                    <div className="fav-album-icon">
                                        <div className="handle-like-album-wrapper" onClick={handleLike}>
                                            {isLiked ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon-tabler icon-tabler-heart-filled" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037 .033l.034 -.03a6 6 0 0 1 4.733 -1.44l.246 .036a6 6 0 0 1 3.364 10.008l-.18 .185l-.048 .041l-7.45 7.379a1 1 0 0 1 -1.313 .082l-.094 -.082l-7.493 -7.422a6 6 0 0 1 3.176 -10.215z" strokeWidth="0" fill="currentColor" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" className='icon-tabler icon-tabler-heart icon' width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                    <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path>
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                </section>
                                <SongsComponent songs={songs} entity={album} updateSong={handleUpdateSongs}/>
                                <Footer />
                            </div>
                        </section>
                    </main>
                </>
            )
        }

export default AlbumComponent
