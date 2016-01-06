  angular.module('starter.controllers', [])


  .controller('SelectLocationCtrl', function ($scope, $http, $location, Estados){

    $scope.estados = Estados.query();
    $scope.location = {};

    $scope.$watch('location.estado', function (nombre){
      angular.forEach($scope.estados, function (estado){
        if(estado.nombre === nombre){
          $scope.estado = estado;
        }
      });
    });

    $scope.entrar = function(){
        $http.defaults.headers.get = $scope.location;
        $location.path('/tab/dash')
    }
  })
  .controller('NegocioDetailCtrl', function ($scope, $state, $ionicHistory, $stateParams, $ionicHistory, Negocios, $location){
    $scope.negocio = Negocios.getOne({categoryId : $stateParams.categoryId, negocioId: $stateParams.negocioId}, function(){
        $scope.getMap();

    })

  

    $scope.getMap = function(){
        var geocoder = new google.maps.Geocoder();
        var address = $scope.negocio.direccion + ", " + $scope.negocio.ciudad + ", " + $scope.negocio.estado;

        geocoder.geocode({'address': address}, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          $scope.map.setCenter(results[0].geometry.location);
          var marker = new google.maps.Marker({
            map: $scope.map,
            position: results[0].geometry.location
          });

          $scope.map.addListener('center_changed', function() {
            // 3 seconds after the center of the map has changed, pan back to the
            // marker.
            window.setTimeout(function() {
              $scope.map.panTo(results[0].geometry.location);
            }, 3000);
          });

        } else {
          $scope.err = 'Direccion equivocada';

        }
      });
    }
    if ($scope.negocio)
      $scope.getMap();

      $scope.approveNegocio = function(){
        Negocios.approve({categoryId : $stateParams.categoryId, negocioId: $stateParams.negocioId}, {}, function (data){
            $scope.negocio.approved = true;
              $ionicHistory.nextViewOptions({
                disableBack: true
              });
            $state.go('tab.dash')
        });
      }

      $scope.noApprove = function (){

        $location.path('/tab/account/approve-negocios')
      }

    $scope.initialise = function() {
      
        var myLatlng = new google.maps.LatLng(37.3000, -120.4833);
        var mapOptions = {
          center: myLatlng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
          };

        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

        var negocioLocation = new google.maps.Marker({
            position : myLatlng,
            map : map,
            title : $scope.negocio.nombre
        })




    $scope.map = map;
    };


    google.maps.event.addDomListener(document.getElementById("map"), 'load', $scope.initialise());
  })

  .controller('CategoryDetailCtrl', function ($scope, appconfig,  $stateParams, Users, Authentication, $location, $http, Categories, $ionicPopup, Negocios){
      $scope.user = Authentication.user; 
      $scope.category = Categories.getOne({categoryId : $stateParams.categoryId})
      $scope.negocios = Negocios.query({categoryId : $stateParams.categoryId}, function(){
          $scope.user = Authentication.user;

      });
    $scope.doRefresh = function(){

      $scope.user = Authentication.user; 
      $scope.category = Categories.getOne({categoryId : $stateParams.categoryId})
      $scope.negocios = Negocios.query({categoryId : $stateParams.categoryId}, function(){
          $scope.user = Authentication.user;
          $scope.$broadcast('scroll.refreshComplete')
      });
    }



    $scope.like = function(negociox){
      /* user has not logged in */
      $scope.user = Authentication.user;

      if (!$scope.user)
      {
          var alertPopup = $ionicPopup.alert({
            title: 'Autenticacion necesaria',
            template: 'Porfavor inicia sesión para continuar'
           });
           alertPopup.then(function(res) {
             $location.path('/tab/account')
           });
      }else{
        var userx = new Users($scope.user);
       
        $http.post(appconfig.apiUrl + '/negocios/like', {negocio:negociox, user:userx}).then(function (data){
          $scope.user = data.data;
          var user = new Users($scope.user);          

          user.$update(function (response){
            Authentication.user = response;
          }, function (response){
              
          })

          for (i = 0; i < $scope.negocios.length; i++)
          {
            if ($scope.negocios[i]._id == negociox._id)
              {
                Negocios.getOne({categoryId : $stateParams.categoryId, negocioId : negociox._id}, function (data){
                  $scope.negocios[i].likes = data.likes;
                });
                break;
              }
          }
        })

      }

    };

  })

  .controller('DashCtrl', function ($scope, Categories) {

      $scope.categories = {};
      $scope.categories = Categories.query();

    $scope.doRefresh = function(){
      $scope.categories = {};
      $scope.categories = Categories.query(function(){
        $scope.$broadcast('scroll.refreshComplete')
      })
    }

  })

  .controller('CreateNegocioCtrl', function ($scope, appconfig, $resource, $http, $location, Horas, Users, Estados, Categories, Authentication){


    $scope.mapset = false;

    $scope.initialise = function() {
      
        var myLatlng = new google.maps.LatLng(37.3000, -120.4833);
        
        var mapOptions = {
          center: new google.maps.LatLng(37.3000, -120.4833),
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
          };

        var map = new google.maps.Map(document.getElementById("map"), mapOptions);





    $scope.map = map;
    };
    google.maps.event.addDomListener(document.getElementById("map"), 'load', $scope.initialise());




    $scope.revisarDireccion = function(){

        var geocoder = new google.maps.Geocoder();
        var address = $scope.negocio.direccion + ", " + $scope.negocio.ciudad + ", " + $scope.negocio.estado;

        geocoder.geocode({'address': address}, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          $scope.map.setCenter(results[0].geometry.location);
          var marker = new google.maps.Marker({
            map: $scope.map,
            position: results[0].geometry.location
          });
          $scope.mapset = true;
        } else {
          $scope.err = 'Direccion equivocada';
          $scope.mapset = false;
        }
      });

    }

    //get everything needed from the API
    $scope.categories = Categories.query();
    
    //initializing stuff for the view
    $scope.negocio = {};
    $scope.negocio.estado = {};
    $scope.open = {};
    $scope.sele = {};
    $scope.sele.openPm = {};
    $scope.sele.closePm = {};
    
    //getting the user from the provider
    $scope.user = Authentication.user;

    //check if user is logged in or actually has permission to create
    if (!$scope.user || $scope.user.roles.indexOf('admin') < 0)
      $location.path('/tab/account')

    //stuff for the controller
    $scope.estados = Estados.query();
    $scope.horas = Horas;

    $scope.$watch('negocio.estado', function (nombre){
      delete $scope.negocio.ciudad;
      angular.forEach($scope.estados, function (estado){
        if(estado.nombre === nombre){
          $scope.selectedEstado = estado;
          console.log(estado);
        }
      });
    });

    $scope.create = function(){
    if (!$scope.negocio.categoria && !$scope.negocio.nombre && !$scope.negocio.descripcion && !$scope.mapset)
    {
       $scope.err = 'Te falta informacion';
       return;
    }
      $scope.negocio.open = $scope.sele.op + ' ' +  $scope.sele.openPm;
      $scope.negocio.close = $scope.sele.cl + ' ' + $scope.sele.closePm;
      $http.post(appconfig.apiUrl + '/negocios', $scope.negocio).success(function (data){
        $location.path('/tab/account')
      }).error(function (data){
        $scope.err = data.message;
      })
    }




  })

  .controller('AccountCtrl', function ($scope, $location, appconfig, $http, Users, Authentication) {
    $scope.authentication = Authentication;
    $scope.credentials = {};
    $scope.apiurl = appconfig.apiUrl;
    $scope.negociosPendientes = 0;
     $scope.login = function() {
        $http.post(appconfig.apiUrl + '/auth/signin', $scope.credentials).success(function (response) {
          // If successful we assign the response to the global user model
          $scope.authentication.user = response;

          // And redirect to the index page
           $location.path('/tab/account')
          
        }).error(function(response) {
          $scope.error = response.message;
        });
      };

      $scope.signup = function(){
        $http.post(appconfig.apiUrl + '/auth/signup', $scope.credentials).success(function (response){
          $scope.authentication.user = response;

          $location.path('/tab/account')

        }).error(function (response){
          $scope.error = response.message;
          console.log($scope.error);
        });
      }

      $scope.signout = function(){
        $http.get(appconfig.apiUrl + '/auth/signout').success(function (response){
          $scope.authentication.user = null;
          $scope.credentials = {};
          $scope.error = null;
          $location.path('/tab/account');
        })
      }


      $scope.doRefresh = function(){
        $http.get(appconfig.apiUrl + '/negocios-pendientes').success(function (data){
          $scope.negociosPendientes = data;
          $scope.$broadcast('scroll.refreshComplete')
        }).error(function (){
          $scope.$broadcast('scroll.refreshComplete')
          $scope.err = 'Error refreshing';
        })
      }

      $scope.$on('$ionicView.enter', function(){
        $http.get(appconfig.apiUrl + '/negocios-pendientes').success(function (data){
          $scope.negociosPendientes = data;
         })
      })


  })


  .controller('ManageNegocioCtrl', function ($scope, $location, Negocios){
      $scope.negocios = Negocios.getForUser();
      $scope.listCanSwipe = true
      $scope.edit = function(negocio){
        
        $location.path('/tab/account/edit-negocio/' + negocio.categoria + '/'+negocio._id)
      }

      $scope.promos = function(negocio){
        $location.path('/tab/account/manage-promos/'+ negocio.categoria + '/' + negocio._id)
      }

  })

  .controller('EditNegocioCtrl', function ($scope, $stateParams, $location, Categories, Estados, Horas, Negocios){

    $scope.horas = {};
    $scope.sele = {};
    $scope.estados = {};
    $scope.horas = Horas;
    $scope.estados = Estados.query();
    $scope.categories = Categories.query();
    $scope.negocio = Negocios.getOne({categoryId : $stateParams.categoryId, negocioId: $stateParams.negocioId});

    $scope.$watch('negocio.estado', function (nombre){

      angular.forEach($scope.estados, function (estado){
        if(estado.nombre === nombre){
          $scope.selectedEstado = estado;
          angular.forEach($scope.selectedEstado.ciudades, function (ciudad){
            if($scope.negocio.ciudad === ciudad.nombre)
              {
                $scope.selectedCity = ciudad.nombre;
              }
          })
        }
      });
    });

    $scope.update = function(){
      $scope.estado = $scope.selectedEstado;
      $scope.ciudad = $scope.selectedCity;

      var geocoder = new google.maps.Geocoder();
      var address = $scope.negocio.direccion + ", " + $scope.negocio.ciudad + ", " + $scope.negocio.estado;
      
      geocoder.geocode({'address': address}, function (results, status) {
      if (status != google.maps.GeocoderStatus.OK)
      {
          $scope.err = 'La direccion esta equivocada';
          return
      }
      })
      Negocios.update({categoryId : $scope.negocio.categoria, negocioId : $scope.negocio._id}, $scope.negocio, function(){

        $location.path('/tab/account/manage-negocios')
      });
    }

  })

  .controller('CreateCategoryCtrl', function ($scope, $http, Icons, appconfig, $location, $stateParams){
    $scope.categoria = {};
    $scope.icon = {};
    $scope.iconClass = {};
    $scope.iconos = Icons.all();

    $scope.update = function(){
     $scope.iconClass = $scope.icon.name;
     console.log($scope.iconClass);
    }

    $scope.create = function(){
      if (!$scope.categoria.name && !$scope.categoria.icon)
      {
         $scope.err = 'algo hiciste mal'
         return;
      } 
      $http.post(appconfig.apiUrl + '/categories/', $scope.categoria).success(function (data){
          $location.path('/tab/account/')
      }).error(function (data){
        $scope.err = data.message;
      })
    }


  })


  .controller('PromosCtrl', function ($scope, $location, $cordovaSocialSharing, Promos){
    $scope.promos = Promos.query();
   
     $scope.doRefresh = function (){
        $scope.promos = Promos.query(function (){
           $scope.$broadcast('scroll.refreshComplete')
        })   
     }

     $scope.goTo = function(negocio){
      $location.path('/tab/dash/' + negocio.categoria + '/' + negocio._id)
     }

     $scope.shareAnywhere = function(promo) {
        $cordovaSocialSharing.share(promo.name, promo.negocio.nombre, promo.img, "http://rhinomarketing.com.mx/");
    }
  })

  .controller('ApproveNegociosCtrl', function ($scope, Negocios){
    $scope.negocios = Negocios.getUnapproved();
  })

  .controller('ManagePromosCtrl', function ($scope, $http, $stateParams, $location, Negocios, Promos){
    $scope.promos = Promos.getForNegocio({negocioId:$stateParams.negocioId});
    $scope.newPromo = {};
    $scope.listCanSwipe = true;
    var d = new Date().toISOString().split("T")[0];
    $scope.newPromo.start = new Date(d);
    $scope.newPromo.end = new Date(d);
    $scope.negocio = Negocios.getOne({categoryId: $stateParams.categoryId, negocioId : $stateParams.negocioId})

    $scope.crearPromo = function(negocio){
      $scope.newPromo.negocio = negocio._id;  
      $scope.newPromo.ciudad = negocio.ciudad;  
      Promos.create($scope.newPromo, function (data){
        $scope.promos.push(data);
      })
    }

    $scope.delete = function(promo){

      Promos.deleteForNegocio({negocioId: promo.negocio._id, promoId : promo._id}, function (data){
        
        $scope.promos.splice($scope.promos.indexOf(promo), 1);
      })
    }
 
  })