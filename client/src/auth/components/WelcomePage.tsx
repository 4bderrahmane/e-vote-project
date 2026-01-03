import {TypeAnimation} from 'react-type-animation'
import {useAuth} from '../useAuth.ts'
import {LogIn, UserPlus, Vote} from 'lucide-react'
import {useTranslation} from 'react-i18next';

import LanguageSwitcher from '@components/LanguageSwitcher.tsx';
import "../WelcomePage.css"

export default function WelcomePage() {
    const {t} = useTranslation('auth');
    const {login, register} = useAuth();
    return (
        <main className="welcome-root">
            <div className="language-switcher-container">
                <LanguageSwitcher/>
            </div>
            <div className="welcome-background-shape shape-1"></div>
            <div className="welcome-background-shape shape-2"></div>

            <section className="welcome-card">
                <div className="welcome-icon-wrapper">
                    <Vote size={48} className="welcome-hero-icon"/>
                </div>

                <h1 className="welcome-title">
                    {t('welcome.title')} <br/>
                    <span className="highlight-text">
             <TypeAnimation
                 sequence={[
                    t('welcome.voiceOfPeople'),
                     2000,
                     t('welcome.platformForChange'),
                     2000,
                     t('welcome.votingApplication'),
                     2000,
                 ]}
                 wrapper="span"
                 speed={50}
                 repeat={Infinity}
             />
          </span>

                </h1>
                <p className="welcome-desc">
                    {t('welcome.description')}
                </p>

                <div className="welcome-actions">
                    <button onClick={() => register()} className="btn primary" aria-label="Register">
                        <UserPlus size={18}/>
                        <span>{t('welcome.createAccount')}</span>
                    </button>

                    <button onClick={() => login()} className="btn outline" aria-label="Login">
                        <LogIn size={18}/>
                        <span>{t('welcome.login')}</span>
                    </button>
                </div>
            </section>
        </main>
    )
}
