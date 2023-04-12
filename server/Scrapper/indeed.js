const puppeteer = require("puppeteer");
const fs = require("fs").promises;
async function indeed(job_id) {
  console.log("Indeed Scrapping");
  const job_role = job_id.replace(" ", "+");
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
  });

  let internships = [];

  const page = await browser.newPage();
  let totalNoOfInternships = 100;
  let currNoOfPage = 1;

  while (totalNoOfInternships >= currNoOfPage) {
    await page.goto(
      // `https://in.indeed.com/jobs?q=${job_id}&start=${currNoOfPage*10}&fromage=400&l=india&sc=0kf%3Ajt%28internship%29%3B`
      `https://in.indeed.com/jobs?q=${job_role}&l=india&sc=0kf%3Ajt%28internship%29%3B&start=${currNoOfPage}&pp=gQAeAAAAAAAAAAAAAAAB_ZNFJABCAQEBB0kzEWkmfdSEcIBtfGQKvmC9KrH37385wpLWH-WrvWv6dC5191hcC4VVQ4dJeeqKU8QmWE3pvNznGufPEatnAAA&vjk=2e19e8bd9332062f`
    );
    await delay(1000);
    const internshipHandles = await page.$$(
      "#mosaic-provider-jobcards > ul > li"
    );
    for (let i = 0; i < internshipHandles.length; i++) {
      if (i == 5 || i == 11 || i == 17) continue;
      else {
        let title = await internshipHandles[i].$eval(".jobTitle", (element) =>
          element.textContent.trim()
        );
        let link = await internshipHandles[i].$eval(
          ".jobTitle > a",
          (element) => element.href
        );
        let companyName = await internshipHandles[i].$eval(
          ".companyName",
          (element) => element.textContent.trim()
        );
        let companyLocation = await internshipHandles[i].$eval(
          ".companyLocation",
          (element) => element.textContent.trim()
        );
        let stipend = "";
        let jobTags = "";
        let jobSnippet = "";
        let jobDate = "";
        if (await internshipHandles[i].$(".salary-snippet-container"))
          stipend = await internshipHandles[i].$eval(
            ".salary-snippet-container > div",
            (element) => element.textContent.trim()
          );
        if (await internshipHandles[i].$(".jobCardShelf"))
          jobTags = await internshipHandles[i].$eval(
            ".jobCardShelf",
            (element) => element.textContent
          );
        if (await internshipHandles[i].$(".job-snippet"))
          jobSnippet = await internshipHandles[i].$eval(
            ".job-snippet",
            (element) => element.textContent.replace("\n", "")
          );
        if (await internshipHandles[i].$(".date"))
          jobDate = await internshipHandles[i].$eval(".date", (element) =>
            element.textContent.trim()
          );
        const internshipData = {
          site: "Indeed",
          title,
          companyName,
          location: companyLocation,
          stipend,
          link,
          tags: jobTags,
          description: jobSnippet,
          postedDate: jobDate,
        };
        internships.push(internshipData);
      }
    }
    await delay(1000);
    currNoOfPage += 10;
  }

  // console.log(internships);
  console.log(internships.length);
  await browser.close();

  console.log("Total Internship Found " + internships.length);

  await fs.writeFile(
    `Scrapper/data/indeed-${job_id}.json`,
    JSON.stringify(internships, null, 2)
  );
  return internships;
}

// indeed(20);
module.exports = indeed;

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}
