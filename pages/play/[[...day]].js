import Head from 'next/head';
import Link from 'next/link'
import { useRouter } from 'next/router';
import { stringSimilarity } from "string-similarity-js";
import { useState, useEffect, useRef } from 'react';

import { recordStreak } from '../../utils/streaks';

import styles from '../../styles/Home.module.css';

const data = {
    20: {
        career: [
            "1986–1994/	Norwich City/	173	(22)",
            "1994–1995/	Newcastle United/	58	(12)",
            "1995–2000/	Tottenham Hotspur/	106	(13)",
            "2000–2002/	West Bromwich Albion/	56	(2)",
        ],
        answer: 'Ruel Fox',
        acceptableAnswers: ['ruel fox', 'rule fox', 'fox', 'reul fox', 'rul fox', 'rool fox', 'raul fox']
    },
    21: {
        career: [
            "1986–96/	Feyenoord/	238	(45)",
            "1988–89/	→ Den Bosch (loan)/	25	(6)",
            "1996–97/	Sheffield Wednesday/	42	(3)",
            "1997–00/	Celtic/	47	(9)",
            "2000–01/	RBC/	22	(5)",
            "2001–03/	Sparta Rotterdam/	30	(1)",
        ],
        answer: 'Regi Blinker',
        acceptableAnswers: ['regi blinker', 'reggie blinker', 'blinker', 'redgie blinked', 'reggy blinker']
    },
    22: {
        career: [
            "1994–97/	Grimsby Town/	24	(3)",
            "1997–99/	Everton/	40	(1)",
            "1999–05/	Sunderland/	68	(5)",
            "2001/	→ Barnsley (loan)/	2	(0)",
            "2002/	→ Grimsby Town (loan)/	10	(5)",
            "2003/	→ Grimsby Town (loan)/	7	(1)",
            "2004–05/	→ Leeds United (loan)/	8	(1)",
            "2005/	Burnley/	15	(1)",
            "2005–08/	Reading/	76	(2)",
            "2008–09/	Crystal Palace/	31	(3)",
            "2009–12/	Doncaster Rovers/	111	(2)",
            "2012–13/	Barnet/	28	(2)",
            "2013–15/	Gateshead/	67	(3)",
        ],
        answer: 'John Oster',
        acceptableAnswers: ['john oster', 'oster', 'jon oster', 'osster', 'john osster', 'jon osster']
    },
    23: {
        career: [
            "1996–00/	Liverpool/	59	(5)",
            "1997–98/	→ Swindon Town (loan)/	10	(0)",
            "2000–02/	Coventry City/	69	(17)",
            "2002–06/	Blackburn Rovers/	65	(7)",
            "2006/	Wigan Athletic/	10	(2)",
            "2006–07/	Portsmouth/	14	(0)",
            "2007/	Bolton Wanderers/	8	(0)",
        ],
        answer: 'David Thompson',
        acceptableAnswers: ['david thompson', 'thompson', 'david thomson', 'thomson']
    },
    24: {
        career: [
            "1993–95/	Welling United/	41	(1)",
            "1995–96/	Birmingham City/	15	(1)",
            "1996/	→ Notts County (loan)/	17	(2)",
            "1996–98/	Notts County/	80	(5)",
            "1998–03/	Fulham/	172	(7)",
            "2003–08/	Liverpool/	145	(1)",
            "2008–09/	Espanyol/	4	(0)",
            "2009–10/	Portsmouth/	21	(0)",
        ],
        answer: 'Steve Finnan',
        acceptableAnswers: ['steve finnan', 'steven finnan', 'stephen finnan', 'steven finan', 'stephen finan', 'steve finan', 'finnan', 'finan']
    },
    25: {
        career: [
            "1984–87/	Aston Villa/	111	(2)",
            "1987–91/	Chelsea/	146	(11)",
            "1991–97/	Leeds United/	171	(5)",
            "1997–98/	Torino/	30	(2)",
            "1998–00/	Derby County/	41	(1)",
            "2000–01/	Stoke City/	36	(0)",
        ],
        answer: 'Tony Dorigo',
        acceptableAnswers: ['tony dorigo', 'tony dorrigo', 'dorigo', 'dorrigo']
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