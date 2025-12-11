import {useEffect, useState, useRef} from "react";

const useTimer = () => {
    const [time, setTime] = useState(0);
    const intervalRef = useRef(null);

    const start = (sec) => {
        clear();
        setTime(sec);

        intervalRef.current = setInterval(() => {
            setTime((prev) => {
                if (prev <= 1) {
                    clear();
                    return 0;
                }
                return prev - 1;
            });

        }, 1000);
    };

    const clear = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const format = () => {
        const m = Math.floor(time / 60);
        const s = time % 60;
        return `${m}:${s < 10 ? "0" + s : s}`;
    };


    useEffect(() => clear, []);

    return {time, start, clear, format};
}

export default useTimer