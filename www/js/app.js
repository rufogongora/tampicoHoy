// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova'])

.constant('appconfig', {
    appName: 'Xplora',
    appVersion: 2.0,
    apiUrl: 'http://rgongora.com:3000'
    //apiUrl : '/api'
})


.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.directive('errSrc', function() {
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        if (attrs.src != attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });
    }
  }
})

.directive('backImg', function(){
    return function (scope, element, attrs){
        if (attrs.src != attrs.errSrc)
        {
        var url = attrs.backImg;
        element.css({
            'background-image': 'url(' + url +')'
        });
      }
    };
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true, 
    templateUrl: 'templates/tabs.html'
  })

    .state('selectLocation', {
      url : '/select',
      templateUrl : 'templates/select-location.html',
      controller : 'SelectLocationCtrl'
    })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

    .state('tab.category-detail', {
      url: '/dash/:categoryId',
      views: {
        'tab-dash': {
          templateUrl: 'templates/category-detail.html',
          controller: 'CategoryDetailCtrl'
        }
      }
    })
    .state('tab.negocio-detail', {
      url: '/dash/:categoryId/:negocioId',
      views: {
        'tab-dash': {
          templateUrl: 'templates/negocio-detail.html',
          controller: 'NegocioDetailCtrl'
        }
      }
    })
  .state('tab.promos', {
      url: '/promos',
      views: {
        'tab-promos': {
          templateUrl: 'templates/tab-promos.html',
          controller: 'PromosCtrl'
        }
      }
    })



  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })


    .state('tab.account-create', {
      url: '/account/craete',
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-account-create.html',
          controller: 'AccountCtrl'
        }
      }
    })

    .state('tab.account-create-negocio', {
      url: '/account/create-negocio',
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-account-create-negocio.html',
          controller: 'CreateNegocioCtrl'
        }
      }
    })


    .state('tab.account-manage-negocios', {
      url: '/account/manage-negocios',
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-manage-negocios.html',
          controller: 'ManageNegocioCtrl'
        }
      }
    })

    .state('tab.account-negocio-edit', {
      url : '/account/edit-negocio/:categoryId/:negocioId',
      views : {
        'tab-account' : {
            templateUrl : 'templates/tab-negocio-edit.html',
            controller : 'EditNegocioCtrl'
        }
      }
    })

    .state('tab.account-approvenegocios', {
      url : '/account/approve-negocios',
      views : {
        'tab-account' : {
          templateUrl : 'templates/tab-account-approve-negocios.html',
          controller : 'ApproveNegociosCtrl'
        }
      }
    })

    .state('tab.account-manage-promos', {
      url : '/account/manage-promos/:categoryId/:negocioId',
      views : {
        'tab-account' : {
          templateUrl : 'templates/tab-account-manage-promos.html',
          controller : 'ManagePromosCtrl'
        }
      }
    })

    .state('tab.account-create-category', {
      url: '/account/create-category',
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-account-create-category.html',
          controller: 'CreateCategoryCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/select');

});
