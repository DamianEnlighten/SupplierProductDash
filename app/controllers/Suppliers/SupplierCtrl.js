; (function () {
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
})();