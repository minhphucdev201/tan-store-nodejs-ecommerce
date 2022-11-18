const mongoose = require("mongoose");

// Connect database
async function connect() {
  try {
    await mongoose.connect(
      "mongodb+srv://minhphuc:9BTe7VJAfKASCjbq@tan.bz6tukx.mongodb.net/herbalstore?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("connect successfully");
  } catch (error) {
    console.log("connect fail");
  }
}

module.exports = { connect };
