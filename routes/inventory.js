var express = require('express');
var router = express.Router();
var db = require("../config/db");

const greenColor = '\x1b[32m'; // Green
const blueColor = '\x1b[34m'; // Blue
const redColor = '\x1b[31m'; // Red
const yellowColor = '\x1b[33m'; // Yellow
const purpleColor = '\x1b[35m'; // Purple

router.get('/', function (req, res, next) {
    res.send('Sukses');
});

router.get('/master_data', async function (req, res, next) {
    const searchTerm = req.query.searchTerm; // Extract the search term from the query parameters
    let query = `SELECT master_category.category_name , master_data.*
    FROM inventory.master_category master_category, inventory.master_data master_data
    WHERE 
        master_category.category_id  = master_data.category `;

    // If a search term is provided, add a condition to filter the results
    if (searchTerm) {
        query += ` AND nama_produk LIKE '%${searchTerm}%'`; // Assuming you want to search in the `nama_produk` column
    }

    const category = req.query.category; // Extract the category from the query parameters

    // If a category is provided, add a condition to filter the results
    if (category && category !== 'undefined') { // Check if category is defined and not 'undefined'
        query += ` AND category = '${category}'`; // Adjust the column name as per your database schema
    }

    try {
        const [rows, fields] = await
            db.query(query);
        res.json(rows);
        console.log(greenColor, "=====================================================")
        console.log(` Akses Get Inventory, Query :`)
        console.log(yellowColor, `Search   :`, searchTerm)
        console.log(` Category :`, category)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



router.post('/master_data', async function (req, res, next) {
    try {


        const { panjang, diameter, nama_produk, kategori } = req.body;

        // Check if panjang, diameter, nama_produk, and kategori are missing or empty
        if (!panjang || !diameter || !nama_produk || !kategori) {
            return res.status(400).send('Panjang, diameter, nama_produk, and kategori are required');
        }


        const [result] = await db.query(
            `INSERT INTO inventory.master_data  (panjang, diameter, nama_produk, category) VALUES (?, ?, ?, ?)`,
            [panjang, diameter, nama_produk, kategori]
        );


        console.log(greenColor, "=====================================================")
        console.log(` Input Data Berhasil, Data : `)
        console.log(yellowColor, `Nama Produk = `, nama_produk)
        console.log(` Panjang     = `, panjang)
        console.log(` Diameter    = `, diameter)
        console.log(` Kategori    = `, kategori)
        res.status(201).json({ id: result.insertId }); // Update the response
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
        console.log("=====================================================")
        console.log("Input Data Gagal, Data : ")
        console.log(`Nama Produk = `, nama_produk)
        console.log(`Panjang     = `, panjang)
        console.log(`Diameter    = `, diameter)
        console.log(`Kategori    = `, kategori)
    }
});


router.get('/category', async function (req, res, next) {
    let query = 'SELECT * FROM inventory.master_category WHERE 1';

    try {
        const [rows, fields] = await
            db.query(query);
        res.json(rows);
        console.log(greenColor, "=====================================================")
        console.log(`Sukises Akses Get Category`)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/category', async function (req, res, next) {
    try {
        const { category_name, category_desc } = req.body;
        // Check if panjang, diameter, nama_produk, and kategori are missing or empty
        if (!category_name) {
            return res.status(400).send('category_name, are required');
        }
        const [result] = await db.query(
            ` INSERT INTO inventory.master_category   
            ( category_name, category_desc) 
            VALUES (?, ?)`,
            [category_name, category_desc]
        );

        console.log(greenColor, "=====================================================")
        console.log(` Input Kategori Berhasil, Data : `)
        console.log(yellowColor, `Nama Kategori = `, category_name)

        res.status(201).json({ id: result.insertId }); // Update the response
    } catch (err) {
        console.error(err.message);

        res.status(500).send('Server Error');
        console.log("=====================================================")
        console.log("Input Data Gagal, Data : ")
        console.log(yellowColor, `Nama Kategori = `, category_name)
    }
});

router.delete('/category'), async function (req, res, next) {
    try {
        const { category_id } = req.body;
        if (!category_id) {
            return res.status(400).send('category_id is required');
            console.log("=====================================================")
            console.log(redColor, "error, category_id is empty")
        }
        constt[result] = await db.query(`
        Delete master_category, master_data
        FROM inventory.master_category master_category, inventory.master_data master_data
        WHERE 
            master_category.category_id  = master_data.category 
            and master_category.category_id = ${category_id}
        `);

        console.log(greenColor, "=====================================================")
        console.log(` Delete Kategori Berhasil, Data : `)
        console.log(redColor, `Nama Kategori = `, category_name)

        res.status(201).json({ id: result }); // Update the response

    } catch (err) {
        console.error(err.message);

        res.status(500).send('Server Error');
        console.log("=====================================================")
        console.log("Delete Data Gagal, Data : ")
        console.log(yellowColor, `Nama Kategori = `, category_name)
    }
}


module.exports = router;
