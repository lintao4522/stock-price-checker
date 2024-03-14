const mongoose=require('mongoose');
const { Schema } = mongoose;

const stockSchema = new Schema({
  symbol: String, // String is shorthand for {type: String}
  ips: [String],
  likes:Number

});
const Stock = mongoose.model('Stock', stockSchema);
module.exports =Stock;