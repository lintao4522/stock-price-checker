const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    test('1查看股价：发送 GET 请求到 /api/stock-prices/',(done)=>{
        chai.request(server)
        .get(' /api/stock-prices/')
        .end((req,res)=>{
            req.query.stock='goog';
            assert.equal(res.status,200);
            assert.equal(res.stockData.stock,'goog');
        })
        done();
    })
    test('2查看一个股票并关注它：发送 GET 请求到 /api/stock-prices/',(done)=>{
        chai.request(server)
        .get(' /api/stock-prices/')
        .end((req,res)=>{
            req.query.stock='goog';
            req.query.like=true;
            assert.equal(res.status,200);
            assert.equal(res.stockData.stock,'goog');
            assert.equal(res.stockData.likes,1);
        })
        done();
    })
    test('3查看同一只股票并再次发送关注：发送 GET 请求到 /api/stock-prices/',(done)=>{
        chai.request(server)
        .get(' /api/stock-prices/')
        .end((req,res)=>{
            req.query.stock='goog';
            req.query.like=true;
            assert.equal(res.status,200);
            assert.equal(res.stockData.stock,'goog');
            assert.equal(res.stockData.likes,1);
        })
        done();
    })
    test('4查看两只股票：发送 GET 请求到 /api/stock-prices/',(done)=>{
        chai.request(server)
        .get(' /api/stock-prices/')
        .end((req,res)=>{
            req.query.stock=['goog','uuu'];
            // req.query.like=true;
            assert.equal(res.status,200);
            assert.equal(res.stockData[0].stock,'goog');
            assert.equal(res.stockData[1].stock,'uuu');
            
        })
        done();
    })
    test('5查看两只股票并关注它：发送 GET 请求到 /api/stock-prices/',(done)=>{
        chai.request(server)
        .get(' /api/stock-prices/')
        .end((req,res)=>{
            req.query.stock=['goog','uuu'];
            req.query.like=true;
            assert.equal(res.status,200);
            assert.equal(res.stockData[0].stock,'goog');
            assert.equal(res.stockData[1].stock,'uuu');
            
        })
        done();
    })

});
