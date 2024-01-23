import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./profile.modal.css";
import { useAuth0 } from "@auth0/auth0-react";
import { getUserByEmailToken } from "../../services/user.service";
import { useUserContext } from "../../utils/useUserContext";

const ProfileModal = () => {
  const {
    isAuthenticated,
    loginWithRedirect,
    logout,
    user,
    getAccessTokenSilently,
  } = useAuth0();
  const [imgSrc, setImgSrc] = useState(
    "https://res.cloudinary.com/du94mex28/image/upload/v1697795732/sonus/Portrait_Placeholder_qfearj.png"
  );
  const [, setIsLoading] = useState(false);
  const { currentUser } = useUserContext();
  const [isElementHidden, setIsElementHidden] = useState(true);

  const toggleElement = () => {
    setIsElementHidden(!isElementHidden);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.email) {
        setIsLoading(true);

        try {
          const token = await getAccessTokenSilently();
          const userData = await getUserByEmailToken(token, user.email);
          if (userData && userData.avatar) {
            setImgSrc(userData.avatar);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (user) {
      fetchUserData();
    }

    const handleOutsideClick = (e: Event) => {
      if (isElementHidden) return;
      const target = e.target as Element;
      if (
        target &&
        !target.closest(".profile-modal") &&
        target !== document.querySelector(".corner-user")
      ) {
        toggleElement();
      }
    };

    const handleEscapeKey = (e: { key: string }) => {
      if (isElementHidden) return;
      if (e.key === "Escape") {
        toggleElement();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isElementHidden, user, currentUser]);

  return (
    <section className="corner-items">
      <article className="corner-logo-img">
        <NavLink className="corner-img" to={"/"}></NavLink>
      </article>
      <article className="corner-user-container">
        {isAuthenticated ? (
          <>
            <div
              className={`profile-modal ${
                isElementHidden ? "hidden-modal" : "visible-modal"
              }`}
            >
              <NavLink to={`/profile/${currentUser ? currentUser.name : ""}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-user-square-rounded"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 13a3 3 0 1 0 0 -6a3 3 0 0 0 0 6z" />
                  <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z" />
                  <path d="M6 20.05v-.05a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v.05" />
                </svg>
              </NavLink>
              <button
                onClick={() =>
                  logout({ logoutParams: { returnTo: window.location.origin } })
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-logout"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                  <path d="M9 12h12l-3 -3" />
                  <path d="M18 15l3 -3" />
                </svg>
              </button>
            </div>
            <div
              style={{ backgroundImage: `url(${imgSrc})` }}
              className="corner-user"
              onClick={toggleElement}
            />
          </>
        ) : (
          <svg
            onClick={() => loginWithRedirect()}
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-login"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M15 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
            <path d="M21 12h-13l3 -3" />
            <path d="M11 15l-3 -3" />
          </svg>
        )}
      </article>
    </section>
  );
};

export default ProfileModal;
