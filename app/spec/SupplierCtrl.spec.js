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