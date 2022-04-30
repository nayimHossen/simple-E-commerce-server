const express = require('express');
const cors = require('cors');
require('dotenv').config()
const res = require('express/lib/response');
const port = process.env.PORT || 5000;
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://simple-E-commerce:${process.env.DB_PASS}@cluster0.bp91o.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productCollection = client.db('e-commerce').collection('product');

        app.get('/products', async (req, res) => {
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);

            const query = {};
            const cursor = productCollection.find(query);
            let products;
            if (page || size) {
                products = await cursor.skip(page * size).limit(size).toArray();
            }
            else {
                products = await cursor.toArray();
            }
            res.send(products);
        });

        //how many products have on server
        app.get('/productsCount', async (req, res) => {
            const count = await productCollection.estimatedDocumentCount();
            res.send({ count });
        });
    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Nayim is now server');
});

app.listen(port, () => {
    console.log(`server is running in port : ${port}`);
});