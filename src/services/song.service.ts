const { VITE_API_URL} = import.meta.env

import { Song } from "../interfaces/models.interfaces"

export const getAllSongs = async () =>{
        try {
            const response = await fetch(`${VITE_API_URL}/song`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error getting songs:', error);
            return null;
        }
};

export const getSongByAlbum = async (albumId: string | undefined) => {
    const response = await fetch(`${VITE_API_URL}/song/album/${albumId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    });
    const songByAlbum = await response.json()
    return songByAlbum
};

export const getSongByArtist = async (artistId: string | undefined) => {
    const response = await fetch(`${VITE_API_URL}/song/artist/${artistId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    const songByArtist = await response.json()
    return songByArtist
};

export const getSongByGenre = async (genreId: string | undefined) => {
    const response = await fetch(`${VITE_API_URL}/song/genre/${genreId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    const songByGenre = await response.json();
    return songByGenre
};

export const getSongByPlaylist = async (playlistId: string | undefined) => {
    const response = await fetch(`${VITE_API_URL}/song/playlist/${playlistId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    const songByPlaylist = await response.json();
    return songByPlaylist
};

export const updateSong = async (song : Song) => {
    const response = await fetch(`${VITE_API_URL}/song/${song.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        listened: song.listened
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let updatedSong = null;
    if (response.headers.get("content-type")?.includes("application/json")) {
      updatedSong = await response.json();
    }
    return updatedSong;
};

export const updateUserLikes = async (userId: string, songId: string, isLiked: boolean) => {
    const response = await fetch(`${VITE_API_URL}/song/${userId}/${songId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            isLiked: isLiked
        })
    });
    const updatedUserLikes = await response.json();
    return updatedUserLikes
};

export const getLikedSongsByUserId = async (userId: string | undefined) => {
    const response = await fetch(`${VITE_API_URL}/song/${userId}/likedSongs`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    });
    if (!response.ok) {
        throw new Error('Error al obtener las canciones que le gustan al usuario');
    }
    const song = await response.json();
    return song
};

export const likeSong = async (userId: string, songId: string, getToken: any) => {
    const token = await getToken();
    const response = await fetch(`${VITE_API_URL}/song/${userId}/${songId}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            songId: songId,
        })
    });
    if (!response.ok) {
        throw new Error('Error al dar "like" a la canción');
    }
    const likedSong = await response.json();
    return likedSong;
};

export const unlikeSong = async (userId: string, songId: string) => {
    const response = await fetch(`${VITE_API_URL}/song/${userId}/${songId}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        }
    });
    if (!response.ok) {
        throw new Error('Error al dar "unlike" al song');
    }
    const unlikedSong = await response.json();
    return unlikedSong;
};