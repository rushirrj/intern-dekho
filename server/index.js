const express = require("express");
const cors = require("cors");
const internshala = require("./Scrapper/internshala");
const indeed = require("./Scrapper/indeed");
const naukri = require("./Scrapper/naukri");
const app = express();
const { linkedin } = require("./Scrapper/linkedin");
const cron = require("node-cron");
const shuffle = require("./utils/shuffleArray");
const sendAlert = require("./utils/getTopInternships");
const fs = require("fs").promises;

const PORT = 4000;

app.use(cors());

app.get("/internshala/:keyword", async(req, res) => {
    const { keyword } = req.params;
    console.log(keyword);
    try {
        // Add cron job
        const hashMap = new Map();
        hashMap.set("software engineer", "software development");
        // await internshala(hashMap.get(keyword));

        const internshalalatestData = require(`./Scrapper/data/internshala-${hashMap.get(
      keyword
    )}`);

        res.status(200).json({
            status: true,
            data: internshalalatestData,
        });
    } catch (err) {
        res.status(404).json({
            status: false,
            data: err,
        });
    }
});

app.get("/indeed/:keyword", async(req, res) => {
    const { keyword } = req.params;
    console.log(keyword);
    try {
        // await indeed(keyword);

        const indeedLatestData = require(`./Scrapper/data/indeed-${keyword}`);

        res.status(200).json({
            status: true,
            data: indeedLatestData,
        });
    } catch (err) {
        res.status(404).json({
            status: false,
            data: err,
        });
    }
});

app.get("/naukri/:keyword", async(req, res) => {
    const { keyword } = req.params;
    console.log(keyword);
    try {
        // await naukri(keyword);

        const naukriLatestData = require(`./Scrapper/data/naukri-${keyword}`);

        res.status(200).json({
            status: true,
            data: naukriLatestData,
        });
    } catch (err) {
        res.status(404).json({
            status: false,
            data: err,
        });
    }
});

app.get("/linkedin/:keyword", async(req, res) => {
    const { keyword } = req.params;
    console.log(keyword);
    try {
        // await linkedin(keyword);

        const linkedinLatestData = require(`./Scrapper/data/linkedin-${keyword.replace(
      " ",
      "-"
    )}`);

        res.status(200).json({
            status: true,
            data: linkedinLatestData,
        });
    } catch (err) {
        res.status(404).json({
            status: false,
            data: err,
        });
    }
});

app.get("/browseAll", async(req, res) => {
    try {
        const latestBrowseAllData = require("./Scrapper/data/browseAll");

        return res.status(200).json({
            status: true,
            data: latestBrowseAllData,
        });
    } catch (err) {
        res.status(404).json({
            status: false,
            data: err,
        });
    }
});

app.get("/test", async(req, res) => {
    try {
        const keywords = ["software engineer"];
        let promiseArr = [];
        const hashMap = new Map();
        hashMap.set("software engineer", "software development");
        for (let i = 0; i < keywords.length; i++) {
            promiseArr.push(linkedin(keywords[i]));
            promiseArr.push(naukri(keywords[i]));
            promiseArr.push(internshala(hashMap.get(keywords[i])));
            promiseArr.push(indeed(keywords[i]));
        }

        const result = await Promise.all(promiseArr);
        console.log(result, "I was here");
        let finalResult = result.flat();

        let randomResult = shuffle(finalResult);

        await fs.writeFile(
            "Scrapper/data/browseAll.json",
            JSON.stringify(randomResult, null, 2)
        );

        await sendAlert("internshala");
        await sendAlert("naukri");
        await sendAlert("linkedin");
        await sendAlert("indeed");


        // const updatedData

        return res.status(200).json({
            status: true,
            data: [],
        });
    } catch (err) {
        res.status(404).json({
            status: false,
            data: err,
        });
    }
});

app.listen(PORT, () => {
    console.log("Server Connected on PORT: " + PORT);
    //schedule here
    // "0 * * * *" every hour
    cron.schedule("0 * * * *", async() => {
        const keywords = ["software engineer"];
        let promiseArr = [];

        const hashMap = new Map();
        hashMap.set("software engineer", "software development");
        for (let i = 0; i < keywords.length; i++) {
            promiseArr.push(naukri(keywords[i]));
            promiseArr.push(internshala(hashMap.get(keywords[i])));
            promiseArr.push(indeed(keywords[i]));
            promiseArr.push(linkedin(keywords[i]));
        }

        const result = await Promise.all(promiseArr);

        let finalResult = result.flat();

        let randomResult = shuffle(finalResult);

        await sendAlert("internshala");
        await sendAlert("naukri");
        await sendAlert("linkedin");
        await sendAlert("indeed");


        await fs.writeFile(
            "Scrapper/data/browseAll.json",
            JSON.stringify(randomResult, null, 2)
        );
    });
});