import express from "express";
import cors from "cors";
import productRoutes from "./routes/product.routes.js";
import urlRoutes from "./routes/url.routes.js";
import connect from "./config/connect.js";
import AmazonService from "./services/amazon.service.js";
import HomeBargainsService from "./services/homebargains.service.js";
import StudioService from "./services/studio.service.js";

import { CronJob } from "cron";

import userRoutes from "./routes/user.routes.js";

import { config } from "dotenv";
config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000;

//routes config
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/links',urlRoutes);



//start the server
connect().then(() => {
    app.listen(process.env.PORT || PORT, async() => {
        console.log(`server is listening on port: ${PORT}`);
        // let amazonJob = new CronJob(" 0 0 7,14,21 * * * ", () => {
        //     AmazonService();
        // },
        // null,
        // true
        // );
        // amazonJob.start();

        // let homeJob = new CronJob(" 0 0 5,10,22 * * * ", () => {
        //    HomeBargainsService();
        // },
        //     null,
        //     true,
        // );

        // homeJob.start();

        // let studioJob = new studioJob(" 0 0 1,13,19 * * *", () => {
             StudioService();
        // },
        //     null,
        //     true
        // );

        // studioJob.start();
       
});
}).catch((err) => {
    console.log(err.message);
})
