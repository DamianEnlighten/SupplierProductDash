var express = require('express');
var router = express.Router();
var path = require('path');
var port = 16744 || process.env.PORT;
var sqlString = require('sql');
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

//SQL

var SQLConfig = {
    userName: 'user',
    password: 'password',
    server: '127.0.0.1',
    database: 'NORTHWND',
    options: {
        instanceName: 'SQLEXPRESS'
    }
};
//Make connection to DB
function connectSQL() {
    sqlString.setDialect('mssql');
    var connection = new Connection(SQLConfig);
    return connection;
}

//sends request and handles response from mssql
function querySQL(connection, query, res) {
    var rows = [];
    connection.on('connect', function (err) {
        if (err) {
            res.status(500).send({ error: "Server Error On SQL Connection" });
        }
        request = new Request(query.text, function (err, rowCount, rowsComp) {
            if (err) {
                console.log(err);
                res.status(500).send({ error: "Server Error On SQL Request" });
            } else {
                if (!query.continue)
                    res.send(rows);
                else if (query.next)
                    query.next();
            }
        });
        request.on('row', function (row) {
            var obj = {};
            for (var i = 0; i < row.length; i++) {
                obj[row[i].metadata.colName] = row[i].value;
            }
            rows.push(obj);
        });
        request.on('error', function (err) {
            console.log(err);
            res.status(500).send({ error: "Server Error On Request" });
            return;
        });
        if (query.values) {
            for (var i = 0; i < query.values.length; i++) {
                if (isInt(query.values[i])) {
                    request.addParameter(i + 1, TYPES.Int, query.values[i]);
                }
                else {
                    request.addParameter(i + 1, TYPES.VarChar, query.values[i]);
                }
            }
        }
        connection.execSql(request);
    });
}

function isInt(n) {
    return Number(n) === n && n % 1 === 0;
}

//SQL models
var base = "NORTHWND].[dbo].[";
var product = sqlString.define({
    name: base + 'Products',
    columns: ['ProductID', 'ProductName', 'SupplierID']
});

var supplier = sqlString.define({
    name: base + 'Suppliers',
    columns: ['SupplierID', 'CompanyName']
});

//Routes

//get suppliers
router.get('/api/suppliers/', function (req, res, next) {
    var con = connectSQL();

    var query = supplier
        .select(supplier.SupplierID, supplier.CompanyName)
        .from(supplier).toQuery();

    querySQL(con, query, res);
});
router.get('/api/suppliers/:id', function (req, res, next) {
    var con = connectSQL();
    var query = supplier
        .select(supplier.SupplierID, supplier.CompanyName)
        .from(supplier)
        .where(supplier.SupplierID.equals(req.params.id))
        .toQuery();

    querySQL(con, query, res);
});
//create supplier
router.post('/api/suppliers/', function (req, res, next) {
    if (!req.body.CompanyName)
    {
        res.status(400).send({ error: "No CompanyName" });
        return;
    }
    var con = connectSQL();
    var query = supplier
        .insert(supplier.CompanyName.value(req.body.CompanyName))
        .select(supplier.SupplierID, supplier.CompanyName)
        .from(supplier)
        .order(supplier.SupplierID.desc)
        .limit(1)
        .toQuery();
    querySQL(con, query, res);
});
//update supplier
router.put('/api/suppliers/:id', function (req, res, next) {
    if (!req.body.CompanyName) {
        res.status(400).send({ error: "No CompanyName" });
        return;
    }
    var con = connectSQL();
    var query = supplier
        .update({
            CompanyName: req.body.CompanyName
        })
        .where(supplier.SupplierID.equals(req.body.SupplierID))
        .toQuery();
    querySQL(con, query, res);
});
//delete supplier ALSO delete all products
router.delete('/api/suppliers/:id', function (req, res, next) {
    
    //delete Supplier
    var con = connectSQL();
    con = connectSQL();
    query = supplier
        .delete()
        .where(supplier.SupplierID.equals(req.params.id))
        .toQuery();
    query.continue = false;
    querySQL(con, query, res);
   
});

//get products
router.get('/api/products/', function (req, res, next) {
    var con = connectSQL();

    var query = product
        .select(product.ProductID, product.ProductName, product.SupplierID)
        .from(product).toQuery();

    querySQL(con, query, res);
});
router.get('/api/products/:id', function (req, res, next) {
    var con = connectSQL();

    var query = product
        .select(product.ProductID, product.ProductName, product.SupplierID)
        .from(product)
        .where(product.ProductID.equals(req.params.id))
        .toQuery();

    querySQL(con, query, res);
});
//create products and add to supplier
router.post('/api/products/', function (req, res, next) {
    if (!req.body.SupplierID) {
        res.status(400).send({ error: "No CompanyName" });
        return;
    }
    else if (!req.body.ProductName) {
        res.status(400).send({ error: "No ProductName" });
        return;
    }
    var con = connectSQL();
    var query = product
        .insert(product.ProductName.value(req.body.ProductName), product.SupplierID.value(req.body.SupplierID))
        .select(product.ProductID, product.ProductName, product.SupplierID)
        .from(product)
        .order(product.ProductID.desc)
        .limit(1)
        .toQuery();
    querySQL(con, query, res);
});
//update products/change supplier
router.put('/api/products/:id', function (req, res, next) {
    if (!req.body.SupplierID) {
        res.status(400).send({ error: "No CompanyName" });
        return;
    }
    else if (!req.body.ProductName) {
        res.status(400).send({ error: "No ProductName" });
        return;
    }
    var con = connectSQL();
    var query = product
        .update({
            ProductName: req.body.ProductName,
            SupplierID: req.body.SupplierID
        })
        .where(product.ProductID.equals(req.params.id))
        .toQuery();
    querySQL(con, query, res);
});
//delete products
router.delete('/api/products/:id', function (req, res, next) {
    var con = connectSQL();
    var query = product
        .delete()
        .where(product.ProductID.equals(req.params.id))
        .toQuery();
    querySQL(con, query, res);
});

//Load unit Test page
router.get('/test', function (req, res, next) {
    res.render('test');
});
//Load angular page
router.get('*', function (req, res, next) {
    res.render('index');
});
module.exports = router;
