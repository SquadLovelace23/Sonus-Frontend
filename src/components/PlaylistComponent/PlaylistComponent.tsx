import React from 'react';
import { useEffect, useState } from 'react';
import Footer from '../Footer/Footer';
import ProfileModal from '../ProfileModal/ProfileModal';
import './playlist.css';
import SongsComponent from '../SongsComponent/SongsComponent';
import { Playlist } from '../../interfaces/models.interfaces';
import { getPlaylistById, unlikePlaylist, updateUserLikes } from '../../services/playlist.service';
import { useParams } from 'react-router-dom';
import { getSongByPlaylist } from '../../services/song.service';
import { useUserContext } from '../../utils/useUserContext';
import { deletePlaylist } from '../../services/playlist.service';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';

const PlaylistComponent = () => {
    const { id } = useParams<{ id?: string }>();
    const [playlist, setPlaylist] = useState<Playlist | null>(null);
    const [song, setSong] = useState([]);
    const { currentUser } = useUserContext();
    const [isLiked, setIsLiked] = useState(false);
    const [isUser, setIsUser] = useState(false);
    const { getAccessTokenSilently } = useAuth0();
    const [updateSongs, setUpdateSongs] = useState(false);
    
    const handleUpdateSongs = () => {
        setUpdateSongs((prev) => !prev);
    }

    useEffect(() => {
        if (playlist && playlist.User) {
            setIsUser(playlist.User.name === currentUser?.name)
        }
    }, [playlist, currentUser])

    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                const playlistData = await getPlaylistById(id, currentUser?.id.toString() || '');
                if (playlistData) {
                    setPlaylist(playlistData);
                    setIsLiked(playlistData.isLiked || false)
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchPlaylist();
    }, [id, currentUser])

    useEffect(() => {
        const fetchSongPlaylist = async () => {
            try {
                const playlistSongData = await getSongByPlaylist(id);
                if (playlistSongData) {
                    setSong(playlistSongData);
                }
            } catch (error) {
                console.error(error)
            }
        }
        fetchSongPlaylist();
    }, [id, updateSongs])

    const handleLike = async () => {
        setIsLiked((prevIsLiked) => !prevIsLiked);
        if (currentUser && playlist) {
            try {
                if (isLiked) {
                    await unlikePlaylist(currentUser.id.toString(), playlist.id.toString())
                } else {
                    await updateUserLikes(currentUser.id.toString(), playlist.id.toString(), !isLiked);
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleDelete = async () => {
        const token = await getAccessTokenSilently();
        try {
            if (!id) {
                console.error('Playlist ID is undefined');
                return
            }
            const isDeleted = await deletePlaylist(token, id);
            if (isDeleted) {
                window.history.back();
            } else {
                console.error('Failed to delete playlist');
            }
        } catch (error) {
            console.error('Error deleting playlist:', error);
        }
    };

    return (
        <>
            <main className="display-panel">
                <section className="card-main">
                    <ProfileModal />
                    <div className="playlist-display-panel-content">
                        <section className="playlist-wrapper">
                            <div style={{ backgroundImage: `url(${playlist?.cover})` }} className="playlist-details-cover" />
                            <article className="playlist-details">
                                {playlist && playlist.User && (
                                    <React.Fragment key={String(playlist.id)}>
                                        <p className="playlist-details-name">{playlist.name}</p>
                                        <Link to={`/profile/${playlist.User.name}`} className="playlist-details-artist-name">
                                            {playlist.User.name}
                                        </Link>
                                    </React.Fragment>
                                )}
                            </article>
                            {isUser ? (
                                <svg onClick={handleDelete} xmlns="http://www.w3.org/2000/svg"  className="icon icon-tabler icon-tabler-trash" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                    <path d="M4 7l16 0" />
                                    <path d="M10 11l0 6" />
                                    <path d="M14 11l0 6" />
                                    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                                    <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                                </svg>
                            ) : (
                                <div className="fav-playlist-icon">
                                    <div className="handle-like-playlist-wrapper" onClick={handleLike}>
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
                            )}
                        </section>
                        <SongsComponent songs={song} entity={playlist} updateSong={handleUpdateSongs}/>
                        <Footer />
                    </div>
                </section>
            </main>
        </>
    )
}

export default PlaylistComponent