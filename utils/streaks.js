const recordStreak = (incorrectGuesses, time) => {
    console.log('record streak', incorrectGuesses, time);
    const locallyStoredStreak = localStorage.getItem('cwg_streaks')

    let streak;

    try {
        streak = locallyStoredStreak ? JSON.parse(locallyStoredStreak) : {}
    } catch {
        streak = {}
        console.log('local storage malformed JSON');
    }

    const date = new Date();
    const [ month, day, year ] = [
        date.getMonth(),
        date.getDate(),
        date.getFullYear()
    ]

    const dateKey = `${year}-${month}-${day}`;

    if (streak[dateKey]) {
        return;
    } else {
        streak[dateKey] = {
            incorrectGuesses,
            time
        }
        localStorage.setItem('cwg_streaks', JSON.stringify(streak));
    }
}

const getWinStreak = () => {
    if (typeof window === 'undefined') {
        return;
    }
    const locallyStoredStreak = localStorage.getItem('cwg_streaks')

    let streak;

    try {
        streak = locallyStoredStreak ? JSON.parse(locallyStoredStreak) : {}
    } catch {
        streak = {}
        console.log('local storage malformed JSON');
        return 0;
    }

    let winStreak = 0;
    let dateToCheck = new Date();
    const [ month, day, year ] = [
        dateToCheck.getMonth(),
        dateToCheck.getDate(),
        dateToCheck.getFullYear()
    ]

    const todaysDateAsString = `${year}-${month}-${day}`;

    const successfulDates = Object.keys(streak);
    
    // check if today's date is in there:
    if (successfulDates.includes(todaysDateAsString)) {
        winStreak++;
    }



    while (true) {
        dateToCheck.setDate(dateToCheck.getDate() - 1);
        const [ month, day, year ] = [
            dateToCheck.getMonth(),
            dateToCheck.getDate(),
            dateToCheck.getFullYear()
        ]
        const dateToCheckAsString = `${year}-${month}-${day}`;

        if ( successfulDates.includes(dateToCheckAsString)) {
            winStreak++;
        } else {
            return winStreak;
        }
    }

}

const dumpLocalStorage = () => {
    if (typeof window === 'undefined') {
        return;
    }
    return localStorage.getItem('cwg_streaks')
}


export { recordStreak, getWinStreak, dumpLocalStorage }