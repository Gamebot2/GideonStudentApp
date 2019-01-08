/*
 * GIDEON APP
 * This angular module is the basis for all sitewide controllers.
 * 
 * NOTES:
 * - "gideonApp" and "URL" are universal references used in every Ctrl.js script
 */


const URL = "http://localhost:8080/";

gideonApp = angular.module('gideonApp', ['ngMaterial', 'ngMessages']).config(function($mdThemingProvider) {
    $mdThemingProvider.definePalette('black', $mdThemingProvider.extendPalette('grey', {
        '500': '#000000',
    }));
    $mdThemingProvider.theme('default')
        .primaryPalette('black')
        .accentPalette('amber')
        .warnPalette('red');
});