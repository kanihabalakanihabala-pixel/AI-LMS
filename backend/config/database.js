const mongoose = require("mongoose");

exports.connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Database connected");
  } catch (err) {
    console.error("❌ DB Connection Failed", err);
    process.exit(1);
  }
};
