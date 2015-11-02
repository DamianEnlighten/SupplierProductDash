; (function () {
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
})();