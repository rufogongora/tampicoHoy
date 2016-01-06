angular.module('starter.services', ['ngResource'])  


.factory('Categories', function ($resource, appconfig){


 var categories = $resource(appconfig.apiUrl + '/categories/:categoryId', null,  {'getOne' : {method:'GET', isArray:false}});
 return categories;


})

.factory('Negocios', function ($resource, appconfig){
/* var negocios = $resource('/xplora/negocio/get/:cid/', {cid : '@id'})
  return negocios;*/
return $resource(appconfig.apiUrl + '/negocios/:categoryId/:negocioId', null, 
  {
   'getOne' : {method:'GET', isArray:false},
   'getForUser' : {method:'GET', isArray:true},
   'update' : {method : 'PUT'},
   'getUnapproved' : {method : 'GET', isArray:true, url: appconfig.apiUrl + '/negocios-unapproved'},
   'approve' : {method : 'POST'}
 });


})

.factory('Users', ['$resource', 'appconfig',
  function($resource, appconfig) {
    return $resource(appconfig.apiUrl + '/users', {}, {
      update: {
        method: 'PUT'
      },
      like : {
        method : 'POST',
        url : appconfig.apiUrl + '/negocios/like/'
      }
    });
  }
])

.factory('Authentication', [
  function() {
    var _this = this;

    _this._data = {
      user: window.user
    };

    return _this._data;
  }
])

.factory('Estados', function ($resource, appconfig){
    return $resource(appconfig.apiUrl + '/estados');

})

.factory('Promos', function ($resource, appconfig){
  return $resource(appconfig.apiUrl + '/promos/:negocioId/:promoId', {}, 
    { 
      create : {method:'POST', isArray:false},
      getForNegocio : {method:'GET', isArray:true},
      deleteForNegocio : {method:'DELETE'}
    })
})

.factory('Icons', function(){

  var icons = [ 
  { name : 'ion-android-bar'},
  { name : 'ion-ios-home'},
  { name : 'ion-plane'},
  { name : 'ion-waterdrop'},
  { name : 'ion-fork'},
  { name : 'ion-person'},
  { name : 'ion-man'},
  { name : 'ion-woman'},
  { name : 'ion-beer'},
  { name : 'ion-wineglass'},
  { name : 'ion-coffee'},
  { name : 'ion-pizza'},
  { name : 'ion-android-lock'},
  { name : 'ion-android-globe'},
  { name : 'ion-android-mail'},
  { name : 'ion-android-compass'},
  { name : 'ion-android-bus'},
  { name : 'ion-android-car'},
  { name : 'ion-android-settings'},
  { name : 'ion-android-call'},
  { name : 'ion-ios-paw'},
  { name : 'ion-ios-cart'},
  { name : 'ion-plane'},
  { name : 'ion-model-s'},
  { name : 'ion-cash'},
  { name : 'ion-bag'},
  { name : 'ion-tshirt'},
  { name : 'ion-medkit'},
  { name : 'ion-beer'},
  { name : 'ion-wineglass'},
  { name : 'ion-coffee'},
  { name : 'ion-icecream'},
  { name : 'ion-pizza'},
  { name : 'ion-tshirt'}
  ];



  return {
    all : function(){
      return icons
    }
  }
})

.factory('Horas', function() {

  return [{
      hora : '1:00'
    },{
      hora : '2:00'
    },{
      hora : '3:00'
    },{
      hora : '4:00'
    },{
      hora : '5:00'
    },{
      hora : '6:00'
    },{
      hora : '7:00'
    },{
      hora : '8:00'
    },{
      hora : '9:00'
    },{
      hora : '10:00'
    },{
      hora : '11:00'
    },
    {
          hora : '12:00'
    }]


})

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
