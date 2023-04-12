const fs = require("fs").promises;
const puppeteer = require("puppeteer");

async function unStop(noOfScroll) {
  console.log("Scrapping Unstop");
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
  });

  let internships = [];

  const page = await browser.newPage();

  await page.goto("https://www.unstop.com/internships");

  let t = 1;
  //for each scroll 15 cards
  while (t++ < noOfScroll) {
    await page.evaluate(async () => {
      document
        .querySelector(".user_list")
        .scrollBy(0, document.querySelector(".user_list").offsetHeight * 10);
    });
    await delay(1000);
  }
  await delay(2000);
  let elements = await page.$$(".user_list > app-competition-listing");
  for (let i = 1; i < elements.length; i++) {
    elements[i].click(".single_profile ");
    await delay(1000);
    let description = await page.$eval(
      "app-competition-about-form",
      (element) => element.textContent.trim()
    );
    let title = await page.$eval(
      "div > div.my_sect > div > h1.h1_title ",
      (element) => element.textContent.trim()
    );
    let location = "";
    if ((await page.$(".region  ")) !== null) {
      location = await page.$eval(".region  ", (element) =>
        element.textContent.trim()
      );
    }
    let companyName = await page.$eval(
      "div > div.my_sect > div > h1.h1_title > span > a  ",
      (element) => element.textContent.trim()
    );
    let link = await page.$eval(".register_btn ", (element) => element.href);
    const internshipData = {
      site: "unstop",
      companyName,
      title,
      description,
      location,
      link,
    };
    internships.push(internshipData);
  }
  console.log(internships);
  console.log("Total Internship Found " + internships.length);
  
  await fs.writeFile('./data/unstop.json', JSON.stringify(internships, null, 2));
  await browser.close();
}
unStop(4);

module.exports = unStop;
function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}
