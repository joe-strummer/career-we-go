import Head from 'next/head';
import Link from 'next/link'
import { useRouter } from 'next/router';
import { stringSimilarity } from "string-similarity-js";
import { useState, useEffect, useRef } from 'react';

import { recordStreak } from '../../utils/streaks';

import styles from '../../styles/Home.module.css';

const data = {
    11: {
        career: [
            "2006–11/	Arsenal/	13	(0)",
            "2008–09/	→ Portsmouth (loan)/	19	(1)",
            "2010–11/	→ Juventus (loan)/	10	(0)",
            "2011–16/	Queens Park Rangers/	87	(2)",
            "2016–18/	Nottingham Forest/	30	(0)",
            "2018/	→ Cardiff City (loan)/	4	(1)",
            "2018–19/	Çaykur Rizespor/	0	(0)",
            "2019–20/	Cardiff City/	0	(0)",
        ],
        answer: 'Armand Traoré',
        acceptableAnswers: ['armand traoré', 'armand traore', 'traore', 'traoré']
    },
    12: {
        career: [
            "2003–04/	Wimbledon/	8	(0)",
            "2004–06/	MK Dons/	26	(1)",
            "2006/	Fisher Athletic/	1	(0)",
            "2006/	Lewes/	1	(0)",
            "2006–08/	Barnet/	78	(15)",
            "2008–10/	Plymouth Argyle/	6	(0)",
            "2008/	→ MK Dons (loan)/	9	(1)",
            "2009/	→ MK Dons (loan)/	18	(3)",
            "2009–10/	→ MK Dons (loan)/	24	(7)",
            "2010–14/	Southampton/	74	(9)",
            "2010–11/	→ Millwall (loan)/	7	(5)",
            "2011/	→ Blackpool (loan)/	11	(3)",
            "2011/	→ Queens Park Rangers (loan)/	2	(0)",
            "2013–14/	→ Crystal Palace (loan)/	20	(3)",
            "2014–19/	Crystal Palace/	133	(12)",
            "2019/	→ Huddersfield Town (loan)/	6	(0)",
            "2019–22/	Pafos/	65	(5)",
            "2022–/	Anorthosis Famagusta/	0	(0)",
        ],
        answer: 'Jason Puncheon',
        acceptableAnswers: ['jason puncheon', 'puncheon', 'punchen', 'punchon', 'jason punchen', 'jason punchon']
    },
    13: {
        career: [
            "2002/	Joe Public/	11	(9)",
            "2002–04/	W Connection/	31	(30)",
            "2004–07/	Southampton/	71	(19)",
            "2004–05/	→ Sheffield Wednesday (loan)/	7	(7)",
            "2005/	→ Stoke City (loan)/	13	(3)",
            "2007–10/	Sunderland/	94	(26)",
            "2010–14/	Stoke City/	88	(13)",
            "2014–16/	Cardiff City/	64	(17)",
            "2015/	→ AFC Bournemouth (loan)/	6	(1)",
            "2016/	→ Al Jazira (loan)/	11	(3)",
            "2016–17/	Atlanta United/	17	(2)",
            "2016/	→ Central (loan)/	5	(4)",
        ],
        answer: 'Kenwyne Jones',
        acceptableAnswers: ['kenwyne jones', 'jones', 'kenwyn jones', 'kenwin jones']
    },
    14: {
        career: [
            "2000–03/	Coventry City/	72	(14)",
            "2003–05/	Perugia/	26	(4)",
            "2004–05/	→ Blackburn Rovers (loan)/	11	(1)",
            "2005–06/	Charlton Athletic/	18	(2)",
            "2006–08/	Wolverhampton Wanderers/	55	(12)",
            "2008/	→ Stoke City (loan)/	4	(0)",
            "2008–11/	Cardiff City/	116	(41)",
            "2011–13/	Queens Park Rangers/	25	(3)",
            "2012–13/	→ Sheffield Wednesday (loan)/	14	(1)",
            "2014/	Muangthong United/	16	(6)",
            "2015–16/	Júbilo Iwata/	54	(34)",
            "2017–21/	Hokkaido Consadole Sapporo/	107	(35)",
        ],
        answer: 'Jay Bothroyd',
        acceptableAnswers: ['jay bothroyd', 'bothroyd', 'jay boothroyd', 'boothroyd']
    },
    15: {
        career: [
            "1997–98/	Enugu Rangers/	6	(2)",
            "1998–99/	El Mokawloon/	25	(5)",
            "1999–01/	Ismaily/	42	(30)",
            "2001–02/	Al-Sadd/	27	(14)",
            "2002–05/	Lens/	102	(24)",
            "2005–07/	Rennes/	63	(22)",
            "2007–11/	Portsmouth/	90	(10)",
            "2011–13/	Montpellier/	68	(12)",
            "2013–15/	Sivasspor/	47	(12)",
            "2016/	Ismaily/	0	(0)",
            "2016/	Nogoom El Mostakbal/	0	(0)",
            "2017/	Aswan/	12	(2)",
            "2017–18/	Sedan/	14	(0)",
        ],
        answer: 'John Utaka',
        acceptableAnswers: ['john utaka', 'utaka']
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
      if (darkLocal!=='false') {
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
                    filter: guessMode ? 'blur(5px)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '89vh'
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
                        {count < 0 ? (<p className={styles.whose}>Whose career is this?<br /> {Math.abs(count)}</p>) : '' }
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
                    { !giveUp && !correct && (<div className={styles.answerButtonPanel}>
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

    const xEmoji = '❌';//'%E2%9D%8C';
    const timeEmoji = '⏳';//'%E2%8F%B3';
    const newLine = '%0A'
    const tickEmoji = '✅';//'%E2%9C%85';

    const timeEmojiUTF = '⏳';
    const xEmojiUTF = '❌';
    const tickEmojiUTF = '✅';

    const tweetText = `${xEmoji.repeat(incorrectGuesses)}${tickEmoji}${newLine}${timeEmoji}${count}s${newLine}${newLine}Can%20you%20name%20the%20player%20and%20beat%20my%20time?${newLine}⚽️@CareerWeGoPod`;

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

Can you name the player and beat my time?
⚽️https://careerwego.com`
                navigator.clipboard.writeText(results);
                setIsCopied(true);
            }}>{ isCopied ? 'Copied!' : '📋 Copy your results to clipboard' }</a></p>
            <p style={{marginTop: 48}}>
            <a style={{color: 'rgb(27,155,240'}} className="twitter-share-button"
            href={`https://twitter.com/intent/tweet?text=${tweetText}&url=https://careerwego.com`} data-text={tweetText} data-url="https://careerwego.com">
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