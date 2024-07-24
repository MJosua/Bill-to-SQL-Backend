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
    console.log(blueColor, "=====================================================")
    console.log(" Accessing get./inven/masterdata")

    const searchTerm = req.query.searchTerm; // Extract the search term from the query parameters
    const category = req.query.category; // Extract the category from the query parameters


    let query = `SELECT 
    mc.category_name,
    md.*,
    ml.lokasi_name
FROM 
    u1109947_Yorozuya.master_category mc
JOIN 
    u1109947_Yorozuya.master_data md ON mc.category_id = md.category 
JOIN 
    u1109947_Yorozuya.master_lokasi ml ON md.lokasi_id = ml.lokasi_id `;

    // If a search term is provided, add a condition to filter the results
    if (searchTerm && searchTerm !== '') {
        query += ` AND ( md.nama_produk LIKE '%${searchTerm}%' OR md.id_product LIKE '%${searchTerm}%' ) `; // Assuming you want to search in the `nama_produk` column
    }


    // If a category is provided, add a condition to filter the results
    if (category && category !== 'undefined') { // Check if category is defined and not 'undefined'
        query += ` AND category_name = '${category}'`; // Adjust the column name as per your database schema
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
    let connection;

    try {
        console.log(blueColor, "=====================================================");
        console.log(" Accessing post./inven/masterdata");

        const { panjang, diameter, nama_produk, kategori, lokasi } = req.body;

        // Check if panjang, diameter, nama_produk, and kategori are missing or empty
        if (!panjang || !diameter || !nama_produk || !kategori) {
            return res.status(400).send('Panjang, diameter, nama_produk, and kategori are required');
        }

        // Start a transaction
        connection = await db.getConnection();
        await connection.beginTransaction();

        // Insert data into master_data table
        const [masterDataResult] = await connection.query(
            `INSERT INTO u1109947_Yorozuya.master_data (panjang, diameter, nama_produk, category, lokasi_id) VALUES (?, ?, ?, ?, ?)`,
            [panjang, diameter, nama_produk, kategori, lokasi]
        );

        // Insert data into event_log table using the inserted ID from master_data
        const [eventLogResult] = await connection.query(
            `INSERT INTO u1109947_Yorozuya.event_log (Filter, id_inventory, event_date, Deskripsi, id_status, nama_awal, panjang_awal) 
             VALUES (?, ?, NOW(), 'Pembuatan Master_data ${nama_produk}', 1, ?, ?)`,
            [`Master Data`, masterDataResult.insertId, nama_produk, panjang]
        );

        const [inventory] = await connection.query(
            `INSERT INTO u1109947_Yorozuya.master_inventory 
            (panjang_product, diameter_product, mnf_date, active, id_product) 
            VALUES (?, ?, NOW(), 1, ?)`,
            [panjang, diameter, masterDataResult.insertId]
        );

        // Commit the transaction
        await connection.commit();

        console.log(greenColor, "=====================================================");
        console.log(` Input Data Berhasil, Data : `);
        console.log(yellowColor, `Nama Produk = `, nama_produk);
        console.log(` Panjang     = `, panjang);
        console.log(` Diameter    = `, diameter);
        console.log(` Kategori    = `, kategori);

        res.status(201).json({ id: masterDataResult.insertId }); // Update the response
    } catch (err) {
        // Rollback the transaction if an error occurs
        if (connection) {
            await connection.rollback();
        }

        console.error(err.message);
        res.status(500).send('Server Error');
        console.log("=====================================================");
        console.log("Input Data Gagal, Data : ");
        console.log(`Nama Produk = `, nama_produk);
        console.log(`Panjang     = `, panjang);
        console.log(`Diameter    = `, diameter);
        console.log(`Kategori    = `, kategori);
    } finally {
        // Release the database connection
        if (connection) {
            connection.release();
        }
    }
});

