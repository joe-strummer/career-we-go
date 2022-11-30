import Head from 'next/head';
import Link from 'next/link'
import { useRouter } from 'next/router';
import { stringSimilarity } from "string-similarity-js";
import styles from '../../styles/Home.module.css';
import { useState, useEffect, useRef } from 'react';

const data = {
    1: {
        career: [ 
            "1995–1998	Carlisle United	42	(10)",
            "1998–1999	Crystal Palace	26	(10)",
            "1999–2006	Blackburn Rovers	153	(44)",
            "2003	→ Coventry City (loan)	9	(2)",
            "2006	Bolton Wanderers	6	(0)",
            "2009	Wrexham	3	(1)",
            "2009–2010	Leigh Genesis	30	(10)",
            "2010–2014	Chorley	36	(4)",
        ],
        answer: "Matt Jansen",
        acceptableAnswers: ['matt jansen', 'matt janson', 'janson', 'jansen']
    },
    2: {
        career: [
            "1994–1996	Portuguesa	61	(1)",
            "1997	Real Madrid	15	(0)",
            "1998	Flamengo	24	(0)",
            "1998–2002	Bayer Leverkusen	113	(17)",
            "2002–2006	Bayern Munich	110	(5)",
            "2006–2009	Club Nacional de Football	0	(0)",
            "2006–2007	→ Santos (loan)	13	(2)",
            "2007–2009	→ Bayern Munich (loan)	59	(9)",
            "2009–2011	Hamburger SV	54	(7)",
            "2011–2012	Al-Gharafa	14	(1)",
            "2012–2014	Grêmio	82	(6)",
            "2015–2017	Palmeiras	68	(3)",
        ],
        answer: "Zé Roberto",
        acceptableAnswers: ['ze roberto', 'zé roberto', 'roberto']
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
    },

    30: {
        career: [ 
            "1995–1998	Carlisle United	42	(10)",
            "1998–1999	Crystal Palace	26	(10)",
            "1999–2006	Blackburn Rovers	153	(44)",
            "2003	→ Coventry City (loan)	9	(2)",
            "2006	Bolton Wanderers	6	(0)",
            "2009	Wrexham	3	(1)",
            "2009–2010	Leigh Genesis	30	(10)",
            "2010–2014	Chorley	36	(4)",
        ],
        answer: "Matt Jansen",
        acceptableAnswers: ['matt jansen', 'matt janson', 'janson', 'jansen']
    },
};

export default function Play() {
    const router = useRouter()
    const dayOverride = router.query.day

    const today = new Date();
    const day = dayOverride || [today.getDate()];

    if (!day) {
        return <>No data!</>
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

    const TIME = 3.5;
    
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

    const [count, setCount] = useState(-3);
    const [correct, setCorrect] = useState(false)

    const [guessMode, setGuessMode] = useState(false);

    useEffect(() => {
        const intervalId = setInterval(() => { 
            // if (count >= career.length * TIME - 1) {
            //     return clearInterval(intervalId);
            // }
            if (correct) return clearInterval(intervalId)
            if(!guessMode) {
                setCount(count + 1);
            }
        }, 1000);
        return () => clearInterval(intervalId);
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
                    <p className={styles.headerSmall}>
                        CAREER WE GO
                    </p>

                    <p className={correct ? styles.timer : styles.timerAnimation}>{
                        !guessMode && (count < 0 ? 'GET READY...' : count)
                    }</p>

                    <div className={styles.career}>
                        {
                            career.map((team, i) => {
                                const n = count / TIME;
                                const style = n < i && !correct ? hiddenStyle : shownStyle;
                                return (<p key={i} style={style}>
                                    {team}
                                </p>);
                            })
                        }
                    </div>
                    { !correct && (<button className={styles.guessButton} onClick={() => { 
                        setGuessMode(true);
                    }}>ANSWER</button>)}
                </div>
                <GuessingPanel 
                        handleFinish={(message) => { 
                            setGuessMode(false)
                            if (message === "correct") {
                                setCorrect(true);
                            }
                        }} 
                        active={guessMode} 
                        answer={answer} 
                        acceptableAnswers={acceptableAnswers}
                        count={count}
                         />
            </div>
        </div>
    )
}

const GuessingPanel = ({ active, answer, acceptableAnswers, handleFinish, count }) => {
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
            if (timer <= 0 && !isCorrect) handleFinish()
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
                That's correct!
            </p>
            <p>
                It took you {count} seconds.
            </p>
            <p>
                Come back tomorrow for another.
            </p>
            <p style={{
                color: 'black',
                marginTop: 48
            }}><a onClick={() => { handleFinish('correct')}}>See his career</a></p>
        </div>
        <div style={{
            display: isCorrect ? 'none' : 'block'
        }}>
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