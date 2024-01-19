const { VITE_API_URL } = import.meta.env

export const getAllArtists = async () => {
    try {
        const response = await fetch(`${VITE_API_URL}/artist`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error creating artist:', error);
        return null;
    }
};

export const getArtistById = async (artistId: string | undefined) => {
    try {
        const response = await fetch(`${VITE_API_URL}/artist/${artistId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error getting artist:', error);
        return null;
    }
};
