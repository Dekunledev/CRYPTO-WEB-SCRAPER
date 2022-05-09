const axios = require('axios')
const express = require('express')
const cheerio = require('cheerio')

const app = express();

const url = 'https://www.livecoinwatch.com/'



async function getCryptoPrice() {
    try {
        const { data } = await axios.get(url);

        const $ = cheerio.load(data)
        const elemSelector = '#__next > div > div.content-hack > main > div.d-flex.justify-content-center > div > div.d-flex.flex-row.col-12.px-0.bordered-mob-table > div.lcw-table-container.main-table > table > tbody > tr'

        const coinStats = [
            "rank",
            "name",
            "price",
            "marketCap",
            "volume",
            "liquidity",
            "allTimeHigh",
            "1hr",
            "24hrs"
        ]

        let coinArr = [];

        $(elemSelector).each((parentIdx, parentElem) => {
            let coinStatsIdx = 0;
            const coinObj = {};
            if (parentIdx <= 9) {
                $(parentElem).children().each((childIdx, childElem) => {
                    let coinInfo = $(childElem).text()

                    if (coinStatsIdx === 1) {
                        coinInfo = $('small', $(childElem).html()).text()
                    }

                    if (coinInfo) {
                        coinObj[coinStats[coinStatsIdx]] = coinInfo;

                        coinStatsIdx++;
                    }
                })
                coinArr.push(coinObj);
            }

        })
        return coinArr

    } catch (err) {
        console.error(err)
    }
}

app.get('/api/cryptoprice', async (req, res) => {
    try {
        const cryptoPrice = await getCryptoPrice();
        res.status(200).json({ cryptoPrice })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})


app.listen(3000, () => {
    console.log('LISTENING ON PORT 3000')
})