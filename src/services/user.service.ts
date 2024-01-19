import { User } from "../interfaces/models.interfaces";

const { VITE_API_URL } = import.meta.env

export const getAllUsers = async () => {
    try {
        const response = await fetch(`${VITE_API_URL}/user`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            console.error('Error getting users:', response.status);
            return null;
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error getting users:', error);
        return null;
    }
};

export const createUser = async (userObject: {}) => {
    try {
        const response = await fetch(`${VITE_API_URL}/user`, {

            method: "POST",
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify(userObject)
        });
        const dataFetched = await response.json();
        return dataFetched;
    }
    catch (error) {
        console.error('Error creating user:', error);
        return null;
    }
};

export const getUserByEmail = async (getToken: any, userEmail: string, ) => {
    try {
        const token = await getToken();
        const response = await fetch(`${VITE_API_URL}/user/email/${userEmail}`, {
            method: "GET",
            headers: {
                authorization: `Bearer ${token}`,
                "Content-type": "application/json; charset=UTF-8"
            }
        });
        const dataFetched = await response.json();
        return [response, dataFetched];
    } catch (error) {
        console.error('Error fetching user by email:', error);
        return [null, null];
    }
};

export const getUserByName = async (token: string, userName: string) => {
    try {
        const response = await fetch(`${VITE_API_URL}/user/name/${userName}`, {
            method: "GET",
            headers: {
                authorization: `Bearer ${token}`,
                "Content-type": "application/json; charset=UTF-8"
            }
        });
        const dataFetched = await response.json();
        return dataFetched;
    } catch (error) {
        console.error('Error fetching user by name:', error);
        return [null, null];
    }
};

export const getUserByEmailToken = async (token: string, userEmail: string, ) => {
    try {
        const response = await fetch(`${VITE_API_URL}/user/email/${userEmail}`, {
            method: "GET",
            headers: {
                authorization: `Bearer ${token}`,
                "Content-type": "application/json; charset=UTF-8"
            }
        });
        const dataFetched = await response.json();
        return dataFetched;
    } catch (error) {
        console.error('Error fetching user by email:', error);
        return [null, null];
    }
};

export const updateUser = async (userId: string, user: User, getToken: any) => {
    const token = await getToken();
    try {
        const response = await fetch(`${VITE_API_URL}/user/${userId}`, {
            method: "PATCH",
            headers: {
                authorization: `Bearer ${token}`,
                "Content-type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({
                name: user.name,
                email: user.email,
                avatar: user.avatar
            })
        });
        const updatedUser = await response.json();
        return updatedUser;
    } catch (error) {
        console.error('Error updating user:', error);
        return null;
    }
};

export const followUser = async (userId: string, followedUserId: string) => {
    try {
        const response = await fetch(`${VITE_API_URL}/user/${userId}/${followedUserId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            console.error('Error following user:', response.status);
            return null;
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error following user:', error);
        return null;
    }
};

export const unfollowUser = async (userId: string, followedUserId: string) => {
    try {
        const response = await fetch(`${VITE_API_URL}/user/${userId}/${followedUserId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            console.error('Error unfollowing user:', response.status);
            return null;
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error unfollowing user:', error);
        return null;
    }
};