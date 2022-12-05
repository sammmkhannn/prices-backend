import puppeteer from "puppeteer-extra";
import Stealth from "puppeteer-extra-plugin-stealth";
import Adblocker from "puppeteer-extra-plugin-adblocker";
import Product from "../models/Product.model.js";
import { executablePath } from "puppeteer";
import Url from "../models/Url.model.js";

puppeteer.use(Stealth());
puppeteer.use(Adblocker({blockTrackers:true}));



const service = async () => {
    let urls = await Url.find({});
    if (urls.length > 0) {

        urls = urls.filter((url) => url.link.match(/homebargains.co/i));
     
        if (urls.length > 0) {
            for (let url of urls) {
                
            let products = [];

           
            puppeteer.launch({ headless: false, executablePath: executablePath(), slowMo: true }).then(async (browser) => {
                let page = await browser.newPage();
                page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36");
                setTimeout(async () => {
                      
                       
                    // let browser = await puppeteer.launch({ headless: false, args: ['--proxy-server=socks5://127.0.0.1:' + port] });
                    // let page = await browser.newPage();
                    await page.goto(url.link, { waitUntil: 'load', timeout: 0 });
                    await page.waitForSelector('.mc-closeModal');
                    await page.click(".mc-closeModal");
                    await page.waitForSelector('h1');
                    await page.waitForSelector('.overview-price');
                    let { title, price } = await page.evaluate(() => {
                        let title = document.querySelector('h1').textContent.trim();
                        let price = document.querySelector('.overview-price').textContent.trim();
                        return { title, price };
                    });
                    products.push({ link: url.link, title, price });
                            
                        
                    
                    //log the products
                    console.log(products);
                    //insert the products in the database
                    for (let product of products) {
                        let existing = await Product.findOne({ link: product.link, title: product.title });
                       
                        if (existing) {
                            let oldPrice = existing.price;
                            //update the product
                            await Product.updateOne({ link: product.link, title: product.title }, { price: product.price, oldPrice });
                        } else {
                            let newProduct = new Product({
                                link: product.link,
                                title: product.title,
                                price: product.price,
                                oldPrice: product.price
                            });
                            newProduct.save().then((response) => {
                                console.log('product has been stored');
                            });
                        }
                    }
            
                }, 5000);
            });
        }
        }
    }
   
};


export default service;
