import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

export default function Home() {
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

        <div className={styles.App}>
          <header className={styles.header}>
            <p className={styles.logo}>
              CAREER<br />
              WE<br />
              GO
            </p>
            <p className={styles.subheader}>
              THE FOOTBALL TRIVIA WEBSITE
            </p>
            <div className={styles.ctas}>
              <p className={styles.ctaplay}>
                <Link style={{ padding: 24 }} href='play'>PLAY</Link>
              </p>
            </div>
          </header>
        </div>
        <span style={{position: 'fixed', bottom:0, fontSize: 12, opacity: 0.3}}>v1.8</span>
    </div>
  )
}
