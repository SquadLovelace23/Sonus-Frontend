const { VITE_API_URL } = import.meta.env

import { Playlist } from "../interfaces/models.interfaces"

export const getAllPlaylists = async () => {
    try {
        const response = await fetch(`${VITE_API_URL}/playlist`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        const data = await response.json()
        return data

    } catch (error) {
        console.error('Error getting playlists:', error);
        return null;
    }
};

export const getAllPlaylistsByUserId = async (userId: string, getToken: any) => {
    const token = await getToken();
    try {
        const response = await fetch(`${VITE_API_URL}/playlist/user/${userId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error getting playlist by userId:', error);
        return null;
    }
};

export const createPlaylistByUserId = async (playlist: Playlist, userId: string, token: string,) => {
    try {
        const response = await fetch(`${VITE_API_URL}/playlist/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                name: playlist.name,
                cover: playlist.cover,
                numSong: playlist.numSong,
                songId: playlist.songId,
                userId: playlist.userId,
                likedPlaylist: playlist.likedPlaylist
            })
        })
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error creating playlist:', error);
        return null;
    }
};

export const getPlaylistById = async (playlistId: string | undefined, userId: string) => {
    const response = await fetch(`${VITE_API_URL}/playlist/${playlistId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    });
    const playlist = await response.json();
    const isLiked = playlist?.LikedPlaylist.some(
        (likedPlaylist: { playlistId: string | undefined; userId: string; }) => likedPlaylist.playlistId === playlistId && likedPlaylist.userId === userId
    );
    if (isLiked) {
        return { ...playlist, isLiked: true };
    } else {
        return { ...playlist, isLiked: false };
    }
    return playlist
};

export const deletePlaylist = async (token: string, playlistId: string) => {
    const response = await fetch(`${VITE_API_URL}/playlist/${playlistId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
    const deletedPlaylist = await response.json()
    return deletedPlaylist
};

export const updateUserLikes = async (userId: string, playlistId: string, isLiked: boolean) => {
    const response = await fetch(`${VITE_API_URL}/playlist/${userId}/${playlistId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            isLiked: isLiked
        })
    });
    const updatedUserLikes = await response.json();
    return updatedUserLikes;
};

export const getLikedPlaylistsByUserId = async (userId: string, getAccessTokenSilently: any) => {
    const token = await getAccessTokenSilently();
    const response = await fetch(`${VITE_API_URL}/playlist/${userId}/likedPlaylists`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const likedPlaylists = await response.json();
    return likedPlaylists;
};

export const likePlaylist = async (userId: string, playlistId: string, getToken: any) => {
    const token = await getToken();
    const response = await fetch(`${VITE_API_URL}/playlist/${userId}/${playlistId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            playlistId: playlistId,
        })
    });
    if (!response.ok) {
        throw new Error('Error liking the playlist');
    }
    const likedPlaylist = await response.json();
    return likedPlaylist;

};

export const unlikePlaylist = async (userId: string, playlistId: string) => {
    const response = await fetch(`${VITE_API_URL}/playlist/${userId}/${playlistId}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        }
    });
    if (!response.ok) {
        throw new Error('Error unliking the playlist');
    }
    const unlikedPlaylist = await response.json();
    return unlikedPlaylist;
};

export const addSongToPlaylist = async (playlistId: string, songId: string | undefined, userId: string, token: string) => {
    try {
        const response = await fetch(`${VITE_API_URL}/playlist/${playlistId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                songId: songId,
                userId: userId,
            }),
        });
        const addedSongToPlaylist = await response.json();
        return addedSongToPlaylist;
    } catch (error) {
        console.error('Error adding song to playlist:', error);
        throw null;
    }
};

export const deleteSongFromPlaylist = async (playlistId: string, songId: string, token: string) => {
    try {
        const response = await fetch(`${VITE_API_URL}/playlist/song/${playlistId}/${songId}`, {
            method: 'DELETE',
            headers:{
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
        })
        if (!response.ok) {
            throw new Error('Error deleting song from playlist');
        }
        const deletedSong = await response.json()
        return deletedSong
    } catch (error) {
        console.error('Error deleting song from playlist', error)
        throw null
    }
};