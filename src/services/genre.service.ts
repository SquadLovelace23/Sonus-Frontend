const { VITE_API_URL } = import.meta.env

export const getGenreById = async (genreId: string | undefined) => {
    const response = await fetch(`${VITE_API_URL}/genre/${genreId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    const genreById = await response.json()
    return genreById
};

export const getAllGenres = async () => {
    const response = await fetch(`${VITE_API_URL}/genre`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    const allGenres = await response.json()
    return allGenres
};