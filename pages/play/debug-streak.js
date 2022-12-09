import { useEffect, useState } from 'react';

import { dumpLocalStorage } from '../../utils/streaks';

export default function DebugStreak() {
  const [winStreak, setWinStreak] = useState('...');

  useEffect(() => {
    setWinStreak(dumpLocalStorage());
  }, []);

  return (
    <div>
        <span>{winStreak}</span>
    </div>
  )
}
