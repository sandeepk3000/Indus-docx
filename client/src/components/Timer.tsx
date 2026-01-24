import React from "react";
interface TimerProps {
  time: number;
  isRunning: boolean;
  className?: string;
  stop: (flag: boolean) => void;
}
import Typo from "./Typo";
const Timer = ({ time, isRunning, className, stop }: TimerProps) => {
  const [currentTime, setCurrentTime] = React.useState<number>(time);

  const [hours, setHours] = React.useState<number>(2);
  const [minutes, setMinutes] = React.useState<number>(0);
  const [seconds, setSeconds] = React.useState<number>(0);

  React.useEffect(() => {
    let interval: number | undefined;
    if (isRunning) {
      interval = setInterval(() => {
        updateTime(interval);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);
  const updateTime = (interval: number | undefined): void => {
    if (isRunning) {
      setCurrentTime((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(interval);
          stop(true);
          return 0;
        }
        return prevTime - 1;
      });
    }
  };
  React.useEffect(() => {
    const hours = Math.floor(currentTime / 3600);
    const minutes = Math.floor((currentTime % 3600) / 60);
    const seconds = currentTime % 60;
    setHours(hours);
    setMinutes(minutes);
    setSeconds(seconds);
  }, [currentTime]);
  return (
    <Typo className={`text-2xl font-bold text-background-dark ${className}`}>
      {`${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`}
    </Typo>
  );
};

export default Timer;
