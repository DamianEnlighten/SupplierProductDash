; (function () {
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
})();