import React from 'react'
import { Link, NavLink } from "react-router-dom";
import Player from "../../components/Player/Player";
import Navbar from "../../components/Navbar/Navbar";
import "./sidebar.css";
import { useEffect, useState } from "react";
import spain from '../../assets/svg/spain.svg';
import uk from '../../assets/svg/united kingdom.svg';
import { usePlayer } from "../../context/PlayerContext";
import { useUserContext } from '../../utils/useUserContext';
import { getLikedSongsByUserId, unlikeSong, updateUserLikes } from '../../services/song.service';
import i18n from '../../i18n';

const useLikedSongState = (currentSongId: string | undefined) => {
    const { currentUser } = useUserContext();
    const [isLiked, setIsLiked] = useState<boolean>(false);
  
    useEffect(() => {
      const fetchLikedSongs = async () => {
        try {
          if (currentUser?.id && currentSongId) {
            const likedSongs = await getLikedSongsByUserId(currentUser.id.toString());
            const isLiked = likedSongs.some((likedSong: { id: string }) => likedSong.id === currentSongId);
            setIsLiked(isLiked);
          }
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchLikedSongs();
    }, [currentUser?.id, currentSongId]);  
    return { isLiked, setIsLiked };
};

const Sidebar = () => {
    const { currentSong, shuffleSongs, isShuffled, setIsShuffled } = usePlayer();
    const { currentUser } = useUserContext();
    const { isLiked, setIsLiked } = useLikedSongState(currentSong?.id ? currentSong.id.toString() : undefined);

    const changeLanguage = (language: string) => {
        if (language === 'es') {
        i18n.changeLanguage(language);
        setIsElementHidden(true);
        } else {
        i18n.changeLanguage('en');
        setIsElementHidden(true);
        }
    };

    useEffect(() => {
        setIsLiked((currentSong?.isLiked || false) as boolean);
    }, [currentUser?.id, setIsLiked]);

    const handleLike = async () => {
        if (currentUser && currentSong) {
        try {
            const updatedIsLiked = !isLiked;

            setIsLiked(updatedIsLiked);

            currentSong.isLiked = updatedIsLiked;

            if (updatedIsLiked) {
                await updateUserLikes(
                    currentUser.id.toString(),
                    currentSong.id.toString(),
                    true
            );
            } else {
                await unlikeSong(
                    currentUser.id.toString(),
                    currentSong.id.toString()
                );
            }
        } catch (error) {
            console.error("Error in handleLike:", error);
        }
        }
    };
        
    const [isElementHidden, setIsElementHidden] = useState(true);

    const toggleElement = () => {
        setIsElementHidden(!isElementHidden);
    };

    useEffect(() => {
        const handleOutsideClick = (e: Event) => {
            if (isElementHidden) return;
            const target = e.target as Element;
            if (
                target &&
                !target.closest(".language-modal") &&
                target !== document.querySelector(".icon-tabler-language") && 
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
    }, [isElementHidden]);

    const handleShuffleClick = () => {
        setIsShuffled((prevIsShuffled) => {
            const newIsShuffled = !prevIsShuffled;
            shuffleSongs();
            return newIsShuffled;
        });
    };
    
    return (
        <aside className="control-panel">
            <main className="card-panel">
                <section className="control-panel-content">
                    <button onClick={() => history.back()} className="back">
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-arrow-narrow-left" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M5 12l14 0" />
                            <path d="M5 12l4 4" />
                            <path d="M5 12l4 -4" />
                        </svg>
                    </button>
                    <article className="title-panel">
                        <NavLink to={'/'}><div className="control-panel-logo" /></NavLink>
                    </article>
                    <div className="divider" />
                    <Navbar />
                    <div className="divider" />
                    <article className="player">
                        <div className="img-song">
                            <div style={{ backgroundImage: `url(${currentSong?.cover})` }} className="song-thumbnail" />
                            <div className="song-details">
                                <p className="song-title">{currentSong?.name || '‎'}</p>
                                <Link to={`/artist/${currentSong?.Artist[0].id}`} className="song-artist">{currentSong?.Artist[0].name || '‎'}</Link>
                            </div>
                        </div>
                        <div className="icons-wrapper">
                            <div className="fav-icon">
                                <div className="handle-like-wrapper" onClick={() => handleLike() }>
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
                            <div className="shuffle-icon">
                                <div onClick={() => handleShuffleClick()} className="handle-shuffle-wrapper">
                                    {isShuffled ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-arrows-shuffle" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="var(--primary-blue-dark)" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                            <path d="M18 4l3 3l-3 3" />
                                            <path d="M18 20l3 -3l-3 -3" />
                                            <path d="M3 7h3a5 5 0 0 1 5 5a5 5 0 0 0 5 5h5" />
                                            <path d="M21 7h-5a4.978 4.978 0 0 0 -3 1m-4 8a4.984 4.984 0 0 1 -3 1h-3" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-arrows-shuffle" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                            <path d="M18 4l3 3l-3 3" />
                                            <path d="M18 20l3 -3l-3 -3" />
                                            <path d="M3 7h3a5 5 0 0 1 5 5a5 5 0 0 0 5 5h5" />
                                            <path d="M21 7h-5a4.978 4.978 0 0 0 -3 1m-4 8a4.984 4.984 0 0 1 -3 1h-3" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                        </div>
                    </article>
                    <Player />
                    <div className="divider" />
                    <article className="language-wrapper">
                        <svg onClick={toggleElement} xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-language" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M4 5h7" />
                            <path d="M9 3v2c0 4.418 -2.239 8 -5 8" />
                            <path d="M5 9c0 2.144 2.952 3.908 6.7 4" />
                            <path d="M12 20l4 -9l4 9" />
                            <path d="M19.1 18h-6.2" />
                        </svg>
                        <div className={`language-modal ${isElementHidden ? 'hidden-language-modal' : 'visible-language-modal'}`}>
                            <button onClick={() => changeLanguage('es')}>
                                <img className="flag" src={spain} />
                            </button>
                            <button onClick={() => changeLanguage('en')}>
                                <img className="flag" src={uk} />
                            </button>
                        </div>
                    </article>
                </section>
            </main>
        </aside>
    )
}
export default Sidebar;