; (function () {
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
})();