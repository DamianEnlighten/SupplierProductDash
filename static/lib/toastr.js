'use strict';

/*
 * AngularJS toastr
 * Version: 0.4.7
 *
 * Copyright 2013 Jiri Kavulak.  
 * All Rights Reserved.  
 * Use, reproduction, distribution, and modification of this code is subject to the terms and 
 * conditions of the MIT license, available at http://www.opensource.org/licenses/mit-license.php
 *
 * Author: Jiri Kavulak
 * Related to project of John Papa and Hans Fjällemark
 */

angular.module('toastr', ['ngAnimate'])
.service('toastr', ['$rootScope', function ($rootScope) {
    this.pop = function (type, title, body, timeout, clickHandler) {
        this.toast = {
            type: type,
            title: title,
            body: body,
            timeout: timeout,
            bodyOutputType: 'trustedHtml',
            clickHandler: clickHandler
        };
        $rootScope.$broadcast('toastr-newToast');
    };
	this.success = function (title,body, clickHandler) {
        this.toast = {
            type: 'success',
            title: title,
            body: body,
            timeout: 5000,
            clickHandler: clickHandler
        };
        $rootScope.$broadcast('toastr-newToast');
    };
	this.info = function (title,body, clickHandler) {
        this.toast = {
            type: 'info',
            title: title,
            body: body,
            timeout: 5000,
            clickHandler: clickHandler
        };
        $rootScope.$broadcast('toastr-newToast');
    };
	this.error = function (title,body, clickHandler) {
        this.toast = {
            type: 'error',
            title: title,
            body: body,
            timeout: 5000,
            clickHandler: clickHandler
        };
        $rootScope.$broadcast('toastr-newToast');
    };

    this.clear = function () {
        $rootScope.$broadcast('toastr-clearToasts');
    };
}])
.constant('toastrConfig', {
    'limit': 0,                   // limits max number of toasts 
    'tap-to-dismiss': true,
    'close-button': false,
    'newest-on-top': true,
    //'fade-in': 1000,            // done in css
    //'on-fade-in': undefined,    // not implemented
    //'fade-out': 1000,           // done in css
    // 'on-fade-out': undefined,  // not implemented
    //'extended-time-out': 1000,    // not implemented
    'time-out': 5000, // Set timeOut and extendedTimeout to 0 to make it sticky
    'icon-classes': {
        error: 'toast-error',
        info: 'toast-info',
        wait: 'toast-wait',
        success: 'toast-success',
        warning: 'toast-warning'
    },
    'body-output-type': '', // Options: '', 'trustedHtml', 'template'
    'body-template': 'toastrBodyTmpl.html',
    'icon-class': 'toast-info',
    'position-class': 'toast-top-right',
    'title-class': 'toast-title',
    'message-class': 'toast-message clickable'
})
.directive('toastrContainer', ['$compile', '$timeout', '$sce', 'toastrConfig', 'toastr',
function ($compile, $timeout, $sce, toastrConfig, toastr) {
    return {
        replace: true,
        restrict: 'EA',
        scope: true, // creates an internal scope for this directive
        link: function (scope, elm, attrs) {

            var id = 0,
                mergedConfig;

            mergedConfig = angular.extend({}, toastrConfig, scope.$eval(attrs.toastrOptions));

            scope.config = {
                position: mergedConfig['position-class'],
                title: mergedConfig['title-class'],
                message: mergedConfig['message-class'],
                tap: mergedConfig['tap-to-dismiss'],
                closeButton: mergedConfig['close-button']
            };

            scope.configureTimer = function configureTimer(toast) {
                var timeout = typeof (toast.timeout) == "number" ? toast.timeout : mergedConfig['time-out'];
                if (timeout > 0)
                    setTimeout(toast, timeout);
            };

            function addToast(toast) {
                toast.type = mergedConfig['icon-classes'][toast.type];
                if (!toast.type)
                    toast.type = mergedConfig['icon-class'];

                id++;
                angular.extend(toast, { id: id });

                // Set the toast.bodyOutputType to the default if it isn't set
                toast.bodyOutputType = toast.bodyOutputType || mergedConfig['body-output-type'];
                switch (toast.bodyOutputType) {
                    case 'trustedHtml':
                        toast.html = $sce.trustAsHtml(toast.body);
                        break;
                    case 'template':
                        toast.bodyTemplate = toast.body || mergedConfig['body-template'];
                        break;
                }

                scope.configureTimer(toast);

                if (mergedConfig['newest-on-top'] === true) {
                    scope.toastrs.unshift(toast);
                    if (mergedConfig['limit'] > 0 && scope.toastrs.length > mergedConfig['limit']) {
                        scope.toastrs.pop();
                    }
                } else {
                    scope.toastrs.push(toast);
                    if (mergedConfig['limit'] > 0 && scope.toastrs.length > mergedConfig['limit']) {
                        scope.toastrs.shift();
                    }
                }
            }

            function setTimeout(toast, time) {
                toast.timeout = $timeout(function () {
                    scope.removeToast(toast.id);
                }, time);
            }

            scope.toastrs = [];
            scope.$on('toastr-newToast', function () {
                addToast(toastr.toast);
            });

            scope.$on('toastr-clearToasts', function () {
                scope.toastrs.splice(0, scope.toastrs.length);
            });
        },
        controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {

            $scope.stopTimer = function (toast) {
                if (toast.timeout) {
                    $timeout.cancel(toast.timeout);
                    toast.timeout = null;
                }
            };

            $scope.restartTimer = function (toast) {
                if (!toast.timeout)
                    $scope.configureTimer(toast);
            };

            $scope.removeToast = function (id) {
                var i = 0;
                for (i; i < $scope.toastrs.length; i++) {
                    if ($scope.toastrs[i].id === id)
                        break;
                }
                $scope.toastrs.splice(i, 1);
            };

            $scope.click = function (toastr) {
                if ($scope.config.tap === true) {
                    if (toastr.clickHandler && angular.isFunction($scope.$parent.$eval(toastr.clickHandler))) {
                        var result = $scope.$parent.$eval(toastr.clickHandler)(toastr);
                        if (result === true)
                            $scope.removeToast(toastr.id);
                    } else {
                        if (angular.isString(toastr.clickHandler))
                            console.log("TOAST-NOTE: Your click handler is not inside a parent scope of toastr-container.");
                        $scope.removeToast(toastr.id);
                    }
                }
            };
        }],
        template:
        '<div  id="toast-container" ng-class="config.position">' +
            '<div ng-repeat="toastr in toastrs" class="toast" ng-class="toastr.type" ng-click="click(toastr)" ng-mouseover="stopTimer(toastr)"  ng-mouseout="restartTimer(toastr)">' +
              '<button class="toast-close-button" ng-show="config.closeButton">&times;</button>' +
              '<div ng-class="config.title">{{toastr.title}}</div>' +
              '<div ng-class="config.message" ng-switch on="toastr.bodyOutputType">' +
                '<div ng-switch-when="trustedHtml" ng-bind-html="toastr.html"></div>' +
                '<div ng-switch-when="template"><div ng-include="toastr.bodyTemplate"></div></div>' +
                '<div ng-switch-default >{{toastr.body}}</div>' +
              '</div>' +
            '</div>' +
        '</div>'
    };
}]);