var express = require('express');
var router = express.Router();
const multer = require('multer'); // For handling multipart/form-data (file uploads)
const path = require('path');
var db = require("../config/db");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/'); // Destination folder for uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const greenColor = '\x1b[32m'; // Green
const blueColor = '\x1b[34m'; // Blue
const redColor = '\x1b[31m'; // Red
const yellowColor = '\x1b[33m'; // Yellow
const purpleColor = '\x1b[35m'; // Purple
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Jalan' });
});


router.get('/master_data', async function (req, res, next) {
    console.log(blueColor, "=====================================================")
    console.log(" Accessing get./inven/masterdata")

    const searchTerm = req.query.searchTerm; // Extract the search term from the query parameters
    const category = req.query.category; // Extract the category from the query parameters
    const employeeName = req.query.employee_name; // Extract employee_name from query parameters
    const dateFrom = req.query.datefrom; // Extract datefrom from query parameters
    const dateUntil = req.query.dateuntil; // Extract dateuntil from query parameters

    // Start building the SQL query for detailed data
    let queryDetailed = `
    SELECT 
        employee_name, 
        employee_division,
        Bill_ID,
        Image_path,
        Bill_date,
        CASE WHEN BillTipe_ID = 1 THEN Grand_total ELSE 0 END AS Restaurant,
        CASE WHEN BillTipe_ID = 2 THEN Grand_total ELSE 0 END AS Bensin,
        CASE WHEN BillTipe_ID = 3 THEN Grand_total ELSE 0 END AS Hotel,
        CASE WHEN BillTipe_ID = 4 THEN Grand_total ELSE 0 END AS Entertain,
        CASE WHEN BillTipe_ID = 5 THEN Grand_total ELSE 0 END AS Advance,
        CASE WHEN BillTipe_ID = 6 THEN Grand_total ELSE 0 END AS Tol,
        CASE WHEN BillTipe_ID = 7 THEN Grand_total ELSE 0 END AS Parkir,
        CASE WHEN BillTipe_ID = 8 THEN Grand_total ELSE 0 END AS Other,
        Bill_Remark AS Keterangan
    FROM 
        BillScanner_Log a
    LEFT JOIN 
        master_employee b ON a.employee_id = b.employee_id 
    WHERE 
        a.employee_id = 1 
        AND a.Bill_Date BETWEEN '2024-07-01' AND '2024-07-30' 
    `;

    // Add conditions based on search parameters
    if (searchTerm && searchTerm !== '') {
        queryDetailed += ` AND (b.employee_name LIKE '%${searchTerm}%' OR BT.BillTipe_Name LIKE '%${searchTerm}%' OR BL.Bill_NamaToko LIKE '%${searchTerm}%') `;
    }

    if (category && category !== 'undefined') {
        queryDetailed += ` AND BT.BillTipe_Name = '${category}'`;
    }

    if (employeeName && employeeName !== '') {
        queryDetailed += ` AND b.employee_name LIKE '%${employeeName}%'`; // Assuming column name is correct
    }

    if (dateFrom && dateUntil) {
        queryDetailed += ` AND a.Bill_Date BETWEEN '${dateFrom}' AND '${dateUntil}'`;
    }

    queryDetailed += `
    ORDER BY 
        Bill_date ASC
    `;

    // Query to get the sum of Grand_total without grouping
    let querySum = `
    SELECT 
        SUM(Grand_total) AS Total_Grand_Total
    FROM 
        BillScanner_Log a
    WHERE 
        a.employee_id = 1 
        AND a.Bill_Date BETWEEN '2024-07-01' AND '2024-07-30' 
    `;

    // Execute both queries
    try {
        const [rowsDetailed, fieldsDetailed] = await db.query(queryDetailed);
        const [rowsSum, fieldsSum] = await db.query(querySum);

        // Extract the sum from the result of the sum query
        const totalGrandTotal = rowsSum[0].Total_Grand_Total;

        // Prepare response object combining detailed data and total sum
        const responseData = {
            detailedData: rowsDetailed,
            totalGrandTotal: totalGrandTotal
        };

        res.json(responseData);

        console.log(greenColor, "=====================================================")
        console.log(` Akses Get Inventory, Query :`)
        console.log(yellowColor, `Search   :`, searchTerm)
        console.log(` Category :`, category)
        console.log(` Employee Name :`, employeeName)
        console.log(` Date From :`, dateFrom)
        console.log(` Date Until :`, dateUntil)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/master_employee', async function (req, res, next) {

    let queryDetailed = `
    SELECT 
       * 
    FROM 
        master_employee
    `;

    try {
        const [rows] = await db.query(queryDetailed);



        res.json(rows);

        console.log(greenColor, "=====================================================")
        console.log(` Akses Get master_employee, Query :`)

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

})


router.get('/master_BillTipe', async function (req, res, next) {

    let queryDetailed = `
    SELECT 
       * 
    FROM 
        BillScanner_BillTipe
    `;



    try {
        const [rows] = await db.query(queryDetailed);



        res.json(rows);

        console.log(greenColor, "=====================================================")
        console.log(` Akses Get master_BillTipe, Query :`)

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

})

router.get('/master_BillingData', async function (req, res, next) {

    const billID = req.query.billID;



    let queryDetailed = `
    SELECT 
       * 
    FROM 
        BillScanner_Item
    `;



    let querySum = `
    SELECT 
        Grand_total
    FROM 
        BillScanner_Log 
    `;

    if (billID && billID !== '') {
        queryDetailed += ` WHERE ( Bill_ID = ${billID} ) `;
        querySum += ` WHERE ( Bill_ID = ${billID} ) `;
    }

    try {
        const [rows] = await db.query(queryDetailed);
        const [rowTotal] = await db.query(querySum);


        const responseData = {
            detailedData: rows,
            grandtotal: rowTotal ? rowTotal[0].Grand_total : null // Access Grand_total directly
        };


        res.json(responseData);

        console.log(greenColor, "=====================================================")
        console.log(` Akses Get master_BillTipe, Query :`)

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

})

router.post('/master_data', upload.single('photo'), async function (req, res, next) {
    console.log("Accessing POST /master_data");

    // Extract file information
    const file = req.file;
    console.log("Received file:", file);

    // Extract sessionData from the request body and parse it
    let jsonData;
    try {
        jsonData = JSON.parse(req.body.sessionData);
    } catch (err) {
        console.error('Invalid JSON data format:', err.message);
        return res.status(400).send('Invalid JSON data format');
    }

    // Log the type and content of jsonData for debugging
    console.log("Type of jsonData:", typeof jsonData);
    console.log("Received JSON data:", jsonData);

    // Validate if jsonData contains the expected structure
    if (!jsonData['company-information'] || !jsonData['item-information'] || !jsonData['bill-information']) {
        console.error('Invalid data format: expected company-information, item-information, and bill-information arrays');
        return res.status(400).send('Invalid data format: expected company-information, item-information, and bill-information arrays');
    }

    let companyInfo = jsonData['company-information'];
    let itemInfo = jsonData['item-information'];
    let billInfo = jsonData['bill-information'];

    // Validate that the arrays are not empty
    if (!companyInfo.length || !itemInfo.length || !billInfo.length) {
        console.error('Invalid data format: arrays should not be empty');
        return res.status(400).send('Invalid data format: arrays should not be empty');
    }

    // Extract and log data
    const companyName = companyInfo[0]['company-name'] || 'Unknown';
    const employeeName = companyInfo[0]['employee-name'] || 'ERROR NEED TO VERIFY NO DATA NAME';
    const customerName = companyInfo[0]['customer-division'] || 'Not Using Customer';
    const companyAddress = companyInfo[0]['company-address'] || '';
    const totalDiskon = billInfo[0]["total-discount"] ? parseFloat(billInfo[0]["total-discount"].replace(',', '')) : 0;
    const createdDate = new Date().toISOString().slice(0, 19).replace('T', ' '); // Get current date in MySQL datetime format
    const billDate = new Date(billInfo[0]['bill-date']).toISOString().split('T')[0];
    const totalBillPrice = parseFloat(billInfo[0]['total-price'].replace(',', '')) || 0;
    const remarks = billInfo[0]["remarks"] || "-";

    // Handle file path conditionally
    const imagePath = file ? `uploads/${file.filename.replace(/\\/g, '/')}` : null;

    console.log("companyName:", companyName);
    console.log("companyAddress:", companyAddress);
    console.log("totalDiskon:", totalDiskon);
    console.log("createdDate:", createdDate);
    console.log("billDate:", billDate);
    console.log("totalBillPrice:", totalBillPrice);
    console.log("remarks:", remarks);
    console.log("imagePath:", imagePath);

    // Build your insert queries here
    const billInsertQuery = `INSERT INTO u1109947_Yorozuya.BillScanner_Log (BillTipe_ID, Grand_Total, Bill_Date, Grand_Discount, Bill_NamaToko,  employee_id, Bill_CreatedDate, Bill_Remark, Image_Path) VALUES ?`;
    const itemInsertQuery = `INSERT INTO u1109947_Yorozuya.BillScanner_Item (Item_Name, Item_Price, Item_Discount, Item_Quantity, Bill_ID) VALUES ?`;

    try {
        // Prepare bill values for insertion
        const billValues = [
            [billInfo[0]["bill-type"], totalBillPrice, billDate, totalDiskon, companyName, employeeName, createdDate, remarks, imagePath || '-']
        ];

        console.log("Prepared bill values:", billValues);

        // Insert into bill table and get the inserted Bill_ID
        const [result] = await db.query(billInsertQuery, [billValues]);
        console.log("Bill insert result:", result);

        const billId = result.insertId;
        console.log("Inserted Bill ID:", billId);

        // Prepare item values for insertion
        const itemValues = itemInfo.map(item => [
            item["item-name"],
            parseFloat(item["item-price"]),
            item["item-discount"] ? parseFloat(item["item-discount"]) : 0,
            parseFloat(item["item-quantity"]),
            billId
        ]);

        console.log("Prepared item values:", itemValues);

        // Insert into item table
        const [itemResult] = await db.query(itemInsertQuery, [itemValues]);
        console.log("Item insert result:", itemResult);

        res.status(200).send('Data inserted successfully');
        console.log("Data inserted successfully");
    } catch (err) {
        console.error("Error inserting data:", err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
