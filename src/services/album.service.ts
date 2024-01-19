const { VITE_API_URL} = import.meta.env

export const getAllAlbums = async () => {
    const response = await fetch(`${VITE_API_URL}/album`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    const allAlbums = await response.json()
    return allAlbums
};

export const getAlbumById = async (albumId: string | undefined, userId: string) => {
    const response = await fetch(`${VITE_API_URL}/album/${albumId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    const album = await response.json();
    const isLiked = album?.LikedAlbums.some(
        (likedAlbum: { albumId: string | undefined; userId: string; }) => likedAlbum.albumId === albumId && likedAlbum.userId === userId
    );
    if (isLiked) {
        return { ...album, isLiked: true };
    } else {
        return { ...album, isLiked: false };
    }
};

export const getAlbumByArtist = async (artistId: string | undefined) => {
    const response = await fetch(`${VITE_API_URL}/album/artist/${artistId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    const albumByArtist = await response.json();
    return albumByArtist
};

export const updateUserLikes = async (userId: string, albumId: string, isLiked: boolean) => {
    const response = await fetch(`${VITE_API_URL}/album/${userId}/${albumId}`, {
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

export const getLikedAlbumsByUserId = async (userId: string, getAccessTokenSilently: any) => {
    const token = await getAccessTokenSilently();
    const response = await fetch(`${VITE_API_URL}/album/${userId}/likedAlbums`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error('Error al obtener los álbumes que le gustan al usuario');
    }
    const data = await response.json();
    return data;
};

export const likeAlbum = async (userId: string, albumId: string, getToken: any) => {
    const token = await getToken();
    const response = await fetch(`${VITE_API_URL}/album/${userId}/${albumId}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            albumId: albumId,
        })
    });
    if (!response.ok) {
        throw new Error('Error al dar "like" al álbum');
    }
    const likedAlbum = await response.json();
    return likedAlbum;
};

export const unlikeAlbum = async (userId: string, albumId: string) => {
    const response = await fetch(`${VITE_API_URL}/album/${userId}/${albumId}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        }
    });
    if (!response.ok) {
        throw new Error('Error al dar "unlike" al álbum');
    }
    const unlikedAlbum = await response.json();
    return unlikedAlbum;
};