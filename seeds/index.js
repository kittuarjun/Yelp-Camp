
const mongoose=require("mongoose");
const cities=require("./cities");
const {places,descriptors}=require('./seedHelpers');
const Campground=require("../models/campground")
mongoose.set('strictQuery',true);
mongoose.connect("mongodb://localhost:27017/yelp-camp-maptiler")

const db=mongoose.connection;
db.on("error",console.error.bind(console,"Connection Error: "));
db.once("open",()=>{
    console.log("Database Connected");
})

const sample=(array)=>array[Math.floor(Math.random()*array.length)];
const seedDB=async()=>{
    await Campground.deleteMany({});
    // const c=new Campground({title: "purple field"});
    //   await c.save();
    for(let i=0;i< 50;i++){
        const random1000=Math.floor(Math.random()*1000);
        const price=Math.floor(Math.random()*20);
        const camp=new Campground({
            author:"6a15cc95426636b8c095438a", //user id
            location: `${cities[random1000].city} ${cities[random1000].state}`,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "These are some places",
            price,
              images: [
                {
                     url: 'https://res.cloudinary.com/dbqqe7vap/image/upload/v1779774433/YelpCamp/ykjx8cwlmvhcs9xfukut.jpg',
                     filename: 'YelpCamp/ykjx8cwlmvhcs9xfukut',
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
})