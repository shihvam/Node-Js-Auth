const mongoose = require('mongoose');

const connectToDB = async() => {
  try{
    await mongoose.connect(process.env.MONGO_URI);

    console.log('MongoDB connected successfully');

  }catch(err){
    console.log('Mongodb connection failed');
    process.exit(1);
  }
}

module.exports = connectToDB;

