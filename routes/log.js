const express = require('express');
const router = express.Router();
const db = require("../config/db");

const formatDate = require("../public/javascripts/dataformatter")
const reformatDate = require("../public/javascripts/datereformat")

const greencolor = '\x1b[32m' // green
const blueColor = '\x1b[34m'; // Blue
const redColor = '\x1b[31m'; // Red
const yellowColor = '\x1b[33m'; // Yellow
const purpleColor = '\x1b[35m'; // Purple


router.get('/', function (req, res, next) {
    res.send('Sukses');
});


router.get('/data', async function (req, res, next) {

    const searchTerm = req.query.searchTerm;
    const limit = req.query.limit;
    const category = req.query.category; // Extract the category from the query parameters
    const offset = req.query.offset;

    let startDate = '';
    if (req.query.startDate) {
        startDate = reformatDate(req.query.startDate);
    }

    let endDate = '';
    if (req.query.endDate) {
        endDate = reformatDate(req.query.endDate);
    }

    let query = `SELECT event_log.*, master_data.*, master_category.category_name 
                FROM inventory.event_log 
                LEFT JOIN inventory.master_data ON event_log.id_inventory = master_data.id_product
                LEFT JOIN inventory.master_category ON master_data.category = master_category.category_id
                WHERE 1`;

    // Apply filters
    if (category && category !== 'undefined') {
        query += ` AND id_status = '${category}'`;
    }

    if (searchTerm) {
        query += ` AND (master_data.nama_produk LIKE '%${searchTerm}%' OR Deskripsi LIKE '%${searchTerm}%')`;
    }

    if (startDate && endDate) {
        query += ` AND event_log.event_date BETWEEN '${startDate}' AND '${endDate}'`;
    } else if (startDate) {
        query += ` AND event_log.event_date >= '${startDate}'`;
    } else if (endDate) {
        query += ` AND event_log.event_date <= '${endDate}'`;
    }

    // Query with ordering, limit, and offset
    query += ` ORDER BY event_log.row_number DESC LIMIT ${limit} OFFSET ${offset}`;

    // Count query without limit and offset
    let countQuery = `SELECT COUNT(*) AS total_rows 
                      FROM inventory.event_log 
                      LEFT JOIN inventory.master_data ON event_log.id_inventory = master_data.id_product
                      LEFT JOIN inventory.master_category ON master_data.category = master_category.category_id
                      WHERE 1`;

    // Apply the same filters for the count query
    if (category && category !== 'undefined') {
        countQuery += ` AND id_status = '${category}'`;
    }

    if (searchTerm) {
        countQuery += ` AND (master_data.nama_produk LIKE '%${searchTerm}%' OR Deskripsi LIKE '%${searchTerm}%')`;
    }

    if (startDate && endDate) {
        countQuery += ` AND event_log.event_date BETWEEN '${startDate}' AND '${endDate}'`;
    } else if (startDate) {
        countQuery += ` AND event_log.event_date >= '${startDate}'`;
    } else if (endDate) {
        countQuery += ` AND event_log.event_date <= '${endDate}'`;
    }
    
    try {
        const [rows] = await db.query(query);
        const [countRows] = await db.query(countQuery);
        const totalRows = countRows[0].total_rows;
        const totalPages = Math.ceil(totalRows / limit);
        // Extract event dates and format them
        const dates = rows.map(row => {
            return formatDate(row.event_date);
        });

        // Format event_date for each row in the main data
        const formattedRows = rows.map(row => {
            if (row.event_date) {
                row.event_date = formatDate(row.event_date);
            }
            return row;
        });

        res.json({ data: formattedRows, dates, total: countRows, totalPage: totalPages });
        console.log(greencolor, "=====================================");
        console.log(" Sukses mengambil data log, data :");
        console.log(yellowColor, "startingDate :")
        console.log(` startingDate    :`, startDate)
        console.log(` endingDate      :`, endDate)
        console.log(` Search          :`, searchTerm)
        console.log(` Category        :`, category)

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/date', async function (req, res, next) {

    let query = `SELECT DISTINCT  event_date
    FROM inventory.event_log 
    WHERE 1
    `;

    query += ` ORDER BY event_log.row_number DESC`;

    try {
        const [rows] = await db.query(query);

        // Format event_date for each row in the main data
        const formattedRows = rows.map(row => {
            if (row.event_date) {
                row.event_date = formatDate(row.event_date);
            }
            return row;
        });

        res.json({ rows });
        console.log(greencolor, "=====================================");
        console.log(" Sukses mengambil date log, data :");

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router