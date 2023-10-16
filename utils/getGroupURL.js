import axios from "axios"
import { Buffer } from "buffer";
import * as cheerio from 'cheerio';
import iconv from 'iconv-lite';

function getIrtsuURL(groupName) {

    return axios.create({ timeout: 5000 }).get('https://rtf.sfedu.ru/raspis/?raspisan').then((html) => {
        const $ = cheerio.load(html.data);
        let url = null;

        $('font[face]').each((i, elem) => {
            if($(elem).text().trim() === groupName) {
                let parent = elem.parent;
                url = $(parent).attr('href')
            }
        });

        return url;
    });
}

function getIuesURL(groupName) {

    let groupInstance = axios.create({
        method: 'GET',
        timeout: 5000,
        responseType: 'arraybuffer',
        headers: {
            "Content-Type": 'text/html',
            
        }
    })

    let rasp = [
        groupInstance.get('https://iues.sfedu.ru/rasp/HTML/Raspisan.html'),
        groupInstance.get('https://iues.sfedu.ru/raspv/HTML/Raspisan.html')
    ]

    return Promise.all(rasp).then((htmlArr) => {
        let urlArr = [];
        let isFirst = true;

        htmlArr.forEach((html) => {
            const $ = cheerio.load(iconv.decode(Buffer.from(html.data), 'windows-1251'));
            let url = null;

            $('font[face]').each((i, elem) => {

                if($(elem).text().trim().toLocaleLowerCase() === groupName.toLocaleLowerCase()) {
                    let parent = elem.parent;
                    urlArr.push(isFirst ? `o:${$(parent).attr('href')}` : `v:${$(parent).attr('href')}`)
                }
            });

            isFirst = false;
        });

        return urlArr.join(',');
    });
}

function getIktibURL(groupName) { 
    return axios.create({ timeout: 5000 }).get(`https://webictis.sfedu.ru/schedule-api/?query=КТ`).then((response) => {
        let data = response.data
        
        if(data['result'] === 'no_entries')
            return Promise.reject(null)

        try {
            let url = data['choices'].filter((x) => x.name === groupName)[0].group
            return Promise.resolve(url)
        }
        catch {
            return Promise.reject(null)
        }
    });
}

export const getGroupURL = (groupName) => {
    let instName = groupName.substring(0, 2)

    switch (instName) {
        case 'РТ':
            return getIrtsuURL(groupName);
        case 'КТ':
            return getIktibURL(groupName);
        case 'УЭ':
            return getIuesURL(groupName);
        default:
            return null;
    }
}