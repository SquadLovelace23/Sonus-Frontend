import { useState, useEffect } from 'react';
import './songs.css';
import { Song } from '../../interfaces/models.interfaces';
import { Link, useLocation } from 'react-router-dom';
import { usePlayer } from "../../context/PlayerContext";
import { useUserContext } from '../../utils/useUserContext';
import { unlikeSong, updateUserLikes, getLikedSongsByUserId } from '../../services/song.service';
import AddSongModal from '../AddSongModal/AddSongModal';

interface SongsComponentProps {
    songs: Song[]
    entity: any
    updateSong: () => void;
}

const SongsComponent: React.FC<SongsComponentProps> = ({ songs, updateSong }) => {
    const location = useLocation();
    const { setSong } = usePlayer();
    const isAlbumPath = location.pathname.includes("album");
    const { currentUser } = useUserContext();
    const [songsWithLikedState, setSongs] = useState<Song[]>(songs);

    useEffect(() => {
        const initializeLikedState = async () => {
            try {
                const likedSongs = await getLikedSongsByUserId(currentUser?.id.toString());
                const updatedSongs = songs.map(song => {
                    const isLiked = likedSongs.some((likedSong: { id: String; }) => likedSong.id === song.id);
                    return { ...song, isLiked };
                });
                setSongs(updatedSongs);
            } catch (error) {
                console.error(error);
            }
        };

        initializeLikedState();
    }, [currentUser?.id, songs]);

    const handleSong = (song: Song) => {
        localStorage.removeItem('lastPathSongs');
        localStorage.setItem('originalOrder', JSON.stringify(songs));
        setSong(song);
    };

    const handleLike = async (clickedSong: Song) => {
        setSongs(prevSongs => prevSongs.map(song =>
            song.id === clickedSong.id ? { ...song, isLiked: !song.isLiked } : song
        ));

        if (currentUser) {
            try {
                if (clickedSong.isLiked) {
                    await unlikeSong(currentUser.id.toString(), clickedSong.id.toString());
                } else {
                    await updateUserLikes(currentUser.id.toString(), clickedSong.id.toString(), !clickedSong.isLiked);
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <>
            <section className='songs-list-container'>
                <article className='songs-list-wrapper'>
                    <ul className='songs-list'>
                        {songsWithLikedState.map(song => (
                            <li onDoubleClick={() => { handleSong(song) }} key={String(song.id)} className='songs-list-element'>
                                {!isAlbumPath && (
                                    <div style={{ backgroundImage: `url(${song.cover})` }} className="songs-list-image" />
                                )}
                                <div className="songs-list-details-wrapper">
                                    <p className="songs-list-text">{song.name}</p>
                                    <Link to={`/artist/${song.Artist[0].id}`} className="songs-list-text">{song.Artist[0].name}</Link>
                                    <Link to={`/album/${song.Album[0].id}`} className="songs-list-text">{song.Album[0].name}</Link>
                                </div>
                                <div className="songs-icons-wrapper">
                                    <div className="fav-album-icon">
                                        <div className="handle-like-album-wrapper" onClick={() => handleLike(song)}>
                                            {song.isLiked ? (
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
                                    <AddSongModal song={song} updateSong={updateSong}/>
                                </div>
                            </li>
                        ))}
                    </ul>
                </article>
            </section>
        </>
    );
};

export default SongsComponent;
