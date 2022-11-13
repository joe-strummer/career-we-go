import Head from 'next/head';
import Link from 'next/link'
import { useRouter } from 'next/router';
import { stringSimilarity } from "string-similarity-js";
import styles from '../../styles/Home.module.css';
import { useState, useEffect, useRef } from 'react';

const data = {
    1: {
        career: [ "1983–1991	Millwall	220	(93)",
            "1985	→ Aldershot (loan)	5	(0)",
            "1985	→ Djurgårdens IF (loan)	21	(13)",
            "1991–1992	Nottingham Forest	42	(14)",
            "1992–1997	Tottenham Hotspur	166	(75)",
            "1997–2001	Manchester United	104	(31)",
            "2001–2003	Tottenham Hotspur	70	(22)",
            "2003–2004	Portsmouth	32	(9)",
            "2004–2007	West Ham United	76	(28)",
            "2007–2008	Colchester United	19	(3)"],
        answer: "Teddy Sherringham",
        acceptableAnswers: ['teddy sherringham', 
            'teddy sheringham', 
            'teddy sherringam', 
            'teddy sheringam',
            'sherringham']
    },
    2: {
        career: [
            "2004–2006	Chelmsley Town reserves	3	(0)",
            "2004–2006	Chelmsley Town	56	(23)",
            "2006–2010	Walsall	123	(27)",
            "2006–2007	→ Halesowen Town (loan)	10	(8)",
            "2010–2021	Watford	389	(131)",
            "2021–	Birmingham City	41	(7)"
        ],
        answer: "Troy Deeney",
        acceptableAnswers: ['troy deeney', 'troy deeny', 'troy deenie', 'troy deny', 'deeney', 'deeny']
    },
    3: {
        career: [
           "2006–2017	Newcastle United	160	(0)",
           "2007–2008	→ Falkirk (loan)	22	(0)",
           "2008–2009	→ Carlisle United (loan)	9	(0)",
           "2016–2017	→ Ajax (loan)	0	(0)",
           "2016–2017	→ Jong Ajax (loan)	6	(0)",
           "2017	→ AZ (loan)	16	(0)",
           "2017	→ Brighton & Hove Albion (loan)	0	(0)",
           "2017–2018	Brighton & Hove Albion	0	(0)",
           "2018–	Norwich City	160	(0)",
        ],
        answer: "Tim Krul",
        acceptableAnswers: ["tim krul", "tim krule", "tim krool", "timothy krul", "tim crool", "tim crul", "tim crule", "tim cruel", 'tim kruel', 'krul']
    },
    4: {
        career: [
            "2012–2019	Genk	83	(27)",
            "2012–2013	→ Lommel United (loan)	12	(7)",
            "2013–2014	→ Westerlo (loan)	17	(3)",
            "2014–2015	→ Lommel United (loan)	30	(16)",
            "2015–2016	→ OH Leuven (loan)	30	(8)",
            "2019–	Brighton & Hove Albion	113	(25)",
        ],
        answer: 'Leandro Trossard',
        acceptableAnswers: ['leandro trossard', 'leandro trosard', 'liandro trossard', 'leandero trosserd', 'trossard', 'trosard']
    }
};

export default function Play() {
    const router = useRouter()
    const { day } = router.query

    if (!day) {
        return <></>
    }

    const careerData = data[day[0]]

    if(!careerData) {
        return (
            <div>
                No data for {day}
            </div>
        );
    }

    const { career, answer, acceptableAnswers } = careerData;

    const TIME = 2000;
    
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
                return clearInterval(interval);
            }
            if(!guessMode) {
                setCount(count + 1);
            }
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
                    filter: guessMode ? 'blur(5px)' : 'none'
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
                        fontSize: '18px',
                        cursor: 'pointer'
                    }} onClick={() => { 
                        setGuessMode(true);
                        
                    }}>GUESS</button>
                </div>
                <GuessingPanel 
                        handleFinish={() => setGuessMode(false)} 
                        active={guessMode} 
                        answer={answer} 
                        acceptableAnswers={acceptableAnswers}
                        day={day[0]} />
            </div>
        </div>
    )
}

