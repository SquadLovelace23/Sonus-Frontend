import React from 'react';
import Footer from '../Footer/Footer';
import ProfileModal from '../ProfileModal/ProfileModal';
import './genre.css';
import SongsComponent from '../SongsComponent/SongsComponent';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Genre } from '../../interfaces/models.interfaces';
import { getGenreById } from '../../services/genre.service';
import { getSongByGenre } from '../../services/song.service';

const GenreComponent = () => { 
    const { id } = useParams<{ id?: string }>();
    const [genre, setGenre] = useState<Genre | null>(null);
    const [songs, setSongs] = useState([]);
    const [updateSongs, setUpdateSongs] = useState(false);
    
    const handleUpdateSongs = () => {
        setUpdateSongs((prev) => !prev);
    }
    useEffect(() => {
        const fetchGenre = async () => {
            try {
                const genreData = await getGenreById(id);
                if (genreData) {
                    setGenre(genreData);
                }
            } catch (error) {
                console.error(error)
            }
        }
        fetchGenre();
    }, [id])

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const songData = await getSongByGenre(id);
                if (songData) {
                    setSongs(songData);
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchSongs();
    }, [id, updateSongs])

    return (
        <>
            <main className="display-panel">
                <section className="card-main">
                    <ProfileModal />
                    <div className="genre-display-panel-content">
                            <section className="genre-wrapper">
                                <div className="genre-details-cover" />
                                <article className="genre-details">
                                    {genre && (
                                        <React.Fragment key={String(genre.id)}>
                                            <p className="genre-details-name">{genre.name}</p>
                                            <p className="genre-details-artist-name">Sonus</p>
                                        </React.Fragment>
                                    )}
                                </article>
                            </section>
                            <SongsComponent songs={songs} entity={genre} updateSong={handleUpdateSongs}/>
                        <Footer />
                    </div>
                </section>
            </main>
        </>
    )
}

export default GenreComponent