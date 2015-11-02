; (function () {
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
})();