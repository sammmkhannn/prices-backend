// import puppeteer from "puppeteer";
// import cheerio from "cheerio";

// async function scrape(port) {
//   const browser = await puppeteer.launch({
//     args: ['--proxy-server=socks5://127.0.0.1:' + port]
//   });

//   const page = await browser.newPage();
//   await page.goto('');
//   const content = await page.content();

//   const $ = cheerio.load(content);

//   const titles = [];

//   $('.storylink').slice(0, 5).each((idx, elem) => {
//     const title = $(elem).text();
//     titles.push(title);
//   });

//   browser.close();
//   return titles;
// }

// async function main() {
//   /**
//    * Tor SOCKS ports that we defined in torrc file. 
//    */
//   const ports = [
//     '9050',
//     '9052',
//     '9053',
//     '9054'
//   ];
  
//   /**
//    * Scrape forever...
//    */
//   while (true) {
//     for (const port of ports) {
//       /**
//        * ...each time with different port.
//        */
//       console.log(await scrape(port));
//     }
//   }
// }

// main();


import axios from "axios";

const options = {
  method: 'POST',
  url: 'https://scrapeninja.p.rapidapi.com/scrape',
  headers: {
    'content-type': 'application/json',
    'X-RapidAPI-Key': 'e81918f3d4msh31a0c876d2ff6d2p1db6eejsnfb98020bcadb',
    'X-RapidAPI-Host': 'scrapeninja.p.rapidapi.com'
  },
  data: '{"url":"https://news.ycombinator.com/"}'
};

axios.request(options).then(function (response) {
	console.log(response.data);
}).catch(function (error) {
	console.error(error);
});