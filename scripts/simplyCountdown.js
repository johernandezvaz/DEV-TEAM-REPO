const targetDate = new Date("2024-10-03T09:00:00"); // Cambia esta fecha a tu fecha objetivo

const daysElement = document.getElementById("days");
const hoursElement = document.getElementById("hours");
const minutesElement = document.getElementById("minutes");
const secondsElement = document.getElementById("seconds");

const updateCountdown = () => {
  const now = new Date();
  const timeRemaining = targetDate - now;

  const totalSeconds = Math.floor(timeRemaining / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  const seconds = totalSeconds % 60;
  const minutes = totalMinutes % 60;
  const hours = totalHours % 24;
  const days = totalDays;

  daysElement.textContent = days;
  hoursElement.textContent = hours;
  minutesElement.textContent = minutes;
  secondsElement.textContent = seconds;

  const updateProgressCircle = (circle, value, max) => {
    const percentage = (value / max) * 100;
    const degree = (percentage / 100) * 360;
    circle.style.background = `conic-gradient(#1E3A44 ${degree}deg, #e6e6e6 ${degree}deg)`;
  };

  updateProgressCircle(
    document.getElementById("days-circle"),
    days,
    Math.ceil(
      (targetDate - new Date(targetDate.getFullYear(), 0, 0)) /
        (1000 * 60 * 60 * 24)
    )
  );
  updateProgressCircle(document.getElementById("hours-circle"), hours, 24);
  updateProgressCircle(document.getElementById("minutes-circle"), minutes, 60);
  updateProgressCircle(document.getElementById("seconds-circle"), seconds, 60);
};

setInterval(updateCountdown, 1000);
updateCountdown();
