import puppeteer from "puppeteer-extra";
import Stealth from "puppeteer-extra-plugin-stealth";
import Adblocker from "puppeteer-extra-plugin-adblocker";
import Product from "../models/Product.model.js";
import { executablePath } from "puppeteer";
import Url from "../models/Url.model.js";

puppeteer.use(Stealth());
puppeteer.use(Adblocker());

const service = async () => {
    let urls = await Url.find({});
    if (urls.length > 0) {

        urls = urls.filter((url) => url.link.match(/amazon.co/i));
     
        if (urls.length > 0) {
            let products = [];
            puppeteer.launch({ headless: false, executablePath: executablePath(), slowMo: true }).then(async (browser) => {
                let page = await browser.newPage();
                setTimeout(async () => {
                    for (let url of urls) {
                        try {
            
                            await page.goto(url.link, { waitUntil: 'load', timeout: 0 });
        
                            await page.waitForSelector('#productTitle');
                            let { title, price } = await page.evaluate(() => {
                                let title = document.getElementById('productTitle').textContent;
                                let price = document.getElementById('price').textContent;
                                return { title, price };
                            });
                            products.push({ link: url.link, title, price});
                            
                        } catch (err) {
                            continue;
                        }
                    }
                    //log the products
                    console.log(products);
                    //insert the products in the database
                    for (let product of products) {
                        let existing = await Product.findOne({ link: product.link, title: product.title });
                       
                        if (existing) {
                            let oldPrice = existing.price;
                            //update the product
                            await Product.updateOne({ link: product.link, title: product.title }, { price:product.price,oldPrice });
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

};

 export default service;