router.patch('/master_data', async function (req, res, next) {
    try {
        console.log(blueColor, "=====================================================");
        console.log(" Accessing patch./inven/masterdata");

        const { id, panjang, diameter, nama_produk, kategori } = req.body;

        // Check if id is provided
        if (!id) {
            return res.status(400).send('ID is required');
        }

        // Check if at least one field to update is provided
        if (!panjang && !diameter && !nama_produk && !kategori) {
            return res.status(400).send('At least one of panjang, diameter, nama_produk, or kategori is required');
        }

        // Build the update query dynamically based on provided fields
        const fields = [];
        const values = [];

        if (panjang !== undefined) {
            fields.push("panjang = ?");
            values.push(panjang);
        }
        if (diameter !== undefined) {
            fields.push("diameter = ?");
            values.push(diameter);
        }
        if (nama_produk !== undefined) {
            fields.push("nama_produk = ?");
            values.push(nama_produk);
        }
        if (kategori !== undefined) {
            fields.push("category = ?");
            values.push(kategori);
        }

        // Add the ID at the end of the values array for the WHERE clause
        values.push(id);

        const [updateResult] = await db.query(
            `UPDATE u1109947_Yorozuya.master_data SET ${fields.join(", ")} WHERE id_product = ?`,
            values
        );

        if (updateResult.affectedRows === 0) {
            return res.status(404).send('No record found with the provided ID');
        }

        // Insert event log if update is successful
        const [logResult] = await db.query(
            `INSERT INTO u1109947_Yorozuya.event_log (Filter, id_inventory, event_date, Deskripsi, id_status) 
             VALUES (?, ?, NOW(), ?, ?)`,
            ['Master Data', id, `Update Master_data ${nama_produk}`, 3]
        );

        console.log(greenColor, "=====================================================");
        console.log(" Update Data Berhasil, Data : ");
        if (nama_produk) console.log(yellowColor, "Nama Produk =", nama_produk);
        if (panjang) console.log(` Panjang     =`, panjang);
        if (diameter) console.log(yellowColor, `Diameter    =`, diameter);
        if (kategori) console.log(yellowColor, `Kategori    =`, kategori);

        res.status(200).json({ message: 'Update and log successful' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
        console.log(" =====================================================");
        console.log(" Update Data Gagal, Data : ");
        if (nama_produk) console.log("Nama Produk =", nama_produk);
        if (panjang) console.log("Panjang =", panjang);
        if (diameter) console.log("Diameter =", diameter);
        if (kategori) console.log("Kategori =", kategori);
    }
});

router.delete('/master_data', async function (req, res, next) {
    console.log(blueColor, "=====================================================");
    console.log(" Accessing delete./inven/masterdata");

    const { id_master_data } = req.body;

    try {
        // Check if id_master_data is provided
        if (!id_master_data) {
            console.log(redColor, "ID was not found");
            return res.status(400).send('ID was not found');
        }

        // Delete the record from master_data
        const [deleteResult] = await db.query(
            `DELETE FROM u1109947_Yorozuya.master_data WHERE id_product = ?`,
            [id_master_data]
        );



        // Check if any row was affected (i.e., if the record existed)
        if (deleteResult.affectedRows === 0) {
            return res.status(404).send('No record found with the provided ID');
            consolel.log(redColor, 'No record found with the provided ID');
        }

        // Insert the deletion event log
        const [logResult] = await db.query(
            `INSERT INTO u1109947_Yorozuya.event_log (Filter, id_inventory, event_date, Deskripsi, id_status) 
             VALUES (?, ?, NOW(), ?, ?)`,
            ['Master Data', id_master_data, `Deletion of Master_data with ID ${id_master_data}`, 2]
        );

        console.log(greenColor, "=====================================================");
        console.log(` Delete Data Berhasil, Data : `);
        console.log(yellowColor, `ID Produk = `, id_master_data);

        res.status(200).json({ message: 'Deletion successful', id: id_master_data });
    } catch (err) {
        console.error(err.message);
        console.log("=====================================================");
        console.log(` Delete Data Gagal, Data : `);
        console.log(redColor, `ID Produk = `, id_master_data);
        res.status(500).send('Server Error');
    }
});


router.get('/category', async function (req, res, next) {
    let query = ` SELECT 
    mc.category_id,
    mc.category_name,
    mc.category_desc,
    COUNT(md.category) AS quantity
FROM 
    u1109947_Yorozuya.master_category mc
LEFT JOIN 
    u1109947_Yorozuya.master_data md ON mc.category_id = md.category
GROUP BY 
    mc.category_id, mc.category_name, mc.category_desc`;

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
        const [Postresult] = await db.query(
            ` INSERT INTO u1109947_Yorozuya.master_category   
            ( category_name, category_desc) 
            VALUES (?, ?)`,
            [category_name, category_desc]
        );

        if (Postresult.affectedRows === 0) {
            return res.status(404).send('No record found with the provided ID');
            consolel.log(redColor, 'No record found with the provided ID');
        }

        // Insert the deletion event log
        const [logResult] = await db.query(
            `INSERT INTO u1109947_Yorozuya.event_log (Filter, id_inventory, event_date, Deskripsi, id_status) 
             VALUES (?, ?, NOW(), ?, ?)`,
            ['Category', Postresult.insertId, `Creation of Category with ID ${Postresult.insertId} and Name ${Postresult.category_name}`, 1]
        );

        console.log(greenColor, "=====================================================")
        console.log(` Input Kategori Berhasil, Data : `)
        console.log(yellowColor, `Nama Kategori = `, category_name)

        res.status(201).json({ id: Postresult.insertId }); // Update the response
    } catch (err) {
        console.error(err.message);

        res.status(500).send('Server Error');
        console.log("=====================================================")
        console.log("Input Data Gagal, Data : ")
        console.log(yellowColor, `Nama Kategori = `, category_name)
    }
});

router.delete('/category', async function (req, res, next) {
    try {
        const { category_id, category_name } = req.body;
        if (!category_id) {
            return res.status(400).send('category_id is required');
        }

        const deleteresult = await db.query(`
        DELETE master_category, master_data
        FROM u1109947_Yorozuya.master_category AS master_category
        LEFT JOIN u1109947_Yorozuya.master_data AS master_data ON master_category.category_id = master_data.category 
        WHERE master_category.category_id = ${category_id}
        `);


        if (deleteresult.affectedRows === 0) {
            return res.status(404).send('No record found with the provided ID');
            consolel.log(redColor, 'No record found with the provided ID');
        }

        // Insert the deletion event log
        const [logResult] = await db.query(
            `INSERT INTO u1109947_Yorozuya.event_log (Filter, id_inventory, event_date, Deskripsi, id_status) 
             VALUES (?, ?, NOW(), ?, ?)`,
            ['Category', category_id, `Deletion of Category with ID ${category_id} and Name ${category_name}`, 2]
        );

        if (deleteresult) {
            console.log("=====================================================");
            console.log("Delete Kategori Berhasil, Data : ");
            console.log("ID Kategori = ", category_id);
        }



        res.status(200).json({ id: deleteresult }); // Update the response

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');

        console.log("=====================================================");
        console.log("Delete Data Gagal, Data : ");
        console.log("ID Kategori = ", category_id);
    }
});

router.patch('/category', async function (req, res, next) {
    try {
        console.log(blueColor, "=====================================================");
        console.log(" Accessing patch./inven/category");

        const { category_name, category_desc, category_id } = req.body;

        // Check if id is provided
        if (!category_id) {
            return res.status(400).send('ID is required');
        }


        // Check if at least one field to update is provided
        if (!category_name && !category_desc && !category_id) {
            return res.status(400).send('At least one of ategory_name && !category_desc && !category_id is required');
        }

        // Build the update query dynamically based on provided fields
        const fields = [];
        const values = [];

        if (category_name !== undefined) {
            fields.push("category_name = ?");
            values.push(category_name);
        }
        if (category_desc !== undefined) {
            fields.push("category_desc = ?");
            values.push(category_desc);
        }
        // Add the ID at the end of the values array for the WHERE clause
        values.push(category_id);

        const [result] = await db.query(
            `UPDATE u1109947_Yorozuya.master_category SET ${fields.join(", ")} WHERE category_id = ?`,
            values
        );

        if (result.affectedRows === 0) {
            return res.status(404).send('No record found with the provided ID');
        }


        // Insert the deletion event log
        const [logResult] = await db.query(
            `INSERT INTO u1109947_Yorozuya.event_log (Filter, id_inventory, event_date, Deskripsi, id_status) 
             VALUES (?, ?, NOW(), ?, ?)`,
            ['Category', category_id, `Update of Category with ID ${category_id} and Name ${category_name}`, 3]
        );


        console.log(greenColor, "=====================================================");
        console.log(" Update Data Successful, Data : ");
        if (category_name) console.log(yellowColor, "category_name =", category_name);
        if (category_desc) console.log(` category_desc =`, category_desc);

        res.status(200).json({ message: 'Update successful' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
        console.log(" =====================================================");
        console.log(" Update Data Failed, Data : ");
        if (category_name) console.log(yellowColor, "category_name =", category_name);
        if (category_desc) console.log(` category_desc =`, category_desc);
    }
});


router.get('/lokasi_kategori', async function (req, res, next) {
    let query = 'SELECT * FROM u1109947_Yorozuya.master_lokasi_kategori WHERE 1';

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

router.post('/lokasi_kategori', async function (req, res, next) {
    try {
        const { categoryLokasi_name, categoryLokasi_desc } = req.body;

        // Check if categoryLokasi_name is missing or empty
        if (!categoryLokasi_name) {
            return res.status(400).send('categoryLokasi_name is required');
            console.log('categoryLokasi_name is required')
        }

        const [Postresult] = await db.query(
            `INSERT INTO u1109947_Yorozuya.master_lokasi_kategori (category_name, category_desc) 
            VALUES (?, ?)`,
            [categoryLokasi_name, categoryLokasi_desc]
        );

        if (Postresult.affectedRows === 0) {
            console.log('No record found with the provided ID');
            return res.status(404).send('No record found with the provided ID');
        }

        // Insert the creation event log
        const [logResult] = await db.query(
            `INSERT INTO u1109947_Yorozuya.event_log (Filter, id_inventory, event_date, Deskripsi, id_status) 
             VALUES (?, ?, NOW(), ?, ?)`,
            ['Category Lokasi', Postresult.insertId, `Creation of Lokasi with ID ${Postresult.insertId} and Name ${categoryLokasi_name}`, 1]
        );

        console.log("=====================================================");
        console.log(`Input Kategori Berhasil, Data: `);
        console.log(`Nama Kategori = ${categoryLokasi_name}`);

        res.status(201).json({ id: Postresult.insertId });
    } catch (err) {
        console.error(err.message);
        console.log("=====================================================");
        console.log("Input Data Gagal, Data: ");
        console.log(`Nama Kategori = `);

        res.status(500).send('Server Error');
    }
});

router.delete('/lokasi_kategori', async function (req, res, next) {
    const { category_id, category_name } = req.body;
    console.log("category_id", category_id)

    try {

        if (!category_id) {
            return res.status(400).send('category_id is required');
        }

        const deleteresult = await db.query(`
        DELETE FROM u1109947_Yorozuya.master_lokasi_kategori 
            WHERE category_id = ${category_id}
        `);


        if (deleteresult.affectedRows === 0) {
            return res.status(404).send('No record found with the provided ID');
            consolel.log(redColor, 'No record found with the provided ID');
        }

        // Insert the deletion event log
        const [logResult] = await db.query(
            `INSERT INTO u1109947_Yorozuya.event_log (Filter, id_inventory, event_date, Deskripsi, id_status) 
             VALUES (?, ?, NOW(), ?, ?)`,
            ['Category Lokasi', category_id, `Deletion of Category with ID ${category_id} and Name ${category_name}`, 2]
        );

        if (deleteresult) {
            console.log("=====================================================");
            console.log("Delete Kategori Berhasil, Data : ");
            console.log("ID Kategori = ", category_id);
        }



        res.status(200).json({ id: deleteresult }); // Update the response

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');

        console.log("=====================================================");
        console.log("Delete Data Gagal, Data : ");
        console.log("ID Kategori = ", category_id);
    }
});

router.patch('/lokasi_kategori', async function (req, res, next) {
    try {
        console.log(blueColor, "=====================================================");
        console.log("Accessing PATCH /inven/category/lokasi");

        const { category_name, category_desc, category_id } = req.body;

        // Check if ID is provided
        if (!category_id) {
            return res.status(400).send('ID is required');
        }

        // Check if at least one field to update is provided
        if (!category_name && !category_desc) {
            return res.status(400).send('At least one of category_name or category_desc is required');
        }

        // Build the update query dynamically based on provided fields
        const fields = [];
        const values = [];

        if (category_name !== undefined) {
            fields.push("category_name = ?");
            values.push(category_name);
        }
        if (category_desc !== undefined) {
            fields.push("category_desc = ?");
            values.push(category_desc);
        }
        // Add the ID at the end of the values array for the WHERE clause
        values.push(category_id);

        const [result] = await db.query(
            `UPDATE u1109947_Yorozuya.master_lokasi_kategori SET ${fields.join(", ")} WHERE category_id = ?`,
            values
        );

        if (result.affectedRows === 0) {
            return res.status(404).send('No record found with the provided ID');
        }

        // Insert the update event log
        const [logResult] = await db.query(
            `INSERT INTO u1109947_Yorozuya.event_log (Filter, id_inventory, event_date, Deskripsi, id_status) 
             VALUES (?, ?, NOW(), ?, ?)`,
            ['Category Lokasi', category_id, `Update of Category with ID ${category_id} and Name ${category_name || 'N/A'}`, 3]
        );

        console.log(greenColor, "=====================================================");
        console.log("Update Data Successful, Data:");
        if (category_name) console.log(yellowColor, "category_name =", category_name);
        if (category_desc) console.log(yellowColor, "category_desc =", category_desc);

        res.status(200).json({ message: 'Update successful' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
        console.log("=====================================================");
        console.log("Update Data Failed, Data:");
        if (category_name) console.log(yellowColor, "category_name =", category_name);
        if (category_desc) console.log(yellowColor, "category_desc =", category_desc);
    }
});


// ============================================================


router.get('/lokasi', async function (req, res, next) {
    console.log(blueColor, "=====================================================")
    console.log(" Accessing get./inven/lokasi")

    const searchTerm = req.query.searchTerm; // Extract the search term from the query parameters
    const category = req.query.category; // Extract the category from the query parameters


    let query = `SELECT master_lokasi_kategori.category_name , master_lokasi.*
    FROM u1109947_Yorozuya.master_lokasi_kategori master_lokasi_kategori, u1109947_Yorozuya.master_lokasi master_lokasi
    WHERE 
    master_lokasi_kategori.category_id  = master_lokasi.kategori_lokasi `;

    // If a search term is provided, add a condition to filter the results
    if (searchTerm && searchTerm !== '') {
        query += ` AND nama_produk LIKE '%${searchTerm}%'`; // Assuming you want to search in the `nama_produk` column
    }


    // If a category is provided, add a condition to filter the results
    if (category && category !== 'undefined') { // Check if category is defined and not 'undefined'
        query += ` AND category_name = '${category}'`; // Adjust the column name as per your database schema
    }

    try {
        const [rows, fields] = await
            db.query(query);
        res.json(rows);
        console.log(greenColor, "=====================================================")
        console.log(` Akses Get Lokasi, Query :`)
        console.log(yellowColor, `Search   :`, searchTerm)
        console.log(` Category :`, category)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/lokasi', async function (req, res, next) {
    let connection;

    try {
        console.log(blueColor, "=====================================================");
        console.log("Accessing POST /inven/lokasi");

        const { nama_lokasi, lokasi_desc, alamat_lokasi, kategori_lokasi } = req.body;

        // Check if required fields are provided
        if (!nama_lokasi || !alamat_lokasi || !kategori_lokasi) {
            return res.status(400).send('nama_lokasi, alamat_lokasi, kategori_lokasi are required');
        }

        // Start a transaction
        connection = await db.getConnection();
        await connection.beginTransaction();

        // Insert data into master_data table
        const [masterDataResult] = await connection.query(
            `INSERT INTO u1109947_Yorozuya.master_lokasi (lokasi_name, lokasi_desc, alamat_lokasi, kategori_lokasi) VALUES (?, ?, ?, ?)`,
            [nama_lokasi, lokasi_desc, alamat_lokasi, kategori_lokasi]
        );

        // Insert data into event_log table using the inserted ID from master_data
        const [eventLogResult] = await connection.query(
            `INSERT INTO u1109947_Yorozuya.event_log (Filter, id_inventory, event_date, Deskripsi, id_status) 
             VALUES (?, ?, NOW(), ?, ?)`,
            ['Master Lokasi', masterDataResult.insertId, `Pembuatan Master_data ${nama_lokasi}`, 1]
        );

        // Commit the transaction
        await connection.commit();

        console.log(greenColor, "=====================================================");
        console.log("Input Data Berhasil, Data:");
        console.log(yellowColor, "Nama Lokasi =", nama_lokasi);

        res.status(201).json({ id: masterDataResult.insertId });
    } catch (err) {
        // Rollback the transaction if an error occurs
        if (connection) {
            await connection.rollback();
        }

        console.error(err.message);
        res.status(500).send('Server Error');
        console.log(redColor, "=====================================================");
        console.log("Input Data Gagal, Data:");
        if (nama_lokasi) console.log(yellowColor, "Nama Lokasi =", nama_lokasi);
    } finally {
        // Release the database connection
        if (connection) {
            connection.release();
        }
    }
});

router.patch('/lokasi', async function (req, res, next) {
    try {
        console.log(blueColor, "=====================================================");
        console.log(" Accessing patch./inven/lokasi");

        const { id, nama_lokasi, lokasi_desc, alamat_lokasi, kategori_lokasi } = req.body;

        // Check if id is provided
        if (!id) {
            return res.status(400).send('ID is required');
        }

        // Check if at least one field to update is provided
        if (!nama_lokasi && !lokasi_desc && !alamat_lokasi && !kategori_lokasi) {
            return res.status(400).send('At least one of panjang, diameter, nama_produk, or kategori is required');
        }

        // Build the update query dynamically based on provided fields
        const fields = [];
        const values = [];

        if (nama_lokasi !== undefined) {
            fields.push("lokasi_name = ?");
            values.push(nama_lokasi);
        }
        if (lokasi_desc !== undefined) {
            fields.push("lokasi_desc = ?");
            values.push(lokasi_desc);
        }
        if (alamat_lokasi !== undefined) {
            fields.push("alamat_lokasi = ?");
            values.push(alamat_lokasi);
        }
        if (kategori_lokasi !== undefined) {
            fields.push("kategori_lokasi = ?");
            values.push(kategori_lokasi);
        }

        // Add the ID at the end of the values array for the WHERE clause
        values.push(id);

        const [updateResult] = await db.query(
            `UPDATE u1109947_Yorozuya.master_lokasi SET ${fields.join(", ")} WHERE lokasi_id = ?`,
            values
        );

        if (updateResult.affectedRows === 0) {
            return res.status(404).send('No record found with the provided ID');
        }

        // Insert event log if update is successful
        const [logResult] = await db.query(
            `INSERT INTO u1109947_Yorozuya.event_log (Filter, id_inventory, event_date, Deskripsi, id_status) 
             VALUES (?, ?, NOW(), ?, ?)`,
            ['Data Lokasi', id, `Update Master_lokasi ${nama_lokasi}`, 3]
        );

        console.log(greenColor, "=====================================================");
        console.log(" Update Data Berhasil, Data : ");
        if (nama_lokasi) console.log(yellowColor, "Nama Lokasi =", nama_lokasi);
        res.status(200).json({ message: 'Update and log successful' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
        console.log(greenColor, "=====================================================");
        console.log(" Update Data Berhasil, Data : ");
        if (nama_lokasi) console.log(yellowColor, "Nama Lokasi =", nama_lokasi);
    }
});

router.delete('/lokasi', async function (req, res, next) {
    console.log(blueColor, "=====================================================");
    console.log(" Accessing delete./inven/lokasi");

    const { id_master_data } = req.body;

    try {
        // Check if id_master_data is provided
        if (!id_master_data) {
            console.log(redColor, "ID was not found");
            return res.status(400).send('ID was not found');
        }

        // Delete the record from master_data
        const [deleteResult] = await db.query(
            `DELETE FROM u1109947_Yorozuya.master_lokasi WHERE lokasi_id = ?`,
            [id_master_data]
        );

        // Check if any row was affected (i.e., if the record existed)
        if (deleteResult.affectedRows === 0) {
            return res.status(404).send('No record found with the provided ID');
            consolel.log(redColor, 'No record found with the provided ID');
        }

        // Insert the deletion event log
        const [logResult] = await db.query(
            `INSERT INTO u1109947_Yorozuya.event_log (Filter, id_inventory, event_date, Deskripsi, id_status) 
             VALUES (?, ?, NOW(), ?, ?)`,
            ['Master Lokasi', id_master_data, `Deletion of Master_data with ID ${id_master_data}`, 2]
        );

        console.log(greenColor, "=====================================================");
        console.log(` Delete Data Berhasil, Data : `);
        console.log(yellowColor, `ID Produk = `, id_master_data);

        res.status(200).json({ message: 'Deletion successful', id: id_master_data });
    } catch (err) {
        console.error(err.message);
        console.log("=====================================================");
        console.log(` Delete Data Gagal, Data : `);
        console.log(redColor, `ID Produk = `, id_master_data);
        res.status(500).send('Server Error');
    }
});


router.get('/data', async function (req, res, next) {
    console.log(blueColor, "=====================================================")
    console.log(" Accessing get./inven/data")

    const id = req.query.id; // Extract the search term from the query parameters

    let query = `SELECT 
    mc.category_name,
    md.*,
    ml.lokasi_name
    FROM 
    u1109947_Yorozuya.master_category mc
    JOIN 
    u1109947_Yorozuya.master_data md ON mc.category_id = md.category 
    JOIN 
    u1109947_Yorozuya.master_lokasi ml ON md.lokasi_id = ml.lokasi_id
    WHERE
    md.id_product = '${id}'
    ; `;



    try {
        const [rows, fields] = await
            db.query(query);
        res.json(rows);
        console.log(greenColor, "=====================================================")
        console.log(` Akses Get Data, Query :`)
        console.log(yellowColor, `ID   :`, id)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


router.get('/inven', async function (req, res, next) {
    console.log(blueColor, "=====================================================")
    console.log(" Accessing get./inven/data")

    const id = req.query.id; // Extract the search term from the query parameters

    let query = `
    SELECT 
    m.*,
    latest_date,
    total_count
FROM 
    u1109947_Yorozuya.master_inventory m
JOIN (
    SELECT 
        id_product,
        MAX(update_date) AS latest_date,
        COUNT(*) AS total_count
    FROM 
        u1109947_Yorozuya.master_inventory 
    WHERE
        id_product = '${id}'
    GROUP BY 
        id_product
) AS subquery ON m.id_product = subquery.id_product AND m.update_date = subquery.latest_date
WHERE
    m.id_product = '${id}'
    ; `



    try {
        const [rows, fields] = await
            db.query(query);
        res.json(rows);
        console.log(greenColor, "=====================================================")
        console.log(` Akses Get Inven, Query :`)
        console.log(yellowColor, `ID   :`, id)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/inven', async function (req, res, next) {

    const { panjang_product, diameter_product, mnf_date, active, id_product } = req.body;

    console.log(blueColor, "=====================================================");
    console.log(" Accessing post./inven/inven");
    console.log(panjang_product, diameter_product, mnf_date, active, id_product)

    try {
        // Check if panjang, diameter, nama_produk, and kategori are missing or empty
        if (!id_product) {
            return res.status(400).send('id_product, are required');
        }


        const [Postresult] = await db.query(
            `INSERT INTO u1109947_Yorozuya.master_inventory 
            (panjang_product, diameter_product, mnf_date, update_date, active, id_product) 
            VALUES (?, ?, ?, NOW(), ?, ?)`,
            [panjang_product, diameter_product, mnf_date, active, id_product]
        );

        if (Postresult.affectedRows === 0) {
            return res.status(404).send('No record found with the provided ID');
            consolel.log(redColor, 'No record found with the provided ID');
        }else{
            console.log(greenColor, "=====================================================")
            console.log(` Input Kategori Berhasil, Data : `)
            console.log(yellowColor, `panjang_product = `, panjang_product)
        }

        // Insert the deletion event log
        const [logResult] = await db.query(
            `INSERT INTO u1109947_Yorozuya.event_log (Filter, id_inventory, event_date, Deskripsi, id_status, panjang_sesudah ) 
             VALUES (?, ?, NOW(), ?, ?,?)`,
            ['Inventory ', id_product, `Update of Inventory with ID ${id_product}, new panjang = ${panjang_product}`, 3, panjang_product]
        );

        


        res.status(201).json({ id: Postresult.insertId }); // Update the response
    } catch (err) {
        console.error(err.message);

        res.status(500).send('Server Error');
        console.log(greenColor, "=====================================================")
        console.log(` Input Kategori Berhasil, Data : `)
        console.log(yellowColor, `panjang_product = `, panjang_product)
    }
});

router.post('/inven/deactive', async function (req, res, next) {

    const { panjang_product, diameter_product, mnf_date, active, id_product } = req.body;

    console.log(blueColor, "=====================================================");
    console.log(" Accessing post./inven/deactive");
    console.log(panjang_product, diameter_product, mnf_date, active, id_product)

    try {
        // Check if panjang, diameter, nama_produk, and kategori are missing or empty
        if (!id_product) {
            return res.status(400).send('id_product, are required');
        }


        const [Postresult] = await db.query(
            `INSERT INTO u1109947_Yorozuya.master_inventory 
            (panjang_product, diameter_product, mnf_date, disposal_date, update_date, active, id_product) 
            VALUES (?, ?, ?, NOW(), NOW(), ?, ?)`,
            [panjang_product, diameter_product, mnf_date, active, id_product]
        );

        if (Postresult.affectedRows === 0) {
            return res.status(404).send('No record found with the provided ID');
            consolel.log(redColor, 'No record found with the provided ID');
        }else{
            console.log(greenColor, "=====================================================")
            console.log(` Input Kategori Berhasil, Data : `)
            console.log(yellowColor, `panjang_product = `, panjang_product)
        }

        // Insert the deletion event log
        const [logResult] = await db.query(
            `INSERT INTO u1109947_Yorozuya.event_log (Filter, id_inventory, event_date, Deskripsi, id_status, panjang_sesudah ) 
             VALUES (?, ?, NOW(), ?, ?,?)`,
            ['Inventory ', id_product, `Dispose of Inventory with ID ${id_product}`, 2, panjang_product]
        );

        


        res.status(201).json({ id: Postresult.insertId }); // Update the response
    } catch (err) {
        console.error(err.message);

        res.status(500).send('Server Error');
        console.log(greenColor, "=====================================================")
        console.log(` Input Kategori Berhasil, Data : `)
        console.log(yellowColor, `panjang_product = `, panjang_product)
    }
});


module.exports = router;
