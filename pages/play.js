import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Play() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Career We Go</title>
        <meta name="description" content="An online game based on the hit podcast 'Career We Go'" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

        <div className={styles.App}>
          <header className={styles.header}>
            <p className={styles.subheader}>
              CAREER WE GO
            </p>
            <p className={styles.body}>
              The career of today's Career We Go player will appear here.
            </p>
          </header>
        </div>
    </div>
  )
}
