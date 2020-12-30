const axios = require('axios');
const cheerio = require('cheerio');
const ObjectsToCsv = require('objects-to-csv')


const pageLinks = [
    "jugamos una",
    "jugamos otra",
    "dungeon marvels"

]

const getGames = async (pageUrl) => {
    const { data } = await axios.get(
        pageUrl
    );

    const games = data.products.map(product => {
        return {
            price: product.price_amount,
            normalPrice: product.regular_price_amount,
            discount: product.discount_amount,
            discount_percentage: product.discount_percentage,
            url: product.url,
            name: product.name
        };
    });
    return games;
}



const getPostTitles = async () => {

    const baseUrl = 'https://jugamosuna.es/tienda/1618-rebajas';

    try {
        const { data } = await axios.get(
            baseUrl
        );
        let postTitles = [];


        for(let i=0; i< data.pagination.pages_count; i++) {
            const pageGames = await getGames(`${baseUrl}${i>0 ? `?page=${i}`: ""}`);
            postTitles = postTitles.concat(pageGames);
        }

        const pagination = Object.values(data.pagination.pages);
        const pages = pagination.map( page => page.url);

        return postTitles;
    } catch (error) {
        throw error;
    }
};

getPostTitles()
    .then(async (postTitles) => {
        const csv = new ObjectsToCsv(postTitles);
        await csv.toDisk('./jugamos-una.csv')
    });
