const puppeteer = require("puppeteer");
const fs = require("fs").promises;

async function internshala(job_role) {
  console.log("Web-Scrapping Internshala");
  const updatedJobRole = job_role.replace("-", " ");
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
  });

  const page = await browser.newPage();

  //get total no of pages
  let currNoOfPage = 1;
  await page.goto(
    `https://internshala.com/internships/${updatedJobRole}-internship/page-${currNoOfPage}/`
  );
  await page.click("#close_popup");

  const element = await page.$("#total_pages");
  let totalNoOfPage = await page.evaluate((ele) => ele.textContent, element);
  totalNoOfPage = 5;
  console.log("Total Number of Pages: " + totalNoOfPage);

  let internships = [];

  for (; currNoOfPage <= totalNoOfPage; currNoOfPage++) {
    if (currNoOfPage != 1) {
      await page.goto(
        `https://internshala.com/internships/${updatedJobRole}-internship/page-${currNoOfPage}/`
      );
      //check if popup is present or not
      // await page.click("#close_popup");
    }
    //scrap per page
    const internshipHandles = await page.$$(
      `#internship_list_container_${currNoOfPage} > .container-fluid `
    );
    for (let i = 0; i < internshipHandles.length; i++) {
      //internship company name
      let companyName = await internshipHandles[i].$eval(
        ".link_display_like_text ",
        (element) => element.textContent.trim()
      );
      //internship title
      let title = await internshipHandles[i].$eval(
        ".view_detail_button ",
        (element) => element.textContent.trim()
      );
      //location of internship
      let location = await internshipHandles[i].$$eval(
        "#location_names > span > a",
        (elements) => {
          return elements.map((element) => element.textContent);
        }
      );
      //internship other details - startTime, duration, stipend
      let internshipOtherDetails = await internshipHandles[i].$$(
        ".other_detail_item"
      );
      let stipend;
      let duration;
      let startTime;
      for (let j = 0; j < internshipOtherDetails.length; j++) {
        if (j == 0) {
          if (
            (await internshipOtherDetails[j].$("#start-date-first ")) !== null
          ) {
            startTime = await internshipHandles[i].$eval(
              "#start-date-first ",
              (element) =>
                element.textContent.trim().replace("Starts immediately", "")
            );
          } else {
            startTime = "Not Mentioned";
          }
        } else if (j == 1) {
          if ((await internshipOtherDetails[j].$(".item_body")) !== null) {
            duration = await internshipOtherDetails[j].$eval(
              ".item_body",
              (element) => element.textContent.trim()
            );
          } else {
            duration = "Not Mentioned";
          }
        } else if (j == 2) {
          if ((await internshipOtherDetails[j].$(".stipend")) !== null) {
            stipend = await internshipOtherDetails[j].$eval(
              ".stipend",
              (element) => element.textContent.trim()
            );
          } else {
            stipend = "Not Mentioned";
          }
        }
      }
      //link of the internship description
      let link = await internshipHandles[i].$eval(
        ".view_detail_button ",
        (element) => element.href
      );
      const internshipData = {
        site: "Internshala",
        title,
        companyName,
        link,
        location: location.toString(),
        stipend,
        // startTime,
        // duration,
        description: "",
      };
      internships.push(internshipData);
    }
  }
  console.log("Total Internship Found " + internships.length);

  await browser.close();
  await fs.writeFile(
    `Scrapper/data/internshala-${job_role}.json`,
    JSON.stringify(internships, null, 2)
  );
  return internships;
}

// internshala("software development");

module.exports = internshala;
