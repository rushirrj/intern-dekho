const fs = require('fs');
const path = require('path');
const axios = require('axios');


const getTopFiveInterns = async(siteName) => {
    const folderPath = '../server/Scrapper/data'; // replace with your folder path
    const telegramArr = [];

    try {
        const files = await fs.promises.readdir(folderPath);
        for (const file of files) {
            const filePath = path.join(folderPath, file);
            if (path.extname(file) === '.json') {
                const data = await fs.promises.readFile(filePath, 'utf8');
                const jsonData = JSON.parse(data);
                const firstWord = (path.basename(file).toLowerCase()).startsWith(siteName);
                // console.log(jsonData[0]);
                if (firstWord) {
                    telegramArr.push(jsonData[0]);
                    telegramArr.push(jsonData[1]);
                    // telegramArr.push(jsonData[2]);
                }
            }
        }
    } catch (err) {
        console.error(err);
    }

    return telegramArr;
};

const sendAlert = async(siteName) => {

    const fetchTopFiveData = await getTopFiveInterns(siteName);
    console.log(fetchTopFiveData, "I was here");
    // const message =
    //     `Site - ${fetchTopFiveData[0].site}
    // Role - ${fetchTopFiveData[0].title}
    // Company - ${fetchTopFiveData[0].link}
    // Location - ${fetchTopFiveData[0].location[0]}
    // \n
    // `
    let tempMessage = `${siteName} \n \n`;
    for (let i = 0; i < Math.min(fetchTopFiveData.length, 5); i++) {
        tempMessage +=
            `Job Board - ${fetchTopFiveData[i].site}\n \n` +
            `Role - ${fetchTopFiveData[i].title}\n \n` +
            `Company - ${fetchTopFiveData[i].companyName}\n \n` +
            `Location - ${typeof fetchTopFiveData[i].location == "string" ? fetchTopFiveData[i].location : fetchTopFiveData[i].location[0]}\n \n` +
            `Link - ${fetchTopFiveData[i].link}\n`

    }

    // let finalMessage = `${siteName} \n` + tempMessage;

    let token = "5631914850:AAEW9VB3wtWHm9Ws4nBxXWKNOczovsJawrw";
    let api = `https://api.telegram.org/bot${token}`;
    await axios.post(`${api}/sendMessage`, {
        chat_id: "-731360208",
        text: tempMessage,
    });
};
// sendAlert("internshala");
module.exports = sendAlert;