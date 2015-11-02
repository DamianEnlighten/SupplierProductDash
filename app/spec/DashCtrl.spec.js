; (function () {
    describe('CodeExercise Tests', function () {

        it('Sanity Check', function () {
            expect(true).toBeTruthy();
        });
    });
    describe('Module: CodeExercise', function () {
        var $controller, $rootScope
        beforeEach(function () {
            module('App');
            inject(function ($injector) {
                $rootScope = $injector.get('$rootScope');
                $controller = $injector.get('$controller');
            });
        });

        describe('Controller: DashCtrl', function () {

            var scope, controller;
            beforeEach(inject(function ($controller, $rootScope) {
                scope = $rootScope.$new();
                controller = $controller('DashCtrl', { $scope: scope });
                spyOn(scope, "loadSuppliers");
                spyOn(scope, "loadProducts");
                spyOn(scope, "deleteSupplier");
                spyOn(scope, "deleteProduct");
            }));

            it('Loads Suppliers', function () {
                scope.loadSuppliers();
                expect(scope.loadSuppliers).toHaveBeenCalled();
            });
            it('Loads Products', function () {
                scope.loadProducts();
                expect(scope.loadProducts).toHaveBeenCalled();
            });
            it('Deletes a Supplier', function () {
                scope.deleteSupplier();
                expect(scope.deleteSupplier).toHaveBeenCalled();
            });
            it('Deletes a Product', function () {
                scope.deleteProduct();
                expect(scope.deleteProduct).toHaveBeenCalled();
            });
            it('Filters Products by Supplier', function () {
                var supplier = {
                    SupplierID: 1
                }
                scope.products = [
                    { SupplierID: 1 },
                    { SupplierID: 2 },
                    { SupplierID: 1 }
                ]
                scope.showSupplierProducts(supplier);
                expect(scope.filterProducts.length).toEqual(2);
            });
        });


    });
})();