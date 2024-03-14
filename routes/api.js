'use strict';

const mongoose=require('mongoose');
mongoose.connect(process.env.MONGO_URI);
const stockModel=require('../models.js');

async function _gotStock(stock){
  const res=await fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`); 
  const data=await res.json() ;
  const {symbol,latestPrice}=data;
  return {symbol,latestPrice};
}
async function _saveStock(stock,like,ip){
  const findStock=await stockModel.findOne({symbol:stock});
  if(findStock==null){    
    const newStock=await stockModel.create({symbol:stock,ips:like=='true'?[ip]:[],likes:like=='true'?1:0});
    return newStock;   
  }
  else{
    if (!(findStock.ips.includes(ip))&&like=='true'){            
      findStock.likes=findStock.ips.length+1;
      findStock.ips.push(ip);            
      await findStock.save();            
    }
    return findStock;    
  }
}

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async(req, res)=>{
      const {stock,like}=req.query;      
      const ip=req.ip;
      if (Array.isArray(stock)){
        const stockData=[];
        let stockData1,stockData2;        
        const gotStock1=await _gotStock(stock[0]);
        const gotStock2=await _gotStock(stock[1]);
        const saveStock1=await _saveStock(stock[0],like,ip);
        const saveStock2=await _saveStock(stock[1],like,ip);
        if(gotStock1.symbol==null){
          stockData1={ rel_likes:saveStock1.likes-saveStock2.likes};
        }
        else{
          stockData1={stock:saveStock1.symbol,price:gotStock1.latestPrice,
            rel_likes:saveStock1.likes-saveStock2.likes};        
        }      
        if(gotStock2.symbol==null){
          stockData2={rel_likes:saveStock2.likes-saveStock1.likes};
        }
        else{
          stockData2={stock:saveStock2.symbol,price:gotStock2.latestPrice,
            rel_likes:saveStock2.likes-saveStock1.likes};          
        }
        stockData.push(stockData1);
        stockData.push(stockData2);
        return res.json({stockData});
       
            

      }
      const gotStock=await _gotStock(stock); 
      if(gotStock.symbol==null){return res.json({stockData:{like:like=='true'?1:0}})}      
      const saveStock=await _saveStock(stock,like,ip);           
      res.json({stockData:{stock:saveStock.symbol,price:gotStock.latestPrice,likes:saveStock.likes}});      
    });
    
};
