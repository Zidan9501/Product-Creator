const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const port = 3000;

const db = new sqlite3.Database("company.db", (err) => {
    if (err) {
        console.error(err);
    } else {
        console.log("Connection established successfully.");
    }
});

db.run(
    `CREATE TABLE IF NOT EXISTS products(
        ProductID INTEGER PRIMARY KEY AUTOINCREMENT,
        ProductName TEXT,
        SupplierID INTEGER,
        CategoryID INTEGER,
        Unit TEXT,
        Price FLOAT
    )`,
    (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log("Table created successfully.");
        }
    }
);

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.get("/", (req, res) => {
    db.all("SELECT * FROM products", (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        } else {
            res.json(rows);
        }
    });
});

app.post("/", (req, res) => {
    const { ProductName, SupplierID, CategoryID, Unit, Price } = req.body;
    db.run(
        `INSERT INTO products (ProductName, SupplierID, CategoryID, Unit, Price)
        VALUES (?, ?, ?, ?, ?)`,
        [ProductName, SupplierID, CategoryID, Unit, Price],
        (err) => {
            if (err) {
                console.error(err);
                res.status(500).send("Internal Server Error");
            } else {
                res.status(201).send("Data created successfully.");
                console.log("Data created successfully");
            }
        }
    );
});

app.delete("/:ProductID", (req, res) => {
    const ProductID = req.params.ProductID;
    db.run(`DELETE FROM products WHERE ProductID = ?`, [ProductID], (err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        } else {
            res.send("Data deleted successfully.");
            console.log("Data deleted successfully");
        }
    });
});

app.put("/:ProductID", (req, res) => {
    const { ProductName, SupplierID, CategoryID, Unit, Price } = req.body;
    const ProductID = req.params.ProductID;
    db.run(
        `UPDATE products
        SET ProductName = ?, SupplierID = ?, CategoryID = ?, Unit = ?, Price = ?
        WHERE ProductID = ?`,
        [ProductName, SupplierID, CategoryID, Unit, Price, ProductID],
        (err) => {
            if (err) {
                console.error(err);
                res.status(500).send("Internal Server Error");
            } else {
                res.send("Data modified successfully.");
            }
        }
    );
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
