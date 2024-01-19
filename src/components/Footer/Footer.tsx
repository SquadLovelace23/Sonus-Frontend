import './footer.css';
import ait from '../../assets/svg/logo.svg'; 
import { NavLink } from 'react-router-dom';
import {useTranslation} from 'react-i18next';

const Footer = () => {
    const {t} = useTranslation()

    return (
        <footer className='footer-container'>
            <section className='socials-wrapper'>
                <NavLink to={'https://assemblerinstitute.com'} target='_blank'>
                    <img src={ait} className='ait-svg'/>
                </NavLink>
            </section>
            <section className='info-wrapper'>
                <p>© 2023 Sonus® {t('developed at AIT by')}</p>
            </section>
            <section className='rights-wrapper'>
                <p>
                    <NavLink className="social-link" to='https://github.com/antonyoandrei' target='_blank'>Antonyo Andrei</NavLink>,{' '}
                    <NavLink className="social-link" to='https://github.com/MiguelMayans' target='_blank'>Miguel Mayans</NavLink>,{' '}
                    <NavLink className="social-link" to='https://github.com/aaron25484' target='_blank'>Aaron de los Santos</NavLink>,{' '}
                    <NavLink className="social-link" to='https://github.com/YannPares' target='_blank'>Yann Parés</NavLink> {t('and')}{' '}
                    <NavLink className="social-link" to='https://github.com/LucasRiestra' target='_blank'>Lucas Riestra</NavLink>
                </p>
            </section>
        </footer>
    )
}

export default Footer