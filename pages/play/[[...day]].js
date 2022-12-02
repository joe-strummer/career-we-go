import Head from 'next/head';
import Link from 'next/link'
import { useRouter } from 'next/router';
import { stringSimilarity } from "string-similarity-js";
import { useState, useEffect, useRef } from 'react';

import { recordStreak } from '../../utils/streaks';

import styles from '../../styles/Home.module.css';

const data = {
    1: {
        career: [ 
            "1995–1998/	Carlisle United	/42	(10)",
            "1998–1999/	Crystal Palace/	26	(10)",
            "1999–2006/	Blackburn Rovers/	153	(44)",
            "2003/	→ Coventry City (loan)/	9	(2)",
            "2006/	Bolton Wanderers/	6	(0)",
            "2009/	Wrexham/	3	(1)",
            "2009–2010/	Leigh Genesis/	30	(10)",
            "2010–2014/	Chorley	/36	(4)",
        ],
        answer: "Matt Jansen",
        acceptableAnswers: ['matt jansen', 'matt janson', 'janson', 'jansen']
    },
    2: {
        career: [
            "94–96/	Portuguesa/	61	(1)",
            "97/	Real Madrid/	15 (0)",
            "98/	Flamengo/	24	(0)",
            "98–02/	Bayer Leverkusen/	113	(17)",
            "02–06/	Bayern Munich/	110	(5)",
            "06–09/	Club Nacional de Football/	0	(0)",
            "06–07/	→ Santos (loan)/	13	(2)",
            "07–09/	→ Bayern Munich (loan)/	59	(9)",
            "09–11/	Hamburger SV/	54	(7)",
            "11–12/	Al-Gharafa/	14	(1)",
            "12–14/	Grêmio/	82	(6)",
            "15–17/	Palmeiras/	68	(3)",
        ],
        answer: "Zé Roberto",
        acceptableAnswers: ['ze roberto', 'zé roberto', 'roberto']
    },

    3: {
        career: [
            "2002–04/	Wimbledon/	58	(6)",
            "2004–07/	West Ham United/	120	(11)",
            "2007–11/	Aston Villa/102	(1)",
            "2011–12/	Bolton Wanderers/	37	(3)",
            "2012–13/	Ipswich Town/	10	(0)",
            "2013–14/	Vancouver Whitecaps FC/	44	(1)",
            "2014/	Chivas USA/	9	(0)",
            "2015–16/	Montreal Impact/	31	(0)",
            "2017/	Start/	2	(0)",
            "2018/	Milton Keynes Dons/	0	(0)",
        ],
        answer: "Nigel Reo-Coker",
        acceptableAnswers: ['nigel reo coker', 'nigel reo-coker', 'reo coker', 'reo-coker']
    },
    4: {
        career: [
            "1993–95/	Alavés	/45	(2)",
            "1995–97/	Valencia	/25	(1)",
            "1995–96/	→ Valladolid (loan)	/24	(2)",
            "1997–98/	Mallorca	/33	(1)",
            "1998–03/	Real Madrid	/60	(1)",
            "2002–03/	→ Bolton Wanderers (loan)	/31	(2)",
            "2003–08/	Bolton Wanderers	/141	(11)",
            "2008–09/	Ipswich Town	/17	(1)",
            "2009–10/	AEK Larnaca/	8	(0)",

        ],
        answer: 'Iván Campo',
        acceptableAnswers: ['iván campo', 'ivan campo', 'campo']
    },
    5: {
        career: [
            "1995–98/	Queens Park Rangers	/58	(3)",
            "1998–00/	Nottingham Forest	/43	(2)",
            "2000–05/	Portsmouth	/148	(13)",
            "2005–06/	Southampton	/37	(5)",
            "2006–07/	West Bromwich Albion	/29	(1)",
            "2007–10/	West Ham United	/7	(0)",
            "2008–09/	→ Birmingham City (loan)	/10	(0)",
            "2009	/→ Wolverhampton Wanderers (loan)/	3	(0)",
            "2009–10	/→ Milton Keynes Dons (loan)/	7	(2)",
            "2010	/Queens Park Rangers/	4	(0)",
            "2012	/ÍR	/20	(2)",
            "2013–15/	BÍ|Bolungarvík	/37	(9)",
        ],
        answer: 'Nigel Quashie',
        acceptableAnswers: ['nigel quashie', 'quashie', 'nigel quasie', 'quasie']
    },
    6: {
        career: [
            "98–99/	Walton & Hersham/	20	(9)",
            "99–02/	Bristol Rovers	/116	(35)",
            "02–05/	Wigan Athletic	/134	(59)",
            "05–07/	West Bromwich Albion/	68	(15)",
            "07–11/	Watford	/51	(5)",
            "08–09/	→ Derby County (loan)/	27	(3)",
            "10/	→ Skoda Xanthi (loan)/	19	(6)",
            "11	/→ Preston North End (loan)/	18	(2)",
            "11–13/	Ipswich Town/	17	(0)",
            "12–13/	→ Scunthorpe United (loan)/	6	(0)",
            "13/	Crewe Alexandra/	8	(0)",
            "13/	Southport/	3	(0)",
            "17–18/	Egerton	/3	(1)",
        ],
        answer: 'Nathan Ellington',
        acceptableAnswers: ['nathan ellington', 'nathan elington', 'ellington', 'elington']
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

    useEffect(() => {
      const darkLocal = localStorage.getItem('darkMode');
      if (darkLocal==='true') {
        document.body.classList.add('dark');
    } 
    }, []);

    const [count, setCount] = useState(-3);
    const [correct, setCorrect] = useState(false)
    const [guessMode, setGuessMode] = useState(false);
    const [giveUp, setGiveUp] = useState(false);

    useEffect(() => {
        const intervalId = setInterval(() => { 
            // if (count >= career.length * TIME - 1) {
            //     return clearInterval(intervalId);
            // }
            if (correct || giveUp) return clearInterval(intervalId)
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
                    <div style={{    
                            filter: 'none',
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginLeft: 8}}>
                        <p className={styles.headerSmall}>
                            <Link href='/'>CAREER&nbsp;WE&nbsp;GO</Link>
                        </p>

                        <p className={correct || giveUp ? styles.timer : styles.timerAnimation}>{
                            !guessMode && (count < 0 ? 'Get Ready...' : `${count}s⏳`)
                        }</p>
                    </div>
                    {/* Whose career is this? GET READY... */}
                    {
                        (correct || !!giveUp) && (
                            <p style ={{margin:4}}>
                                {answer}
                            </p>
                        )
                    }

                    <div className={styles.career}>
                        {count < 0 ? (<p className={styles.whose}>Whose career is this?</p>) : '' }
                        <table cellSpacing="0" cellPadding="2">
                            <tbody>
                                <tr style={{fontWeight: 'bold'}}>
                                    <th className={styles.cell}>Years </th>
                                    <th className={styles.cellTeam}>Team</th>
                                    <th className={styles.cell}>Apps (goals)</th>
                                </tr>
                            {
                                career.map((team, i) => {
                                    const n = count / TIME;
                                    const style = n < i && !correct && !giveUp ? hiddenStyle : shownStyle;
                                    return (<tr key={i} style={style}>
                                        {team.split('/').map((cell, j) => (<td className={j===1 ? styles.cellTeam : styles.cell} key={i+'and'+j}>{cell}</td>))}
                                    </tr>);
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                    { !giveUp && !correct && (<div style={{display: 'flex', justifyContent: 'space-evenly', marginTop: 22}}>
                        <button disabled={count < 0 ? true : false} style={{opacity: count < 0 ? 0.3 : 0.9}} className={styles.guessButton} onClick={() => { 
                            setGuessMode(true);
                        }}>ANSWER</button>
                        <a style={{padding: 20, cursor: 'pointer', opacity: count < 0 ? 0.3 : 1}} onClick={ () => { 
                            if (count < 0) {
                                return
                            }
                            if (giveUp === false) {
                                setGiveUp(0)
                            }
                            if (giveUp === 0){
                                setGiveUp(true) 
                            }
                        } }>{giveUp === false ? 'Give up' : 'Sure?'}</a>
                    </div>)}
                    {
                        correct && (<a style={{cursor: 'pointer', padding: 32 }} onClick={() => {setGuessMode(true)}}>Share results</a>)
                    }
                    {
                        !!giveUp && <p>Better luck tomorrow...</p>
                    }
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
    const [ isCopied, setIsCopied ] = useState(false);
    const [ incorrectGuesses, setIncorrectGuesses ] = useState(0);

    const handleChange = (event) => {
        setGuess(event.target.value);
    }

    const closeDialog = () => {
        setShowWrong(false);
        setGuess('');
        handleFinish();
    };
    
    const handleSubmit = (event) => {
        inputEl.current.blur();
        event.preventDefault();
        const trimmedGuess = guess.trim().toLowerCase();

        acceptableAnswers.forEach(answer => console.log(trimmedGuess, Math.floor(stringSimilarity(answer, trimmedGuess) * 100), '% similarity to answer'));

        if (acceptableAnswers.some(answer => stringSimilarity(answer, trimmedGuess) > 0.8)) {
            setIsCorrect(true);
            // record local storage
            recordStreak(incorrectGuesses, count);
        } else {
            setShowWrong(true);
            setIncorrectGuesses(incorrectGuesses+1);
            setTimeout(closeDialog, 850);
        }
    }

    const xEmoji = '%E2%9D%8C';
    const timeEmoji = '%E2%8F%B3';
    const newLine = '%0A'
    const tickEmoji = '%E2%9C%85';

    const timeEmojiUTF = '⏳';
    const xEmojiUTF = '❌';
    const tickEmojiUTF = '✅';

    const tweetText = `${xEmoji.repeat(incorrectGuesses)}${tickEmoji}${newLine}${timeEmoji}${count}s${newLine}${newLine}careerwego.com${newLine}@CareerWeGoPod`; 

    return (<div style={panelStyle}>    
        <div style={{
            display: isCorrect ? 'block' : 'none'
        }} className={styles.panel}>
            <p>
                ✅ That's correct!
            </p>
            <p style={{ fontWeight: 400}}>
                It took you ⏳ {count === 1 ? '1 second' : `${count} seconds`} and {incorrectGuesses + 1} attempt{incorrectGuesses === 0 ? '' : 's'}.
            </p>
            <p style={{ fontSize: 18, fontWeight: 200}}>
                Come back tomorrow for another.
            </p>

            <p style={{
                marginTop: 48
            }}><a className='share' style={{padding: 12}} onClick={()=>{
                const results = `${xEmojiUTF.repeat(incorrectGuesses)}${tickEmojiUTF}
${timeEmojiUTF}${count}s

https://www.careerwego.com`
                navigator.clipboard.writeText(results);
                setIsCopied(true);
            }}>{ isCopied ? 'Copied!' : '📋 Copy your results to clipboard' }</a></p>
            <p style={{marginTop: 48}}>
            <a style={{color: 'rgb(27,155,240'}} className="twitter-share-button"
            href={`https://twitter.com/intent/tweet?text=${tweetText}`} data-text={tweetText} data-url="https://www.careerwego.com">
            🐦 Tweet your results</a>
            </p>
            <p style={{
                marginTop: 48,
                fontWeight: 200,
                fontStyle: 'italic',
            }}><a style={{padding: 12, color: 'rgba(255,255,255,0.5)'}} onClick={() => { handleFinish('correct')}}>← See his career</a></p>
        </div>
        <div className={styles.panel} style={{
            display: isCorrect ? 'none' : 'block'
        }}>
            <form onSubmit={handleSubmit}> 
                <div style={{
                    opacity: showWrong ? 0 : 1,
                    display: showWrong ? 'none' : 'block'
                }}>
                    <input 
                        ref={inputEl}
                        autoComplete="off" 
                        autoCorrect="off" 
                        spellCheck="false" 
                        style={inputStyle} type="text" 
                        onSubmit={() => { alert('Guessed!')}}
                        value={ guess }
                        placeholder={'Who is it?'}
                        onChange={handleChange}
                    />
                    <Timer progress={timer} totalTime={GUESS_TIME} />
                    
                </div>
                <div style={{
                    marginTop: '80px',
                    color: 'red',
                    transition: 'opacity 100ms',
                    opacity: showWrong ? 1 :0,
                    fontSize: 18,
                    fontWeight: 500
                }}>
                    ❌ {guess} is wrong!
                </div>
            </form>
            { showWrong ? '' : (<button style={{cursor: 'pointer', fontSize:18, color: 'rgba(255,255,255,0.5)', marginTop: '40px', padding: '40px', background:'transparent', border: 'none'}}onClick={closeDialog}>← GO BACK</button>)}
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