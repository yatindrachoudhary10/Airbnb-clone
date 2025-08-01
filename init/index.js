const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust"; 



main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// const initDB = async () => {
//   await Listing.deleteMany({});
//   console.log("Inserting listings: ", initData.data.length);
//   await Listing.insertMany(initData.data);
//    console.log("data was initialized");
// };




const initDB = async () => {
  try {
    await Listing.deleteMany({});
    // console.log("🧹 Old data cleared");

    // console.log("📦 Inserting", initData.data.length, "listings...");
    initData.data = initData.data.map((obj)=>({...obj, owner:'6884ddce4fefbc90d56b6003'}));
    const result = await Listing.insertMany(initData.data);
    console.log("✅ Data inserted:", result.length, "documents");
  } catch (err) {
    console.error("❌ Insertion failed:", err.message);
  }
};

 initDB();