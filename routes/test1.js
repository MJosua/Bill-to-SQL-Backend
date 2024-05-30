router.post('/lokasi', async function (req, res, next) {
    let connection;

    try {
        console.log(blueColor, "=====================================================");
        console.log(" Accessing post./inven/lokasi");

        const { nama_lokasi, lokasi_desc, alamat_lokasi, kategori_lokasi } = req.body;

        // Check if panjang, diameter, nama_produk, and kategori are missing or empty
        if (!nama_lokasi || !alamat_lokasi || !kategori_lokasi) {
            return res.status(400).send('nama_lokasi, alamat_lokasi, kategori_lokasi are required');
        }

        // Start a transaction
        connection = await db.getConnection();
        await connection.beginTransaction();

        // Insert data into master_data table
        const [masterDataResult] = await connection.query(
            `INSERT INTO inventory.master_lokasi (lokasi_name, 	lokasi_desc, alamat_lokasi, kategori_lokasi) VALUES (?, ?, ?, ?)`,
            [nama_lokasi, lokasi_desc, alamat_lokasi, kategori_lokasi]
        );

        // Insert data into event_log table using the inserted ID from master_data
        const [eventLogResult] = await connection.query(
            `INSERT INTO inventory.event_log (Filter, id_inventory, event_date, Deskripsi, id_status, nama_awal, panjang_awal) 
             VALUES (?, ?, NOW(), 'Pembuatan Master_data ${nama_produk}', 1, ?, ?)`,
            [`Master Lokasi`, masterDataResult.insertId, nama_lokasi, alamat_lokasi]
        );

        // Commit the transaction
        await connection.commit();

        console.log(greenColor, "=====================================================");
        console.log(` Input Data Berhasil, Data : `);
        console.log(yellowColor, `Nama Produk = `, nama_lokasi);


        res.status(201).json({ id: masterDataResult.insertId }); // Update the response
    } catch (err) {
        // Rollback the transaction if an error occurs
        if (connection) {
            await connection.rollback();
        }

        console.error(err.message);
        res.status(500).send('Server Error');
        console.log(greenColor, "=====================================================");
        console.log(` Input Data Berhasil, Data : `);
        console.log(yellowColor, `Nama Produk = `, nama_lokasi);

    } finally {
        // Release the database connection
        if (connection) {
            connection.release();
        }
    }
});