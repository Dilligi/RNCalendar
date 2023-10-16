import axios from "axios";
import { Buffer } from "buffer";
import * as cheerio from 'cheerio';
import iconv from 'iconv-lite';
import { getWeekNumber } from "./getWeekNumber";

let dayOfWeek = {
    1: 'Пнд',
    2: 'Втр',
    3: 'Срд',
    4: 'Чтв',
    5: 'Птн',
    6: 'Сбт',
    0: null,
  }
  
  let monthOfYear = {
    1: 'января',
    2: 'февраля',
    3: 'марта',
    4: 'апреля',
    5: 'мая',
    6: 'июня',
    7: 'июля',
    8: 'августа',
    9: 'сентября',
    10: 'октября',
    11: 'ноября',
    12: 'декабря',
  }

function getIctibSchedule(url, date) {
    let weekNumber = getWeekNumber(date);

    if (date.dayOfWeek === 0) return Promise.resolve(null);

    return axios.get(`https://webictis.sfedu.ru/schedule-api/?group=${url}`).then((response) => {
        let weeks = response.data.weeks;
        if (weeks.indexOf(weekNumber) === -1) return null;

        return axios.get(`https://webictis.sfedu.ru/schedule-api/?group=${url}&week=${weekNumber}`)
    })
    .then((response) => {
        if (response === null) return [];

        let data = response.data;
        let table = data.table.table;
        let curDay = date.day < 10 ? `0${date.day}` : date.day;
        let curDateString = `${dayOfWeek[date.dayOfWeek]},${curDay}  ${monthOfYear[date.month]}`
        let curClasses = []

        table.forEach(el => {
            let curDateArray = el[0];

            if (curDateString === curDateArray && date.year === new Date().getFullYear()) {
                el.slice(1).forEach((curClass) => {
                    curClasses.push(curClass)
                })
            }
        });

        return curClasses;
    })
}

function getIuesSchedule(url, date) {
    let curDay = date.day < 10 ? `0${date.day}` : date.day;
    let curDateString = `${dayOfWeek[date.dayOfWeek]},${curDay}  ${monthOfYear[date.month]}`;

    let oUrl  = '', vUrl = '';

    url.split(',').forEach((el) => {
        let [typeEl, elVal] = el.split(':');

        if (typeEl === 'o') {
            oUrl = elVal
        }

        if (typeEl === 'v') {
            vUrl = elVal
        }
    });

    let groupInstance = axios.create({
        method: 'GET',
        timeout: 5000,
        responseType: 'arraybuffer',
        headers: {
            "Content-Type": 'text/html',
            
        }
    })
    let urlRequests = []

    if (oUrl) urlRequests.push(groupInstance.get(`https://iues.sfedu.ru/rasp/HTML/${oUrl}`))
    if (vUrl) urlRequests.push(groupInstance.get(`https://iues.sfedu.ru/raspv/HTML/${vUrl}`))

    return Promise.all(urlRequests).then((htmlArr) => {
        let trParent = null;
        let curClasses = []

        htmlArr.forEach((html) => {
            const $ = cheerio.load(iconv.decode(Buffer.from(html.data), 'windows-1251'));

            $('td').each((i, elem) => {
                if($(elem).text().trim().toLocaleLowerCase() === curDateString.toLocaleLowerCase()) {
                    trParent = $(elem).closest('tr');

                    return 0;
                }
            });

            if (trParent && !curClasses.length) {
                $(trParent).children('td').each((i, td) => {
                    curClasses.push($(td).text().split('\n').join(''))
                })
            }
        });

        return curClasses.slice(1)
    })
}

export function getDateSchedule(instName, url, date) {
    switch (instName) {
        case 'РТ':
            return null;
        case 'КТ':
            return getIctibSchedule(url, date);
        case 'УЭ':
            return getIuesSchedule(url, date);
        default:
            return null;
    }
}
