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


export { recordStreak }