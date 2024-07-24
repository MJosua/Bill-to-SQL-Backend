const express = require('express');
const router = express.Router();
const db = require("../config/db");

const formatDate = require("../public/javascripts/dataformatter")
const reformatDate = require("../public/javascripts/datereformat");
const e = require('express');

const greencolor = '\x1b[32m' // green
const blueColor = '\x1b[34m'; // Blue
const redColor = '\x1b[31m'; // Red
const yellowColor = '\x1b[33m'; // Yellow
const purpleColor = '\x1b[35m'; // Purple


router.get('/', function (req, res, next) {
    res.send('Sukses');
});


router.get('/data', async function (req, res, next) {
    const id = req.query.id;
    const searchTerm = req.query.searchTerm;
    const limit = parseInt(req.query.limit, 10) || 10; // Default limit to 10 if not provided
    const category = req.query.category;
    const offset = parseInt(req.query.offset, 10) || 0; // Default offset to 0 if not provided

    let startDate = '';
    if (req.query.startDate) {
        startDate = reformatDate(req.query.startDate);
    }

    let endDate = '';
    if (req.query.endDate) {
        endDate = reformatDate(req.query.endDate);
    }

    // Base query
    let query = `SELECT event_log.*, master_data.*, master_category.category_name 
                FROM u1109947_Yorozuya.event_log 
                LEFT JOIN u1109947_Yorozuya.master_data ON event_log.id_inventory = master_data.id_product
                LEFT JOIN u1109947_Yorozuya.master_category ON master_data.category = master_category.category_id
                WHERE 1=1`;

    // Handle id condition
    if (id === '0') {
        return res.json({ data: [], dates: [], total: 0, totalPage: 0 });
    } else if (id !== '*') {
        query += ` AND event_log.id_inventory = ?`;
    }

    // Apply filters
    if (category && category !== 'undefined') {
        query += ` AND master_data.id_status = ?`;
    }

    if (searchTerm) {
        query += ` AND (master_data.nama_produk LIKE ? OR master_data.Deskripsi LIKE ?)`;
    }

    if (startDate && endDate) {
        query += ` AND event_log.event_date BETWEEN ? AND ?`;
    } else if (startDate) {
        query += ` AND event_log.event_date >= ?`;
    } else if (endDate) {
        query += ` AND event_log.event_date <= ?`;
    }

    // Query with ordering, limit, and offset
    query += ` ORDER BY event_log.row_number DESC LIMIT ? OFFSET ?`;

    // Count query without limit and offset
    let countQuery = `SELECT COUNT(*) AS total_rows 
                      FROM u1109947_Yorozuya.event_log 
                      LEFT JOIN u1109947_Yorozuya.master_data ON event_log.id_inventory = master_data.id_product
                      LEFT JOIN u1109947_Yorozuya.master_category ON master_data.category = master_category.category_id
                      WHERE 1=1`;

    // Handle id condition for count query
    if (id !== '0' && id !== '*') {
        countQuery += ` AND event_log.id_inventory = ?`;
    }

    // Apply the same filters for the count query
    if (category && category !== 'undefined') {
        countQuery += ` AND master_data.id_status = ?`;
    }

    if (searchTerm) {
        countQuery += ` AND (master_data.nama_produk LIKE ? OR master_data.Deskripsi LIKE ?)`;
    }

    if (startDate && endDate) {
        countQuery += ` AND event_log.event_date BETWEEN ? AND ?`;
    } else if (startDate) {
        countQuery += ` AND event_log.event_date >= ?`;
    } else if (endDate) {
        countQuery += ` AND event_log.event_date <= ?`;
    }

    try {
        // Collect parameters for the queries
        let params = [];
        let countParams = [];

        if (id !== '0' && id !== '*') {
            params.push(id);
            countParams.push(id);
        }
        if (category && category !== 'undefined') {
            params.push(category);
            countParams.push(category);
        }
        if (searchTerm) {
            const searchPattern = `%${searchTerm}%`;
            params.push(searchPattern, searchPattern);
            countParams.push(searchPattern, searchPattern);
        }
        if (startDate && endDate) {
            params.push(startDate, endDate);
            countParams.push(startDate, endDate);
        } else if (startDate) {
            params.push(startDate);
            countParams.push(startDate);
        } else if (endDate) {
            params.push(endDate);
            countParams.push(endDate);
        }

        // Add limit and offset to params
        params.push(limit, offset);

        // Execute the queries
        const [rows] = await db.query(query, params);
        const [countRows] = await db.query(countQuery, countParams);
        const totalRows = countRows[0].total_rows;
        const totalPages = Math.ceil(totalRows / limit);

        // Extract event dates and format them
        const dates = rows.map(row => formatDate(row.event_date));

        // Format event_date for each row in the main data
        const formattedRows = rows.map(row => {
            if (row.event_date) {
                row.event_date = formatDate(row.event_date);
            }
            return row;
        });

        res.json({ data: formattedRows, dates, total: totalRows, totalPage: totalPages });
        console.log("=====================================");
        console.log("Sukses mengambil data log, data :");
        console.log("startingDate :", startDate);
        console.log("endingDate   :", endDate);
        console.log("Search       :", searchTerm);
        console.log("Category     :", category);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


router.get('/date', async function (req, res, next) {

    let query = `SELECT DISTINCT  event_date
    FROM u1109947_Yorozuya.event_log 
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