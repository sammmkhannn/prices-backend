import puppeteer from "puppeteer-extra";
import Stealth from "puppeteer-extra-plugin-stealth";
import Adblocker from "puppeteer-extra-plugin-adblocker";
import Product from "../models/Product.model.js";
import Url from "../models/Url.model.js";
import { executablePath } from "puppeteer";
puppeteer.use(Stealth());
puppeteer.use(Adblocker());


const service = async () => {
    let urls = await Url.find({});
    if (urls.length > 0) {

        urls = urls.filter((url) => url.link.match(/studio.co/i));
        let urlsString = `
        https://www.studio.co.uk/shop/garden---outdoor/garden-outdoor-lighting/solar-lights-for-the-garden/victoriana-365-solar-lamp-post?searchTerm=lamp%20post&pageView=&pageSize=60&orderBy=#
        https://www.studio.co.uk/shop/homewares/kitchen-essentials/kitchenware-and-accessories/bins/over-door-bin?searchTerm=bin&pageView=&pageSize=60&orderBy=
        https://www.studio.co.uk/shop/garden---outdoor/garden-outdoor-furniture/garden-furniture-sets/aspen-6-seat-modular-set
        https://www.studio.co.uk/shop/christmas/christmas-lights-decorations/christmas-room-decorations/led-santa-with-lamp-post?searchTerm=lamp%20post&pageView=&pageSize=60&orderBy=
        https://www.studio.co.uk/shop/homewares/furniture-collections/furniture-collections-recliners/folding-recliner-chair-faux-leather-blk#
        https://www.studio.co.uk/shop/winter-warmers/winter-warmers-homeware/winter-warmers-heating/storage-fire-surround-white?swatchColour=Grey&searchTerm=heat&pageView=&pageSize=60&orderBy=#
        https://www.studio.co.uk/shop/winter-warmers/winter-warmers-homeware/winter-warmers-heating/egl-small-electric-fire-cream?searchTerm=stove&pageView=&pageSize=60&orderBy=#
        https://www.studio.co.uk/shop/christmas/lights-for-christmas/outdoor-christmas-lights/novelty-outdoor-christmas-lights/24m-led-inflatable-soldier#
        https://www.studio.co.uk/shop/christmas/lights-for-christmas/christmas-light-up-decorations/led-wobbly-white-reindeer
        https://www.studio.co.uk/shop/christmas/lights-for-christmas/novelty-christmas-lights/solar-powered-santa-figurine
        https://www.studio.co.uk/shop/christmas/xmas-trees/pre-lit---led-trees/4ft-white-led-birch-tree
        https://www.studio.co.uk/shop/christmas/xmas-trees/pre-lit---led-trees/4ft-twinkling-led-willow-tree
        https://www.studio.co.uk/shop/christmas/xmas-trees/fibre-optic-christmas-trees/6ft-dual-fo-willow-tree
        https://www.studio.co.uk/shop/shop-all-offers/shop-all-christmas-offers/special-offer-price-promo-christmas/6ft-green-fo-burst-tree?swatchColour=Black&source=TT0E&ch=aw&utm_source=awin&utm_medium=affiliate&utm_campaign=294583&awc=1657_1667790569_1cd49fca6c80549104a615c577913dd6
        https://www.studio.co.uk/shop/christmas/xmas-trees/fibre-optic-christmas-trees/6ft-green-fo-burst-tree?swatchColour=White
        https://www.studio.co.uk/shop/christmas/xmas-trees/fibre-optic-christmas-trees/6ft-green-fo-burst-tree?swatchColour=White
        https://www.studio.co.uk/shop/christmas/xmas-trees/christmas-trees-luxury-traditional/6ft-green-value-tree?swatchColour=Frosted
        `;
        urls = urlsString.split("\n").map(url => url.trim()).filter(str => str != "");
        // urls = ["https://www.studio.co.uk/shop/christmas/xmas-trees/christmas-trees-luxury-traditional/6ft-green-value-tree?swatchColour=Frosted"]
        console.log(urls);
        if (urls.length > 0) {
            for (let url of urls) {
                
            let products = [];

           
            puppeteer.launch({ headless: false, executablePath: executablePath(), slowMo: true }).then(async (browser) => {
                let page = await browser.newPage();
                page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36");
                setTimeout(async () => {
                      
                       
                    // let browser = await puppeteer.launch({ headless: false, args: ['--proxy-server=socks5://127.0.0.1:' + port] });
                    // let page = await browser.newPage();
                    await page.goto(url, { waitUntil: 'load', timeout: 0 });
                    await page.waitForSelector('#price_display_1605963');
                    let { title, price } = await page.evaluate(() => {
                    let title = document.querySelector('h1').textContent.trim();
                    let price = document.getElementById('price_display_1605963').textContent.trim().split("\n")[0];
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
        } else {
            console.log('no urls found related to studio.co');
        }
    }
   

};

// service("https://www.studio.co.uk/shop/garden---outdoor/garden-outdoor-lighting/solar-lights-for-the-garden/victoriana-365-solar-lamp-post?searchTerm=lamp%20post&pageView=&pageSize=60&orderBy=#");
export default service;
