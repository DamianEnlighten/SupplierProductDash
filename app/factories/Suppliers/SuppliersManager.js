; (function () {
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
})();