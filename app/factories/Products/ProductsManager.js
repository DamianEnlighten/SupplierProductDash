; (function () {
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
})();