import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import CardContainer from "../../components/CardContainer/CardContainer";
import { UserType } from "../../context/UserContext";
import { createUser, getUserByEmail } from "../../services/user.service";
import { useUserContext } from "../../utils/useUserContext";

const Home = () => {
    const { getAccessTokenSilently, user } = useAuth0();
    const { setCurrentLoggedUser } = useUserContext();

    useEffect(() => {
        (async function fetchUserData() {
            try {
                if (user?.email) {
                    const userData = await getUserByEmail(getAccessTokenSilently, user?.email);
                    const userFetched = userData[1] as UserType;
                    if (userData[1] != null) {
                        setCurrentLoggedUser(userFetched);
                    } else {
                        const newUser = {
                            name: user.name,
                            email: user.email,
                            password: user.email,
                            avatar: user.picture
                        };
                        const userCreated = await createUser(newUser);
                        setCurrentLoggedUser(userCreated);
                    }
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        })();
    }, [user]);

    return (
        <>
            <CardContainer />
        </>
    )
}

export default Home