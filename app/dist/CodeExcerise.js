'use strict';
; (function () {
    angular.module('App', [
        'ui.router',
        'ngTable',
        'ngAnimate',
        'ngMessages',
        'ngMaterial',
        'oitozero.ngSweetAlert',
        'toastr'
    ])
    .run([function () {
    }])
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$mdThemingProvider',
        function ($stateProvider, $urlRouterProvider, $locationProvider, $mdThemingProvider) {

            $mdThemingProvider.theme('default')

            $urlRouterProvider.rule(function ($injector, $location) {
                var path = $location.path(), normalized = path.toLowerCase();
                if (path != normalized) {
                    $location.replace().path(normalized);
                }
            });

            $locationProvider.html5Mode(true).hashPrefix('!');
            $urlRouterProvider.otherwise('/');

            return $stateProvider
                //default view
                .state('home', {
                    url: "/",
                    templateUrl: "partials/Dash/dashboard.html",
                    controller: "DashCtrl"
                })
                //supplier views
                .state('createSupplier', {
                    url: "/supplier/create",
                    templateUrl: "partials/Suppliers/Suppliers.html",
                    controller: "SupplierCtrl"
                })
                .state('editSupplier', {
                    url: "/supplier/edit/:id",
                    templateUrl: "partials/Suppliers/Suppliers.html",
                    controller: "SupplierCtrl"
                })
                //product views
                .state('createProduct', {
                    url: "/product/create",
                    templateUrl: "partials/Products/Products.html",
                    controller: "ProductCtrl"
                })
                .state('editProduct', {
                    url: "/product/edit/:id",
                    templateUrl: "partials/Products/Products.html",
                    controller: "ProductCtrl"
                })
        }]);

})();;; (function () {
    angular.module('App').controller('DashCtrl',
    ['$scope', '$state', 'ngTableParams','suppliersManager','productsManager','SweetAlert','toastr','$filter',
    function ($scope, $state, ngTableParams, suppliersManager, productsManager, SweetAlert,toastr,$filter) {
        $scope.loading = false;
        $scope.showProducts = false;
        $scope.sSearch = "";
        $scope.pSearch = "";
        $scope.supplier = null;
        $scope.suppliers = [];
        $scope.products = [];
        $scope.filterProducts = [];
        //supplier table
        $scope.supplierTable = new ngTableParams({
            page: 1,            // show first page
            count: 5,          // count per page
            sorting: {
                SupplierID: 'asc'
            }
        }, {
            counts: [],
            total: $scope.suppliers.length, // length of data
            getData: function ($defer, params) {
                var orderedData = params.filter() ? $filter('filter')($scope.suppliers, params.filter()) : $scope.suppliers;
                orderedData = params.sorting() ? $filter('orderBy')(orderedData, params.orderBy()) : orderedData;
                var filteredSuppliers = orderedData.splice((params.page() - 1) * params.count(), params.count());
                $defer.resolve(filteredSuppliers);
            }
        });
        //product table
        $scope.productTable = new ngTableParams({
            page: 1,            // show first page
            count: 5,          // count per page
            sorting: {
                ProductID: 'asc'
            }
        }, {
            counts: [],
            total: $scope.filterProducts.length, // length of data
            getData: function ($defer, params) {
                var orderedData = params.filter() ? $filter('filter')($scope.filterProducts, params.filter()) : $scope.filterProducts;
                orderedData = params.sorting() ? $filter('orderBy')(orderedData, params.orderBy()) : orderedData;
                var filteredProducts = orderedData.splice((params.page() - 1) * params.count(),  params.count());
                $defer.resolve(filteredProducts);
            }
        });
        //load suppliers
        $scope.loadSuppliers = function () {
            $scope.loading = true;
            suppliersManager.loadAllSuppliers().then(function (suppliers) {
                if (suppliers && suppliers != 500) {
                    $scope.suppliers = suppliers;
                    //update table
                    $scope.supplierTable.total($scope.suppliers.length);
                    $scope.supplierTable.reload();
                    $scope.supplierTable.page(1);
                }
                else {
                    toastr.info("Could Not Load Suppliers");
                }
                $scope.loading = false;
            }, function () {
                toastr.info("Error Occurred Loading Suppliers");
                $scope.loading = false;
            })

        }
        //load products
        $scope.loadProducts = function () {
            productsManager.loadAllProducts().then(function (products) {
                if (products && products != 500) {
                    $scope.products = products;
                    $scope.filterProducts = products;
                    //update table
                    $scope.productTable.total($scope.products.length);
                    $scope.productTable.reload();
                    $scope.productTable.page(1);
                }
                else {
                    toastr.info("Could Not Load Products");
                }
            }, function () {
                toastr.info("Error Occurred Loading Products");
            })
        }
        //delete supplier
        $scope.deleteSupplier = function (supplier) {
            SweetAlert.swal({
                title: 'Really Delete ' + supplier.CompanyName + '?',
                text: 'All associated products and order details will also be deleted',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
            },
            function (isConfirm) {
                if (isConfirm) {
                    supplier.delete().then(function (response) {
                        if (response) {
                            toastr.success('Supplier Deleted');
                            //update table
                            var index = $scope.suppliers.indexOf(supplier);
                            $scope.suppliers.splice(index, 1);
                            $scope.supplierTable.total($scope.suppliers.length);
                            $scope.supplierTable.reload();
                        }
                        else {
                            toastr.info('Could Not Delete Supplier');
                        }

                    }, function () {
                        toastr.error('Error Occurred Deleting Supplier');
                    });
                }
            });
        }
        //delete product
        $scope.deleteProduct = function (product) {
            SweetAlert.swal({
                title: 'Really Delete ' + product.ProductName + '?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
            },
            function (isConfirm) {
                if (isConfirm) {
                    product.delete().then(function (response) {
                        if (response) {
                            toastr.success('Product Deleted');
                            //update table
                            var index = $scope.products.indexOf(product);
                            $scope.products.splice(index, 1);
                            var subTable = $scope.filterProducts.indexOf(product);
                            $scope.filterProducts.splice(subTable, 1);
                            $scope.productTable.total($scope.filterProducts.length);
                            $scope.productTable.reload();
                        }
                        else {
                            toastr.info('Could Not Delete Product');
                        }

                    }, function () {
                        toastr.error('Error Occurred Deleting Product');
                    });
                }
            });
        }
        $scope.editSupplier = function (supplier) {           
            $state.go("editSupplier", {id:supplier.SupplierID})
        }
        $scope.editProduct = function (product) {
            $state.go("editProduct", { id: product.ProductID })
        }
        $scope.showSupplierProducts = function (supplier) {           
            var products = $scope.products;
            $scope.supplier = supplier;
            $scope.showProducts = true;
            $scope.filterProducts = [];
            for (var i=0; i< products.length;i++)
            {
                if (products[i].SupplierID == supplier.SupplierID)
                {
                    $scope.filterProducts.push(products[i]);
                }
            }
            $scope.productTable.total($scope.filterProducts.length);
            $scope.productTable.reload();
        }
        $scope.show = function () {
            $scope.showProducts = true;
            $scope.supplier = null;
            $scope.filterProducts = $scope.products;
            $scope.productTable.total($scope.filterProducts.length);
            $scope.productTable.reload();
        }
        $scope.back = function () {
            $scope.showProducts = false;
        }
        $scope.createSupplier = function () {
            $state.go("createSupplier");
        }
        $scope.createProduct = function () {
            $state.go("createProduct");
        }
        $scope.loadSuppliers();
        $scope.loadProducts();
    }]);
})();;; (function () {
    angular.module('App').controller('ProductCtrl',
    ['$scope', '$state', 'productsManager', 'Product', 'suppliersManager', 'ProductService', 'SweetAlert', 'toastr',
    function ($scope, $state, productsManager, Product, suppliersManager, ProductService, SweetAlert, toastr) {
        $scope.product = new Product();
        $scope.suppliers = [];
        //load product if id
        //load suppliers for creating/editing for drop down list
        $scope.load = function () {
            suppliersManager.loadAllSuppliers().then(function (suppliers) {
                if (suppliers && !suppliers.error) {
                    $scope.suppliers = suppliers;
                }
                else {
                    toastr.info("Could Not Load Suppliers");
                }

                var product = ProductService.getProduct();
                //check if service
                if (product && product.ProductID > 0) {
                    $scope.product = product;
                }
                else {
                    //load supplier by SupplierID
                    var id = $state.params.id;
                    if (id) {
                        productsManager.getProduct(id).then(function (product) {
                            if (product && !product.error) {
                                $scope.product = product;
                            }
                            else {
                                toastr.info("Product Does Not Exist");
                                $state.go('home');
                            }
                        }, function () {
                            toastr.info("Error Occurred Loading Product");
                        })
                    }
                }

            }, function () {
                toastr.info("Error Occurred Loading Suppliers");
            })
        }

        //create product
        $scope.create = function () {
            //validate
            if ($scope.validateProduct()) {
                $scope.product.create().then(function (product) {
                    console.log(product);
                    if (product && !product.error) {
                        toastr.success("Product Created");
                        $scope.product = new Product(product[0]);
                        $state.go("editProduct", { id: product[0].ProductID })
                    }
                    else {
                        toastr.info("Could Not Create Product");
                    }
                }, function () {
                    toastr.error("Error Occurred Creating Product");
                })
            }
        }
        //edit product
        $scope.edit = function () {
            //validate
            if ($scope.validateProduct()) {
                $scope.product.edit().then(function (product) {
                    if (product && !product.error) {
                        toastr.success("Product Updated");
                        $state.go("home");
                    }
                    else {
                        toastr.info("Could Not Update Product");
                    }
                }, function () {
                    toastr.error("Error Occurred Updating Product");
                })
            }
        }
        //delete product
        $scope.delete = function () {
            SweetAlert.swal({
                title: 'Really Delete ' + $scope.product.ProductName + '?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
            },
            function (isConfirm) {
                if (isConfirm) {
                    $scope.product.delete().then(function (response) {
                        if (response && !response.error) {
                            toastr.success('Product Deleted');
                            $state.go('home');
                        }
                        else {
                            toastr.info('Could Not Delete Product');
                        }

                    }, function () {
                        toastr.error('Error Occurred Deleting Product');
                    });
                }
            });
        }
        $scope.cancel = function () {
            $state.go("home")
        }
        $scope.validateProduct = function () {
            var product = $scope.product;
            if (!product.SupplierID) {
                $scope.ProductForm.SupplierID.$error = { required: true }
                return false;
            }
            else if (!product.ProductName) {
                $scope.ProductForm.ProductName.$error = { required: true }
                return false;
            }
            else if (product.ProductName.length > 40) {
                $scope.ProductForm.ProductName.$error = { required: true }
                return false;
            }
            return true;
        }
        $scope.load();
    }]);
})();;; (function () {
    angular.module('App').controller('SupplierCtrl',
    ['$scope', '$state', 'suppliersManager', 'Supplier', 'SupplierService', 'SweetAlert', 'toastr',
    function ($scope, $state, suppliersManager, Supplier, SupplierService, SweetAlert, toastr) {
        $scope.supplier = new Supplier();
        //load supplier if SupplierID
        $scope.load = function () {
            var supplier = SupplierService.getSupplier();
            //check if service
            if (supplier && supplier.SupplierID > 0) {
                $scope.supplier = supplier;
            }
            else {
                //load supplier by SupplierID
                var id = $state.params.id;
                if (id) {
                    suppliersManager.getSupplier(id).then(function (supplier) {
                        if (supplier && !supplier.error) {
                            $scope.supplier = supplier;
                        }
                        else {
                            toastr.info("Supplier Does Not Exist");
                            $state.go('home');
                        }
                    }, function () {
                        toastr.info("Error Occurred Loading Supplier");
                    })
                }
            }
        }
        //create supplier
        $scope.create = function () {
            //validate
            if ($scope.validateSupplier()) {
                $scope.supplier.create().then(function (supplier) {
                    if (supplier && !supplier.error) {
                        toastr.success("Supplier Created");
                        $scope.supplier = new Supplier(supplier[0]);
                        $state.go("editSupplier", { id: supplier[0].SupplierID })
                    }
                    else {
                        toastr.info("Could Not Create Supplier");
                    }
                }, function () {
                    toastr.error("Error Occurred Creating Supplier");
                })
            }
        }
        //edit supplier
        $scope.edit = function () {
            //validate
            if ($scope.validateSupplier()) {
                $scope.supplier.edit().then(function (supplier) {
                    if (supplier && !supplier.error) {
                        toastr.success("Supplier Updated");
                        $state.go("home");
                    }
                    else {
                        toastr.info("Could Not Update Supplier");
                    }
                }, function () {
                    toastr.error("Error Occurred Updating Supplier");
                })
            }
        }
        //delete supplier
        $scope.delete = function () {
            SweetAlert.swal({
                title: 'Really Delete ' + $scope.supplier.CompanyName + '?',
                text: 'All associated products and order details will also be deleted',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
            },
            function (isConfirm) {
                if (isConfirm) {
                    $scope.supplier.delete().then(function (response) {
                        if (response && !response.error) {
                            toastr.success('Supplier Deleted');
                            $state.go('home');
                        }
                        else {
                            toastr.info('Could Not Delete Supplier');
                        }

                    }, function () {
                        toastr.error('Error Occurred Deleting Supplier');
                    });
                }
            });
        }
        $scope.cancel = function () {
            $state.go("home")
        }
        $scope.validateSupplier = function () {
            var name = $scope.supplier.CompanyName;
            //not empty, smaller than 40 chars
            if (!name) {
                return false;
            }
            else if (name.length > 40) {
                return false;
            }
            return true;
        }
        $scope.load();
    }]);
})();;; (function () {
    angular.module('App').factory('Product', ['$http', '$rootScope', '$q',
    function ($http, $rootScope, $q) {
        function Product(productData) {
            if (productData) {
                this.setData(productData);
            }
        };
        Product.prototype = {
            ProductName: "",
            ProductID: 0,
            SupplierID: 0,
            setData: function (productData) {
                angular.extend(this, productData);
            },
            create: function () {
                var deferred = $q.defer();
                $http.post("/api/products/", this).success(function (response, status, headers, config) {
                    deferred.resolve(response);
                }).error(function (data, status, headers, config) {
                    console.log(data, status, headers, config);
                    deferred.reject();
                })
                return deferred.promise;
            },
            edit: function () {
                var deferred = $q.defer();
                $http.put("/api/products/" + this.ProductID, this).success(function (response, status, headers, config) {
                    deferred.resolve(response);
                }).error(function (data, status, headers, config) {
                    console.log(data, status, headers, config);
                    deferred.reject();
                })
                return deferred.promise;
            },
            delete: function () {
                var deferred = $q.defer();
                $http.delete("/api/products/" + this.ProductID).success(function (response, status, headers, config) {
                    deferred.resolve(response);
                }).error(function (data, status, headers, config) {
                    deferred.reject();
                })
                return deferred.promise;
            }
        };
        return Product;
    }]);
})();;; (function () {
    angular.module('App').factory('productsManager', ['$http', '$q', 'Product', '$rootScope',
    function ($http, $q, Product, $rootScope) {
        var productsManager = {
            _pool: {},
            _retrieveInstance: function (productId, productData) {
                var instance = this._pool[productId];

                if (instance) {
                    instance.setData(productData);
                } else {
                    instance = new Product(productData);
                    this._pool[productId] = instance;
                }

                return instance;
            },
            _search: function (productId) {
                return this._pool[productId];
            },
            _load: function (productId, deferred) {
                var scope = this;

                $http.get("api/products/" + productId)
                    .success(function (productData) {
                        if (productData.length) {
                            var product = scope._retrieveInstance(productData[0].ProductID, productData[0]);
                            deferred.resolve(product);
                        }
                        else {
                            deferred.resolve(null);
                        }
                    })
                    .error(function () {
                        deferred.reject();
                    });
            },

            /* Public Methods */
            /* Use this function in order to get a product instance by it's id */
            getProduct: function (productId) {
                var deferred = $q.defer();
                var product = this._search(productId);
                if (product) {
                    deferred.resolve(product);
                } else {
                    this._load(productId, deferred);
                }
                return deferred.promise;
            },
            /* Use this function in order to get instances of all the products */
            loadAllProducts: function () {
                var deferred = $q.defer();
                var scope = this;

                $http.get("api/products/")
                    .success(function (productsArray) {
                        var products = [];
                        productsArray.forEach(function (productData, status, headers, config) {
                            var product = scope._retrieveInstance(productData.ProductID, productData);
                            products.push(product);
                        })
                        deferred.resolve(products);
                    })
                    .error(function (data, status, headers, config) {
                        console.log(data, status, headers, config);
                        deferred.reject();
                    });
                return deferred.promise;
            },
            /*  This function is useful when we got somehow the product data and we wish to store it or update the pool and get a product instance in return */
            setProduct: function (productData) {
                var scope = this;
                var product = this._search(productData.ProductID);
                if (product) {
                    product.setData(productData);
                } else {
                    product = scope._retrieveInstance(productData);
                }
                return product;
            }
        };
        return productsManager;
    }]);
})();;; (function () {
    angular.module('App').factory('Supplier', ['$http', '$rootScope', '$q',
    function ($http, $rootScope, $q) {
        function Supplier(supplierData) {
            if (supplierData) {
                this.setData(supplierData);
            }
        };
        Supplier.prototype = {
            CompanyName: "",
            SupplierID: 0,
            setData: function (supplierData) {
                angular.extend(this, supplierData);
            },
            create: function () {
                var deferred = $q.defer();
                $http.post("api/suppliers/", this).success(function (response, status, headers, config) {
                    deferred.resolve(response);
                }).error(function (data, status, headers, config) {
                    console.log(data, status, headers, config);
                    deferred.reject();
                })
                return deferred.promise;
            },
            edit: function () {
                var deferred = $q.defer();
                $http.put("api/suppliers/" + this.SupplierID, this).success(function (response, status, headers, config) {
                    deferred.resolve(response);
                }).error(function (data, status, headers, config) {
                    console.log(data, status, headers, config);
                    deferred.reject();
                })
                return deferred.promise;
            },
            delete: function () {
                var deferred = $q.defer();
                $http.delete("api/suppliers/" + this.SupplierID).success(function (response, status, headers, config) {
                    deferred.resolve(response);
                }).error(function (data, status, headers, config) {
                    deferred.reject();
                })
                return deferred.promise;
            }
        };
        return Supplier;
    }]);
})();;; (function () {
    angular.module('App').factory('suppliersManager', ['$http', '$q', 'Supplier', '$rootScope',
    function ($http, $q, Supplier, $rootScope) {
        var suppliersManager = {
            _pool: {},
            _retrieveInstance: function (supplierId, supplierData) {
                var instance = this._pool[supplierId];

                if (instance) {
                    instance.setData(supplierData);
                } else {
                    instance = new Supplier(supplierData);
                    this._pool[supplierId] = instance;
                }

                return instance;
            },
            _search: function (supplierId) {
                return this._pool[supplierId];
            },
            _load: function (supplierId, deferred) {
                var scope = this;
                $http.get("api/suppliers/" + supplierId)
                    .success(function (supplierData) {
                        if (supplierData.length) {
                            var supplier = scope._retrieveInstance(supplierData[0].SupplierID, supplierData[0]);
                            deferred.resolve(supplier);
                        }
                        else
                        {
                            deferred.resolve(null);
                        }
                    })
                    .error(function () {
                        deferred.reject();
                    });
            },

            /* Public Methods */
            /* Use this function in order to get a supplier instance by it's id */
            getSupplier: function (supplierId) {
                var deferred = $q.defer();
                var supplier = this._search(supplierId);
                if (supplier) {
                    deferred.resolve(supplier);
                } else {
                    this._load(supplierId, deferred);
                }
                return deferred.promise;
            },
            /* Use this function in order to get instances of all the suppliers */
            loadAllSuppliers: function () {
                var deferred = $q.defer();
                var scope = this;

                $http.get("api/suppliers/")
                    .success(function (suppliersArray) {
                        var suppliers = [];
                        suppliersArray.forEach(function (supplierData, status, headers, config) {
                            var supplier = scope._retrieveInstance(supplierData.SupplierID, supplierData);
                            suppliers.push(supplier);
                        })
                        deferred.resolve(suppliers);
                    })
                    .error(function (data, status, headers, config) {
                        console.log(data, status, headers, config);
                        deferred.reject();
                    });
                return deferred.promise;
            },
            /*  This function is useful when we got somehow the supplier data and we wish to store it or update the pool and get a supplier instance in return */
            setSupplier: function (supplierData) {
                var scope = this;
                var supplier = this._search(supplierData.SupplierID);
                if (supplier) {
                    supplier.setData(supplierData);
                } else {
                    supplier = scope._retrieveInstance(supplierData);
                }
                return supplier;
            }
        };
        return suppliersManager;
    }]);
})();;angular.module('App').service('ProductService',["Product", function (Product) {
    this.product = new Product();
    this.getProduct = function () {
        return this.product;
    };

    this.setProduct = function (product) {
        this.product = product;
    };
}]);
;angular.module('App').service('SupplierService',["Supplier", function (Supplier) {
    this.supplier = new Supplier();
    this.getSupplier = function () {
        return this.supplier;
    };

    this.setSupplier = function (supplier) {
        this.supplier = supplier;
    };
}]);
