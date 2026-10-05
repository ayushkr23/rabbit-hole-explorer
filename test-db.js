const mongoose = require('mongoose');
const { Schema } = mongoose;


const RabbitHoleSchema = new Schema({
  topic: String,
  summary: String,
  script: String,
  audioUrl: String,
  createdAt: { type: Date, default: Date.now },
});

const RabbitHole = mongoose.models.RabbitHole || mongoose.model('RabbitHole', RabbitHoleSchema);

async function checkDb() {
  await mongoose.connect(process.env.MONGODB_URI);
  const holes = await RabbitHole.find({});
  console.log("Total holes in DB:", holes.length);
  if (holes.length > 0) {
    console.log("First hole ID:", holes[0]._id.toString());
  }
  mongoose.disconnect();
}
checkDb();
