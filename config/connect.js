import mongoose from "mongoose";


export default async function connect() {
    mongoose.connect("mongodb+srv://admin:1990xe98@cluster0.b86j3.mongodb.net/prices?retryWrites=true&w=majority", { useNewUrlParser: true });
    let conn = mongoose.connection;

    conn.once('open', () => {
        console.log('Connected to the Database');
    })
        .on('error', (err) => {
            console.log(err.message);
        });
    
}
