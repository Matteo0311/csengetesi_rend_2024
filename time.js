function updateDateTime() {
    const now = new Date();
    const dateElement = document.getElementById('date');
    const timeElement = document.getElementById('time');
    const weekInfoElement = document.getElementById('weekInfo');
    const breakInfoElement = document.getElementById('breakInfo');
    
    const formattedDate = now.toLocaleDateString('hu-HU');
    const formattedTime = now.toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const weekType = getWeekType(now);

    dateElement.textContent = `Dátum: ${formattedDate}`;
    timeElement.textContent = `Idő: ${formattedTime}`;
    weekInfoElement.textContent = `„${weekType}”-hét`;

    const timeToBreak = getTimeToBreak(now);
    breakInfoElement.textContent = timeToBreak;
}

function getWeekType(date) {
    const startDate = new Date('2024-09-09');
    const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
    const weeksElapsed = Math.floor((date - startDate) / oneWeekInMilliseconds);
    return weeksElapsed % 2 === 0 ? 'B' : 'A';
}

function updateBackgroundColor() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    const classPeriods = [
        { start: { hour: 7, minute: 40 }, end: { hour: 8, minute: 25 } },
        { start: { hour: 8, minute: 30 }, end: { hour: 9, minute: 15 } },
        { start: { hour: 9, minute: 25 }, end: { hour: 10, minute: 10 } },
        { start: { hour: 10, minute: 20 }, end: { hour: 11, minute: 5 } },
        { start: { hour: 11, minute: 15 }, end: { hour: 12, minute: 0 } },
        { start: { hour: 12, minute: 20 }, end: { hour: 13, minute: 5 } },
        { start: { hour: 13, minute: 10 }, end: { hour: 13, minute: 55 } },
        { start: { hour: 14, minute: 0 }, end: { hour: 14, minute: 45 } }
    ];

    let isClassTime = false;
    for (const period of classPeriods) {
        if ((hours > period.start.hour || (hours === period.start.hour && minutes >= period.start.minute)) &&
            (hours < period.end.hour || (hours === period.end.hour && minutes < period.end.minute))) {
            isClassTime = true;
            break;
        }
    }

    if (isClassTime) {
        document.body.style.backgroundColor = 'black';
    } else {
        document.body.style.backgroundColor = '#e3f2fd';
    }
}

function updateSchedule() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentPeriod = getCurrentPeriod(hours, minutes);

    const periods = document.querySelectorAll('#schedule tr');
    periods.forEach((row, index) => {
        if (index === 0) return; // Skip header

        const isCurrent = index === currentPeriod;
        const isPast = index < currentPeriod;

        row.classList.toggle('current-period', isCurrent);
        row.classList.toggle('past-period', isPast);
    });
}

function getCurrentPeriod(hours, minutes) {
    const periods = [
        { start: { hour: 7, minute: 40 }, end: { hour: 8, minute: 25 } },
        { start: { hour: 8, minute: 30 }, end: { hour: 9, minute: 15 } },
        { start: { hour: 9, minute: 25 }, end: { hour: 10, minute: 10 } },
        { start: { hour: 10, minute: 20 }, end: { hour: 11, minute: 5 } },
        { start: { hour: 11, minute: 15 }, end: { hour: 12, minute: 0 } },
        { start: { hour: 12, minute: 20 }, end: { hour: 13, minute: 5 } },
        { start: { hour: 13, minute: 10 }, end: { hour: 13, minute: 55 } },
        { start: { hour: 14, minute: 0 }, end: { hour: 14, minute: 45 } }
    ];

    for (let i = 0; i < periods.length; i++) {
        const period = periods[i];
        if ((hours > period.start.hour || (hours === period.start.hour && minutes >= period.start.minute)) &&
            (hours < period.end.hour || (hours === period.end.hour && minutes < period.end.minute))) {
            return i + 1;
        }
    }
    return 0;
}

function getTimeToBreak(now) {
    const periods = [
        { start: { hour: 7, minute: 40 }, end: { hour: 8, minute: 25 } },
        { start: { hour: 8, minute: 30 }, end: { hour: 9, minute: 15 } },
        { start: { hour: 9, minute: 25 }, end: { hour: 10, minute: 10 } },
        { start: { hour: 10, minute: 20 }, end: { hour: 11, minute: 5 } },
        { start: { hour: 11, minute: 15 }, end: { hour: 12, minute: 0 } },
        { start: { hour: 12, minute: 20 }, end: { hour: 13, minute: 5 } },
        { start: { hour: 13, minute: 10 }, end: { hour: 13, minute: 55 } },
        { start: { hour: 14, minute: 0 }, end: { hour: 14, minute: 45 } }
    ];

    for (let i = 0; i < periods.length; i++) {
        const period = periods[i];
        if ((now.getHours() > period.start.hour || (now.getHours() === period.start.hour && now.getMinutes() >= period.start.minute)) &&
            (now.getHours() < period.end.hour || (now.getHours() === period.end.hour && now.getMinutes() < period.end.minute))) {
            
            const periodEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), period.end.hour, period.end.minute);
            const minutesToBreak = Math.ceil((periodEnd - now) / 60000);
            return `Szünet: ${minutesToBreak} perc múlva!`;
        }
        
        if (now.getHours() < period.start.hour || (now.getHours() === period.start.hour && now.getMinutes() < period.start.minute)) {
            const periodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), period.start.hour, period.start.minute);
            const minutesToClass = Math.ceil((periodStart - now) / 60000);
            return `Még ${minutesToClass} perc van hátra az óráig`;
        }
    }
    
    return 'Nincs több óra ma';
}

setInterval(() => {
    updateDateTime();
    updateBackgroundColor();
    updateSchedule();
}, 1000);
