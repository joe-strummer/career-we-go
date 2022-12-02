import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Career We Go</title>
        <meta name="description" content="An online game based on the hit podcast 'Career We Go'" />
        <meta charSet="UTF-8" />
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
