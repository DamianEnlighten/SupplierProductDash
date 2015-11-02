angular.module('App').service('ProductService',["Product", function (Product) {
    this.product = new Product();
    this.getProduct = function () {
        return this.product;
    };

    this.setProduct = function (product) {
        this.product = product;
    };
}]);
