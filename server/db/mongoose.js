const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {
  // commented because they dont work with newer mongoose versions anymore
  // useNewUrlParser: true,
  // useCreateIndex: true,
})
