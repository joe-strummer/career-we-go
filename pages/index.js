import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react';
import Snowfall from 'react-snowfall';

import { getWinStreak } from '../utils/streaks';
import styles from '../styles/Home.module.css'


function HowToPlay({ display=false, onCloseAction}) {
  return (
    <div style={{
      width: '100%',
      height: '100vh',
      background: '#00000030',
      position: 'absolute',
      top: 0,
      display: display ? 'block' : 'none'
    }} onClick={onCloseAction}>
      <div className={styles.overlayHowToPlay}>
          <h1>How To Play</h1>
          <p>
              Club by club a player's career stats will be revealed.
          </p>
          <p>
              When you think you know, check by pressing Answer.
          </p>
          <p>
              You're playing against the clock, so be sure to share with us how well you did afterwards!
          </p>
      </div>
    </div>
  );
}

export default function Home() {
  const [darkMode, setDarkMode] = useState(true);
  const [winStreak, setWinStreak] = useState('...');
  const [instructionOverlay, setInstructionOverlay] = useState(false);

  const darkModeOn = () => {
    setDarkMode(true);
    localStorage.setItem('darkMode', true);
    document.body.classList.add('dark');
  };

  const darkModeOff = () => {
    setDarkMode(false);
    localStorage.setItem('darkMode', false);
    document.body.classList.remove('dark');
  }

  useEffect(() => {
    document.body.classList.add('dark');
    const darkLocal = localStorage.getItem('darkMode');
    if (darkLocal==='false') {
      darkModeOff();
    }

    setWinStreak(getWinStreak());
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Career We Go</title>
        <meta content="text/html; charset=UTF-8" name="Content-Type" />
        <meta name="description" content="An online game based on the hit podcast 'Career We Go'" />
        
        {/* Facebook previews */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.careerwego.com" />
        <meta property="og:title" content="Career We Go: Online" />
        <meta property="og:description" content="A daily online challenge based on the football trivia podcast Career We Go" />
        <meta property="og:image" content="https://www.careerwego.com/card.jpg" />
        
        {/* Twitter previews */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@CareerWeGo" />
        <meta name="twitter:domain" value="careerwego.com" />
        <meta name="twitter:title" value="Career We Go: Online" />
        <meta name="twitter:description" value="A daily online challenge based on the football trivia podcast Career We Go" />
        <meta name="twitter:image" content="https://www.careerwego.com/card.jpg" />
        <meta name="twitter:url" value="https://www.careerwego.com" />

        <link rel="icon" href="/favicon.ico" />
      </Head>

        <div className={styles.App} style={{ filter: instructionOverlay ? 'blur(8px)' : 'none'}}>
          <a className={styles.howToPlayCTA} onClick={() => setInstructionOverlay(true)}>?</a>
          <header className={styles.header}>
            <Snowfall 
              color="#eee7d6cc" 
              radius= {[0.1, 0.5]}
              speed= {[0.1, 0.5]}
              wind= {[-0.5, 0]}
               />
            <p className={styles.logo}>
              CAREER<br />
              WE<br />
              GO
            </p>
            <p className={styles.subheader}>
              THE FOOTBALL TRIVIA PODCAST
            </p>
            <div className={styles.ctas}>
              <p className={styles.ctaplay}>
                <Link href='play'>PLAY</Link>
              </p>
              <p className={styles.ctaplay}>
                <Link href='https://linktr.ee/careerwego'>LISTEN</Link>
              </p>
              <p className={styles.ctaplay}>
                <Link href='mailto:careerwegopod@gmail.com'>CONTACT</Link>
              </p>
            </div>
          </header>
        </div>
        <HowToPlay display={instructionOverlay} onCloseAction={() => setInstructionOverlay(false)} />
        <button 
          className={styles.darkMode} 
          onClick={() => { darkMode ? darkModeOff() : darkModeOn() }}>
            {darkMode? '☀️ LIGHT' : '🌑 DARK'} MODE
        </button>
        <span style={{position: 'fixed', bottom:0, left: 0, fontSize: 12, opacity: 0.3}}>v1.10</span>
    </div>
  )
}
