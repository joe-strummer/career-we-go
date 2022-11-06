import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useState } from 'react';

export default function Play() {    
    const career = [ "1983–1991	Millwall	220	(93)",
        "1985	→ Aldershot (loan)	5	(0)",
        "1985	→ Djurgårdens IF (loan)	21	(13)",
        "1991–1992	Nottingham Forest	42	(14)",
        "1992–1997	Tottenham Hotspur	166	(75)",
        "1997–2001	Manchester United	104	(31)",
        "2001–2003	Tottenham Hotspur	70	(22)",
        "2003–2004	Portsmouth	32	(9)",
        "2004–2007	West Ham United	76	(28)",
        "2007–2008	Colchester United	19	(3)"
    ];

    const hiddenStyle = {
        opacity: 0
    }

    const shownStyle = {
        opacity: 1
    }

    const [count, setCount] = useState(0);

    setInterval(() => { 
        console.log('called', count); setCount(count + 1);
    }, 3000);

    return (
        <div className={styles.container}>
            <Head>
            <title>Career We Go</title>
            <meta name="description" content="An online game based on the hit podcast 'Career We Go'" />
            <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className={styles.App}>
                <p className={styles.subheader}>
                    CAREER WE GO
                </p>
                <p className={styles.body}>
                    The career of today's Career We Go player will appear here.
                </p>
                <div className={styles.career}>
                    {
                        career.map((team, i) => {
                            console.log(count, i);
                            const style = count < i ? hiddenStyle : shownStyle;
                            return (<p key={i} style={style}>
                                {team}
                            </p>);
                        })
                    }
                </div>
            </div>
        </div>
    )
}
