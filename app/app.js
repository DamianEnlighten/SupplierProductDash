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

})();