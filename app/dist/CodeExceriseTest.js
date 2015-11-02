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
})();;; (function () {
    describe('Module: CodeExercise', function () {
        var $controller, $rootScope
        beforeEach(function () {
            module('App');
            inject(function ($injector) {
                $rootScope = $injector.get('$rootScope');
                $controller = $injector.get('$controller');
            });
        });

        describe('Controller: ProductCtrl', function () {

            var scope, controller;
            beforeEach(inject(function ($controller, $rootScope) {
                scope = $rootScope.$new();
                controller = $controller('ProductCtrl', { $scope: scope });

                scope.ProductForm = {
                    SupplierID: { $error: false },
                    ProductName: { $error: false }
                };
                spyOn(scope, "load");
                spyOn(scope, "create");
                spyOn(scope, "edit");
                spyOn(scope, "delete");
            }));

            it('Loads all Suppliers and loads a Product', function () {
                scope.load();
                expect(scope.load).toHaveBeenCalled();
            });
            it('Creates a Product', function () {
                scope.create();
                expect(scope.create).toHaveBeenCalled();
            });
            it('Edits a Product', function () {
                scope.edit();
                expect(scope.edit).toHaveBeenCalled();
            });
            it('Deletes a Product', function () {
                scope.delete();
                expect(scope.delete).toHaveBeenCalled();
            });
            //Validate
            it('Validates a Product', function () {
                var valid = false;

                //Not Valid
                scope.ProductForm.SupplierID.$error = null;
                scope.ProductForm.ProductName.$error = null;
                scope.product = {
                    ProductName: "",
                    SupplierID: 0
                };
                valid = scope.validateProduct();
                expect(valid).toBeFalsy();
                expect(scope.ProductForm.SupplierID.$error).toBeTruthy();

                //Not Valid
                scope.ProductForm.SupplierID.$error = null;
                scope.ProductForm.ProductName.$error = null;
                scope.product = {
                    ProductName: "IAMAREALLLYLONGNAMEOVER40CHARSBECAUSEHWYNOTTRYITRIGHT?",
                    SupplierID: 5
                };
                valid = scope.validateProduct();
                expect(valid).toBeFalsy();
                expect(scope.ProductForm.ProductName.$error).toBeTruthy();

                //Not Valid
                scope.ProductForm.SupplierID.$error = null;
                scope.ProductForm.ProductName.$error = null;
                scope.product = {
                    ProductName: "Nope",
                    SupplierID: 0
                };
                valid = scope.validateProduct();
                expect(valid).toBeFalsy();
                expect(scope.ProductForm.SupplierID.$error).toBeTruthy();

                //Not Valid
                scope.ProductForm.SupplierID.$error = null;
                scope.ProductForm.ProductName.$error = null;
                scope.product = {
                    ProductName: "",
                    SupplierID: 5
                };
                valid = scope.validateProduct();
                expect(valid).toBeFalsy();
                expect(scope.ProductForm.ProductName.$error).toBeTruthy();

                //Valid
                scope.ProductForm.SupplierID.$error = null;
                scope.ProductForm.ProductName.$error = null;
                scope.product = {
                    ProductName: "Yup",
                    SupplierID: 5
                };
                valid = scope.validateProduct();
                expect(valid).toBeTruthy();
                expect(scope.ProductForm.SupplierID.$error).toBeFalsy();
                expect(scope.ProductForm.ProductName.$error).toBeFalsy();
            });
        });
    });
})();;; (function () {
    describe('Module: CodeExercise', function () {
        var $controller, $rootScope
        beforeEach(function () {
            module('App');
            inject(function ($injector) {
                $rootScope = $injector.get('$rootScope');
                $controller = $injector.get('$controller');
            });
        });

        describe('Controller: SupplierCtrl', function () {

            var scope, controller;
            beforeEach(inject(function ($controller, $rootScope) {
                scope = $rootScope.$new();
                controller = $controller('SupplierCtrl', { $scope: scope });
                spyOn(scope, "load");
                spyOn(scope, "create");
                spyOn(scope, "edit");
                spyOn(scope, "delete");
            }));

            it('Loads a Supplier', function () {
                scope.load();
                expect(scope.load).toHaveBeenCalled();
            });
            it('Creates a Supplier', function () {
                scope.create();
                expect(scope.create).toHaveBeenCalled();
            });
            it('Edits a Supplier', function () {
                scope.edit();
                expect(scope.edit).toHaveBeenCalled();
            });
            it('Deletes a Supplier', function () {
                scope.delete();
                expect(scope.delete).toHaveBeenCalled();
            });
            //Validate
            it('Validates a Supplier', function () {
                var valid = false;

                //Not Valid
                scope.supplier = { CompanyName: "" };
                valid = scope.validateSupplier();
                expect(valid).toBeFalsy();

                //Not Valid
                scope.supplier = { CompanyName: "IAMAREALLLYLONGNAMEOVER40CHARSBECAUSEHWYNOTTRYITRIGHT?" };
                valid = scope.validateSupplier();
                expect(valid).toBeFalsy();

                //Valid
                scope.supplier = { CompanyName: "New" };
                valid = scope.validateSupplier();
                expect(valid).toBeTruthy();
            });
        });

    });
})();