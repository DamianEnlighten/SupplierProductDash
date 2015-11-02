angular.module('App').service('SupplierService',["Supplier", function (Supplier) {
    this.supplier = new Supplier();
    this.getSupplier = function () {
        return this.supplier;
    };

    this.setSupplier = function (supplier) {
        this.supplier = supplier;
    };
}]);
