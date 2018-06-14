const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')
const app = express();
const cors = require('cors')
app.use(cors());

app.get('/news',(req,res)=>{
    getNews(req.query.keyword).then(news=>{
        res.json(news)
    })
})

async function getNews(keyword){
    console.log(keyword)
    let queryKeyword = keyword.replace(/ /g,"+")
    let news = await axios.get('http://news.ltn.com.tw/search?keyword='+queryKeyword).then((res)=>{
        const $ = cheerio.load(res.data);
        let news = [];
        $('#newslistul').find('li').slice(0, 5).each((i,e)=>{
            news.push({
                date:$(e).find('span').text(),
                tag:$(e).find('.immtag').text(),
                title:$(e).find('p').text(),
                lnik:'http://news.ltn.com.tw/'+$(e).find('.tit').attr('href')
            })
        })
        return news
    })
    return news
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}`));