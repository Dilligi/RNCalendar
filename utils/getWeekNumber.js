function getStartOfSchoolYear(curMonth, currentYear) {
    const today = new Date();
    const septemberFirst = new Date(currentYear, 8, 1); 

    if (curMonth >= 8) {
        // Если текущий месяц больше или равен сентябрю, учебный год начинается в текущем году
        return septemberFirst;
    } else {
        // Иначе учебный год начинается в предыдущем году
        return new Date(currentYear - 1, 8, 1);
    }
}
  
  // Функция для определения номера учебной недели
export function getWeekNumber(currentDate) {
    if(currentDate.year === -1 || currentDate.month === -1 || currentDate.day === -1) return null;
    
    let startDate = getStartOfSchoolYear(currentDate.month - 1, currentDate.year)
    let curDate = new Date(`${currentDate.year}-${currentDate.month}-${currentDate.day}`)

    let startDayOfWeek = startDate.getDay() === 0 ? 6 : startDate.getDay() - 1;
    let curDayOfWeek = curDate.getDay() === 0 ? 6 : curDate.getDay() - 1;
    const days = Math.floor((curDate - startDate) / (24 * 60 * 60 * 1000));

    if (curDayOfWeek < startDayOfWeek) {
        return Math.ceil((days + 1) / 7) + 1;
    }

    return Math.ceil((days + 1) / 7);
}