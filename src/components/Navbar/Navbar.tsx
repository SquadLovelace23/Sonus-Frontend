import React from 'react'
import {NavLink} from 'react-router-dom';
import './navbar.css';
import { useUserContext } from '../../utils/useUserContext';
import {useTranslation} from 'react-i18next';

const Navbar = () => {
    const {t} = useTranslation();
    const {currentUser} = useUserContext();
    
    return (
        <aside className="menu-container">
            <section className="menu-panel">
                <ul className="list">
                    <NavLink to="/">
                        <li className="list-element">
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon-tabler-home icon" width="32" height="32" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M5 12l-2 0l9 -9l9 9l-2 0"></path>
                                <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"></path>
                                <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"></path>
                            </svg>
                            <p className="list-text">{t('Home')}</p>
                        </li>
                    </NavLink>
                    <NavLink to="/search">
                        <li className="list-element">
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon-tabler-search icon" width="32" height="32" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
                                <path d="M21 21l-6 -6"></path>
                            </svg>
                            <p className="list-text">{t('Search')}</p>
                        </li>
                    </NavLink>
                    <NavLink to={`/library/${currentUser?.id}`}>
                        <li className="list-element">
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-library" width="32" height="32" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 3m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" />
                                <path d="M4.012 7.26a2.005 2.005 0 0 0 -1.012 1.737v10c0 1.1 .9 2 2 2h10c.75 0 1.158 -.385 1.5 -1" />
                                <path d="M11 7h5" />
                                <path d="M11 10h6" />
                                <path d="M11 13h3" />
                            </svg>
                            <p className="list-text">{t('Library')}</p>
                        </li>
                    </NavLink>
                </ul>
            </section>
        </aside>
    )
}

export default Navbar