import mongoose from "mongoose";

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("DB connected successfully");
  } catch (error) {
    console.log(error.message);
  }
};

export default connect;
