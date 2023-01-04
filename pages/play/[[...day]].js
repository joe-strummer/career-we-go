import Head from 'next/head';
import Link from 'next/link'
import { useRouter } from 'next/router';
import { stringSimilarity } from "string-similarity-js";
import { useState, useEffect, useRef } from 'react';

import { recordStreak } from '../../utils/streaks';

import styles from '../../styles/Home.module.css';

const data = {
    1:{
        career: [
            "2005–07/	Arsenal/	1	(0)",
            "2006–07/	→ Derby County (loan)[A]/	35	(7)",
            "2007–09/	Fiorentina/	0	(0)",
            "2008/	→ Treviso (loan)/	17	(1)",
            "2008–09/	→ Norwich City (loan)/	17	(4)",
            "2009/	→ Sheffield United (loan)/	11	(2)",
            "2009–11/	Ascoli/	66	(11)",
            "2011–13/	Grosseto/	45	(8)",
            "2013–15/	Varese/	23	(6)",
            "2014/	→ Budapest Honvéd (loan)/	4	(0)",
            "2015/	Frosinone/	11	(1)",
            "2015–17/	Pisa/	10	(2)",
            "2016/	→ Catania (loan)/	10	(0)",
            "2017/	Südtirol/	12	(0)",
            "2017–19/	Fermana/	72	(11)",
            "2019–20/	Virtus Verona/	17	(2)",
            "2020–21/	Montegiorgio/	21	(8)",
            "2021–22/	Borgo San Donnino/	5	(0)",
        ],
        answer: 'Arturo Lupoli',
        acceptableAnswers: ['arturo lupoli', 'lupoli', 'artur lupoli', 'lupili', 'arturo lupili']
    },
    2:{
        career: [
            "1986–89/	Newport County/	28	(0)",
            "1989–90/	Hereford United/	59	(4)",
            "1990–94/	Queens Park Rangers/	126	(6)",
            "1994–98/	Newcastle United/	133	(2)",
            "1998–00/	Blackburn Rovers/	47	(1)",
            "2000/	→ West Ham United (loan/)	0	(0)",
            "2000/	→ Wolverhampton Wanderers (loan/)	4	(0)",
        ],
        answer: 'Darren Peacock',
        acceptableAnswers: ['darren peacock', 'peacock', 'darron peacock']
    },
    3: {
        career: [
            "1989–91/	Manchester City/	1	(0)",
            "1991/	→ Wrexham (loan)/	4	(2)",
            "1991–92/	Leicester City/	10	(0)",
            "1992/	→ Blackpool (loan)/	2	(1)",
            "1992–94/	Crewe Alexandra/	61	(25)",
            "1994–96/	Norwich City/	53	(18)",
            "1996–97/	Derby County/	40	(9)",
            "1997–98/	Barnsley/	46	(20)",
            "1998–00/	Blackburn Rovers/	54	(13)",
            "2000–03/	Bradford City/	84	(17)",
            "2003–05/	Sheffield United/	33	(5)",
        ],
        answer: 'Ashley Ward',
        acceptableAnswers: ['ashley ward', 'ward', 'ashly ward']
    },
    4: {
        career: [
            "1996–00/	Arsenal Ladies/	47	(8)",
            "2000/	→ Laval Dynamites (loan)/	25	(10)",
            "2000–04/	Fulham Ladies/	15	(6)",
            "2004–05/	Birmingham Ladies/	13	(7)",
            "2005/	New Jersey Wildcats/	29	(5)",
            "2005–16/	Arsenal Ladies/	151	(43)",
            "2016/	→ Notts County Ladies (loan)/	5	(0)",
        ],
        answer: 'Rachel Yankey',
        acceptableAnswers: ['rachel yankey', 'rachel yankee', 'rachel yanky', 'yanky', 'yankey', 'yankee']
    },
    5: {
        career: [
            "1996–98/	Stoke City	/57	(2)",
            "1998–04/	Newcastle United	/76	(2)",
            "2004–07/	Portsmouth	/43	(0)",
            "2006–07/	→ Stoke City (loan)	/33	(2)",
            "2007–08/	Derby County	/15	(0)",
            "2008–10/	Stoke City	/35	(0)",
            "2010/	→ Reading (loan)	/21	(0)",
            "2010–12/	Reading	/42	(0)",
            "2012–13/	Doncaster Rovers	/16	(0)",
            "2014/	Chester	/4	(0)",
        ],
        answer: 'Andy Griffin',
        acceptableAnswers: ['andy griffin', 'andrew griffin', 'griffin', 'andy griffen', 'griffen', 'griffon', 'gryfyn']

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