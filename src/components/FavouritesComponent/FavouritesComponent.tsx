import React from 'react';
import { useEffect, useState } from 'react';
import Footer from '../Footer/Footer';
import ProfileModal from '../ProfileModal/ProfileModal';
import './favourites.component.css';
import SongsComponent from '../SongsComponent/SongsComponent';
import { Playlist } from '../../interfaces/models.interfaces';
import { useParams } from 'react-router-dom';
import { getLikedSongsByUserId } from '../../services/song.service';
import { useAuth0 } from '@auth0/auth0-react';
import { useTranslation } from 'react-i18next';

const FavouritesComponent = () => {
    const { id } = useParams<{ id?: string }>();
    const [favourites] = useState<Playlist | null>(null);
    const [song, setSong] = useState([]);
    const { user } = useAuth0();
    const {t} = useTranslation()
    const [updateSongs, setUpdateSongs] = useState(false);
    
    const handleUpdateSongs = () => {
        setUpdateSongs((prev) => !prev);
    }

    useEffect(() => {
        const fetchSongFavourites = async () => {
            try {
                const favouritesSongData = await getLikedSongsByUserId(id);
                if (favouritesSongData) {
                    setSong(favouritesSongData);
                }
            } catch (error) {
                console.error(error)
            }
        }
        fetchSongFavourites();
    }, [id, updateSongs])
    
    return (
        <>
            <main className="display-panel">
                <section className="card-main">
                    <ProfileModal />
                    <div className="playlist-display-panel-content">
                        <section className="playlist-wrapper">
                            <div style={{ backgroundImage: `url(https://res.cloudinary.com/dwsgzijc7/image/upload/v1701262675/Sonus/Albums/fav_ndgbyk.png)` }} className="playlist-details-cover" />
                            <article className="playlist-details">
                                    <p className="playlist-details-name">{t('Favourites')}</p>
                                    <p className="playlist-details-artist-name">{user?.name}</p>
                            </article>
                        </section>
                        <SongsComponent songs={song} entity={favourites} updateSong={handleUpdateSongs}/>
                        <Footer />
                    </div>
                </section>
            </main>
        </>
    )
}

export default FavouritesComponent