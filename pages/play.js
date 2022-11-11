import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useState, useEffect, useRef } from 'react';

export default function Play() {    
    const TIME = 2000;

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

    const answer = "Teddy Sherringham"

    const acceptableAnswers = ['teddy sherringham', 
            'teddy sheringham', 
            'teddy sherringam', 
            'teddy sheringam'];


    const baseStyle = {
        transition: 'opacity 800ms'
    };

    const hiddenStyle = {
        ...baseStyle,
        opacity: 0
    }

    const shownStyle = {
        ...baseStyle,
        opacity: 1
    }

    const [count, setCount] = useState(0);

    const [guessMode, setGuessMode] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => { 
            if (count >= career.length - 1) {
                console.log("CLEAR!");
                return clearInterval(interval);
            }
            console.log('called', count); 
            console.log('guessMode', guessMode)
            setCount(count + 1);
        }, TIME);
        return () => clearInterval(interval);
    });

    return (
        <div className={styles.container}>
            <Head>
            <title>Career We Go</title>
            <meta name="description" content="An online game based on the hit podcast 'Career We Go'" />
            <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className={styles.App}>
                <div style={{
                    filter: guessMode ? 'blur(8px)' : 'none'
                }}>
                    <p className={styles.subheader}>
                        CAREER WE GO
                    </p>
                    <p className={styles.body}>
                        The career of today's Career We Go player will appear here.
                    </p>


                    <div className={styles.career}>
                        {
                            career.map((team, i) => {
                                const style = count < i ? hiddenStyle : shownStyle;
                                return (<p key={i} style={style}>
                                    {team}
                                </p>);
                            })
                        }
                    </div>
                    <button style={{
                        padding: '20px 40px',
                        opacity: 0.7,
                        background: 'red',
                        color: 'white',
                        fontSize: '18px'
                    }} onClick={() => { 
                        setGuessMode(true);
                        
                    }}>GUESS</button>
                </div>
                <GuessingPanel active={guessMode} answer={answer} acceptableAnswers={acceptableAnswers} />
            </div>
        </div>
    )
}

const GuessingPanel = ({ active, answer, acceptableAnswers }) => {
    const panelStyle = {
        display: active ? 'block' : 'none',
        position: 'absolute',
        height: '100vh',
        width: '100vw',
        top: 0,
        left: 0,
        background: 'rgba(0,0,0,0.8)',
        padding: '20px',
    };

    const inputStyle = {
        display: 'block',
        width: 'calc(100%)',
        padding: '20px',
        margin: '0px',
        fontSize: '16px'
    };

    const inputEl = useRef(null);

    useEffect(() => {
        inputEl.current.focus();
    })

    const [ guess, setGuess ] = useState('');

    const handleChange = (event) => {
        setGuess(event.target.value);
    }
    
    const handleSubmit = (event) => {
        const trimmedGuess = guess.trim().toLowerCase()
        if (acceptableAnswers.includes(trimmedGuess)) {
            alert(`YES! ${answer} was correct`);
        } else {
            alert(`${guess} was not correct`)
        }
        event.preventDefault();
    }

    return (<div style={panelStyle}>
        GUESSING TIME !
        <form onSubmit={handleSubmit}> 
            <input 
                ref={inputEl} 
                autofocus={true}
                style={inputStyle} type="text" 
                onSubmit={() => { alert('Guessed!')}}
                value={ guess }
                onChange={handleChange}
            />
            <input type="submit" value="Submit" />
        </form>
    </div>);
};