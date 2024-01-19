import { useState, ChangeEvent, useEffect } from "react";
import './profile.info.css';
import { useAuth0 } from "@auth0/auth0-react";
import { getUserByEmailToken, updateUser, getUserByName, unfollowUser, followUser } from "../../services/user.service";
import { uploadRequest } from "../../services/upload.service";
import toast, { Toaster } from 'react-hot-toast';
import { useTranslation } from "react-i18next";
import { NavLink, useParams } from 'react-router-dom';
import { getAllPlaylistsByUserId } from "../../services/playlist.service";
import { Playlist } from "../../interfaces/models.interfaces";
import { useUserContext } from "../../utils/useUserContext";
 
interface UserDetails {
    email: string;
    avatar: string;
};

const ProfileInfo = () => {
    const { user, getAccessTokenSilently } = useAuth0();
    const [imgSrc, setImgSrc] = useState("https://res.cloudinary.com/du94mex28/image/upload/v1697795732/sonus/Portrait_Placeholder_qfearj.png");
    const [, setIsLoading] = useState(false);
    const {t} = useTranslation()
    const { name } = useParams();
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [userPlaylists, setUserPlaylists] = useState<Playlist[]>([]);
    const [, setIsLoadingPlaylists] = useState(true);
    const [followed, setFollowed] = useState(false);
    const [followedUserId, setFollowedUserId] = useState<string | null>(null);
    const [followedUsers, setFollowedUsers] = useState<number>(0);
    const [followedBy, setFollowedBy] = useState<number>(0);
    const { currentUser } = useUserContext()

    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true);
            setIsLoadingPlaylists(true);
        
            try {
                const token = await getAccessTokenSilently();
                const userDataArray = await getUserByName(token, name || "");
                if (userDataArray) {
                    setImgSrc(() => userDataArray.avatar);
                    setUserDetails(userDataArray);
                    setFollowedUsers(userDataArray.followedUserId.length)
                    setFollowedBy(userDataArray.followedById.length)
                    setFollowedUserId(userDataArray.id);
                    const userPlaylistsData = await getAllPlaylistsByUserId(userDataArray.id, getAccessTokenSilently);
                    setUserPlaylists(userPlaylistsData);
                    setIsLoadingPlaylists(false);
                    if (userPlaylistsData && userPlaylistsData.length > 0) {
                        setUserPlaylists(userPlaylistsData);
                    }
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchUserData();
    }, [name, getAccessTokenSilently]);

    useEffect(() => {
        const checkFollow = async () => {
            try {
                const token = await getAccessTokenSilently();
                const followedUsers = await getUserByName(token, name || "");
                if (followedUsers && followedUsers.FollowedUser && followedUsers.FollowedUser.length > 0) {
                    const isFollowed = followedUsers.FollowedUser[0].id === currentUser?.id
                    setFollowed(isFollowed);
                }
            } catch (error) {
                console.error("Error", error);
            }
        };
    
        if (followedUserId) {
            checkFollow();
        }
    }, [name, getAccessTokenSilently, followedUserId]);

    const handleFollowClick = async () => {
        try {
            if (followed) {
                if (currentUser && followedUserId) {
                    await unfollowUser(currentUser.id, followedUserId);
                }
            } else {
                if (currentUser && followedUserId) {
                    await followUser(currentUser.id, followedUserId);
                }
            }
            const updatedFollowedUsers = followed ? followedUsers - 1 : followedUsers + 1;
            setFollowedUsers(updatedFollowedUsers);
            setFollowed((prevFollowed) => !prevFollowed);
        } catch (error) {
            console.error("Error", error);
        }
    };

    const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0 && (user?.email)) {
            const file = e.target.files[0];
            const token = await getAccessTokenSilently();
            const userData = await getUserByEmailToken(token, user.email);

            const uploadedImageUrl = await uploadRequest(file);
            if (uploadedImageUrl) {
                const updatedUser = await updateUser(userData.id, {
                    ...userData,
                    avatar: uploadedImageUrl,
                }, getAccessTokenSilently);
                if (updatedUser) {
                    setImgSrc(updatedUser.avatar)
                    toast.success(t('Image changed successfully!'))
                }
            }
        }
    }

    return (
        <>
            <Toaster
                position="top-right"
                toastOptions={{
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
            <main className="display-panel">
                <section className="card-main">
                    <div className="display-panel-content">
                        <section className="user">
                            <article style={{ backgroundImage: `url(${imgSrc})` }} className="user-img" />
                            {name === user?.name && (
                                <article className="camera-container">
                                    <input className="img-input" type="file" onChange={handleChange}/>
                                    <svg xmlns="http://www.w3.org/2000/svg" className='icon-tabler-camera-plus' width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                        <path d="M12 20h-7a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v3.5"></path>
                                        <path d="M16 19h6"></path>
                                        <path d="M19 16v6"></path>
                                        <path d="M9 13a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
                                    </svg>
                                </article>
                            )}
                            <article className="user-details">
                                <p className="name-user">{name}</p>
                                <p className="email-user">{userDetails && userDetails.email}</p>
                            </article>
                            <div className="follow-container">
                                {name !== user?.name && (
                                    <article className="follow-wrapper">
                                        <button className="follow-btn" onClick={handleFollowClick}>
                                            <p className="follow-btn-text">{followed ? t('Following') : t('Follow +')}</p>
                                        </button>
                                    </article>
                                )}
                                <article className="followers-wrapper">
                                    <p className="follow-btn-text">{t('Followers')}</p>
                                    <p className="follow-btn-text">{followedUsers}</p>
                                </article>
                                <article className="followers-wrapper">
                                    <p className="follow-btn-text">{t('Following')}</p>
                                    <p className="follow-btn-text">{followedBy}</p>
                                </article>
                            </div>
                        </section>
                        <h2 className="playlist-title">{t('Playlists')}</h2>
                        <article className="library-playlist-swiper">
                                {userPlaylists.map((playlist) => (
                                    <NavLink key={String(playlist.id)} to={`/playlist/${playlist.id}`} className="playlist">
                                        <div style={{ backgroundImage: `url(${playlist.cover})`}} className="image-playlist" />
                                        <p className="playlist-name">{playlist.name}</p>
                                    </NavLink>
                                ))}
                        </article>
                    </div>
                </section>
            </main>
        </>
    )
}

export default ProfileInfo