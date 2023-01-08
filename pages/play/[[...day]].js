import Head from 'next/head';
import Link from 'next/link'
import { useRouter } from 'next/router';
import { stringSimilarity } from "string-similarity-js";
import { useState, useEffect, useRef } from 'react';

import { recordStreak } from '../../utils/streaks';

import styles from '../../styles/Home.module.css';

const data = {
    5: {
        career: [
            "1996–98/	Stoke City	/57	/(2)",
            "1998–04/	Newcastle United	/76	/(2)",
            "2004–07/	Portsmouth	/43	/(0)",
            "2006–07/	→ Stoke City (loan)	/33/	(2)",
            "2007–08/	Derby County	/15	/(0)",
            "2008–10/	Stoke City	/35/	(0)",
            "2010/	→ Reading (loan)	/21	/(0)",
            "2010–12/	Reading	/42	/(0)",
            "2012–13/	Doncaster Rovers	/16	/(0)",
            "2014/	Chester	/4	/(0)",
        ],
        answer: 'Andy Griffin',
        acceptableAnswers: ['andy griffin', 'andrew griffin', 'griffin', 'andy griffen', 'griffen', 'griffon', 'gryfyn']
    },
    6: {
        career: [
            "1998–99/	Napoli/	2	/(0)",
            "1999–06/	Parma/	92	/(4)",
            "2001–02/	→ Verona (loan)/	24	/(1)",
            "2006–14/	Napoli/	236	/(8)",
            "2014/	→ Sassuolo (loan)/	16	/(0)",
            "2014–17/	Sassuolo/	94	/(1)",
            "Total/	/	464	/(14)",
        ],
        answer: 'Paolo Cannavaro',
        acceptableAnswers: ['paolo cannavaro', 'cannavaro', 'paolo canavaro', 'cannavarro', 'canavaro']
    },
    7: {
        career: [
            "2004–08/	Newcastle United/	51	/(0)",
            "2008–12/	Queens Park Rangers/	68	/(2)",
            "2011–12/	→ Crystal Palace (loan)/	17	/(0)",
            "2012/	→ Birmingham City (loan)/	14	/(0)",
            "2012–15/	Crystal Palace/	40	/(4)",
            "2013/	→ Barnsley (loan)/	24	/(0)",
            "2014–15/	→ Barnsley (loan)/	19	/(3)",
            "2015/	Kerala Blasters/	14	/(0)",
            "2016/	Coventry City/	4	/(0)",
            "2016/	→ Leyton Orient (loan)/	8	/(0)",
            "2016–17/	Phoenix Rising/	36	/(2)",
            "Total/	/	295	/(11)",
        ],
        answer: 'Peter Ramage',
        acceptableAnswers: ['peter ramage', 'peter rammage', 'rammage', 'ramage']
    },
    8: {
        career: `1995–1997	Progreso	22	(12)
        1997–1998	Basáñez	0	(0)
        1998–2000	Peñarol	71	(29)
        2000–2005	Deportivo La Coruña	86	(31)
        2002–2003	→ Mallorca (loan)	33	(13)
        2005	→ Birmingham City (loan)	14	(4)
        2005–2006	Birmingham City	17	(2)
        2006–2007	Espanyol	52	(8)
        2007–2011	Osasuna	92	(27)
        2011–2012	Espanyol	16	(3)
        2012–2013	Villarreal	17	(2)
        2013	Atlético Baleares	9	(1)
        2013–2014	Miramar Misiones	19	(5)
        2015–2016	Lausanne-Sport	15	(1)
        Total		463	(138)
        `.split('\n').map(i => i.replace('\t', '/').replace('\t', '/').replace('\t', '/')),
        answer: 'Walter Pandiani',
        acceptableAnswers: ['walter pandiani', 'pandini', 'pandiani']
    },
    9: {
        career: `1995–1996	Næstved BK	4	(0)
        1996–1998	Lyngby FC	62	(14)
        1998–2000	Bolton Wanderers	86	(8)
        2000–2004	Charlton Athletic	123	(16)
        2004–2007	Fulham	35	(4)
        Total		310	(42)`.split('\n').map(i => i.replace('\t', '/').replace('\t', '/').replace('\t', '/')),
        answer: 'Claus Jensen',
        acceptableAnswers: ['claus jensen', 'jensen', 'clause jensen', 'klaus jensen', 'claus jenson', 'jenson', 'klaus jenson', 'jennson', 'jennsen']
    }
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
    const xEmoji = '❌';//'%E2%9D%8C';
    const newLine = '%0A'
    const tweetTextDefeated = `🙈⚽️❌${newLine}${newLine}I%20was%20defeated%20today.%20Can%20you%20name%20the%20player?${newLine}${newLine}🎙@CareerWeGoPod${newLine}⚽️`;

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

            <div className={styles.App} onClick={() => { if (count < 0) setCount(0);}}>
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
                                    <th className={styles.cell}>Apps</th>
                                    <th className={styles.cell}>(goals)</th>
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
                        (correct) && (<a style={{cursor: 'pointer', padding: 32 }} onClick={() => {setGuessMode(true)}}>Share results</a>)
                    }
                    {
                        !!giveUp && <>
                            <p>Better luck tomorrow...</p>
                            <a style={{color: 'rgb(27,155,240'}} className="twitter-share-button"
                            href={`https://twitter.com/intent/tweet?text=${tweetTextDefeated}&url=https://careerwego.com`} data-text={tweetTextDefeated} data-url="https://careerwego.com">
                            🐦 Share on Twitter to see if your friends do any better...</a>
                        </>
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
    const podEmoji = '🎙';

    const timeEmojiUTF = '⏳';
    const xEmojiUTF = '❌';
    const tickEmojiUTF = '✅';

    const tweetText = `${xEmoji.repeat(incorrectGuesses)}${tickEmoji}${newLine}${timeEmoji}${count}s${newLine}${newLine}Can%20you%20name%20the%20player%20and%20beat%20my%20time?${newLine}🎙@CareerWeGoPod${newLine}⚽️`;

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
⚽️https://careerwego.com
🎙@CareerWeGoPod`
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
            }}><a style={{padding: 12, color: 'rgba(255,255,255,0.5)'}} onClick={() => { handleFinish('correct')}}>← See their career</a></p>
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