const GuessingPanel = ({ active, answer, acceptableAnswers, handleFinish, day }) => {
    const GUESS_TIME = 200;

    const panelStyle = {
        display: active ? 'block' : 'none',
        position: 'absolute',
        height: '100vh',
        width: '100vw',
        top: 0,
        left: 0,
        background: 'rgba(0,0,0,0.7)',
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

    const [timer, setTimer] = useState(GUESS_TIME)

    useEffect(() => {
        let intervalId
        if (active) {
            inputEl.current.focus();
            intervalId = setInterval(() => {
                setTimer(timer - 1);
            }, 
            100);
            if (timer <= 0) handleFinish()
        } else {
            inputEl.current.blur();
            setGuess('');
            clearInterval(intervalId)
            setTimer(GUESS_TIME)
        }

        return () => clearInterval(intervalId);
    })

    const [ guess, setGuess ] = useState('');
    const [ showWrong, setShowWrong ] = useState(false);
    const [ isCorrect, setIsCorrect ] = useState(false);

    const handleChange = (event) => {
        setGuess(event.target.value);
    }

    const closeDialog = () => {
        setShowWrong(false);
        setGuess('');
        handleFinish();
    };
    
    const handleSubmit = (event) => {
        event.preventDefault();
        const trimmedGuess = guess.trim().toLowerCase();

        acceptableAnswers.forEach(answer => console.log(answer, 'vs', trimmedGuess, Math.floor(stringSimilarity(answer, trimmedGuess) * 100), '% similarity'));

        if (acceptableAnswers.some(answer => stringSimilarity(answer, trimmedGuess) > 0.8)) {
            setIsCorrect(true);
        } else {
            setShowWrong(true);
            setTimeout(closeDialog, 1500);
        }
    }

    return (<div style={panelStyle}>    
        <div style={{
            display: isCorrect ? 'block' : 'none'
        }}>
            <p>
                {answer} is correct!
            </p>
            <p>
                TODO: Add stats and ability to share here.
            </p>
            <p>
                <a style={{color: 'blue'}} href={`/play/${Number(day)+ 1}`}>Try the next one</a>
            </p>
        </div>
        <div style={{
            display: isCorrect ? 'none' : 'block'
        }}>
            GUESSING TIME!
            <form onSubmit={handleSubmit}> 
                <div style={{
                    opacity: showWrong ? 0 : 1
                }}>
                    <input 
                        ref={inputEl}
                        autoFocus={true}
                        autoComplete="off" 
                        autoCorrect="off" 
                        spellCheck="false" 
                        style={inputStyle} type="text" 
                        onSubmit={() => { alert('Guessed!')}}
                        value={ guess }
                        onChange={handleChange}
                    />
                    <Timer progress={timer} totalTime={GUESS_TIME} />
                    <input 
                        style={{marginTop: '20px'}} 
                        type="submit" value="Submit" />
                </div>
                <div style={{
                    marginTop: '20px',
                    color: 'red',
                    transition: 'opacity 100ms',
                    opacity: showWrong ? 1 :0
                }}>
                    {guess} is wrong!
                </div>
            </form>
            <button style={{cursor: 'pointer', marginTop: '40px', padding: '40px', background:'transparent', border: 'none'}}onClick={closeDialog}>GO BACK</button>
        </div>
    </div>);
};


const Timer = ({ progress, totalTime }) => {
    const percentage = progress/totalTime;
    const fillColour = percentage > 0.4 ? 'rgba(255,255,255, 0.8)' : 'rgba(245, 10, 10, 0.8)';
    return (
        <svg width="100%" height="10">
            <rect width="100%" height="10" rx="5" style={{
                    fill: fillColour, 
                    strokeWidth: 3, 
                    stroke: 'rgb(0,0,0)',
                    transform: `scaleX(${percentage})`,
                    transition: `transform 300ms, fill 2000ms`
            }} />
        </svg>
    );
}