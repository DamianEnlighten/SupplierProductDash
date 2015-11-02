; (function () {
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
})();