'use strict';

/* Controllers */

var buybsControllers = angular.module('buybsControllers', []);

var ipAddress = 'http://180.76.152.112';
var mobileSize = 550;

var eLike = 1;
var eFollow = 2;
var eCollect = 3;
var eComment = 4;
var eFootstep = 1;
var eTopic = 2;
var ePeople = 3;
function addEvent($http, $window, u_id, at_id, nf_to, tp_id, c_id, reload){

  if(u_id != nf_to) {

    var data = {
      u_id: u_id,
      at_id: at_id,
      nf_to: nf_to,
      tp_id: tp_id,
      c_id: c_id
    };
    var req = {
      method: 'POST',
      url: ipAddress + '/notifications/add',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    $http(req).success(function (result) {
      console.log('add event');
      if(reload) {
        $window.location.reload();
      }
    }, function (error) {
      console.log(error);
    });
  } else {
    if(reload){
      $window.location.reload();
    }
  }


}



var allowScroll = false;
function displayPosition(miles, top){
  var maxTop = 0;
  var timer = setInterval(function(){
    window.clearInterval(timer);

    var arrayAcount = Math.floor($("#footstep-list").width()/(248*2));
    var left = 248*2;

    if($("#footstep-list").width() < mobileSize && $("#footstep-list").width() >= (mobileSize - 100)){
      arrayAcount = 2;
      left = 248*2;
      top = 80;
    }
    // alert($("#footstep-list").width() < mobileSize - 100);
    if($("#footstep-list").width() < (mobileSize - 100)){
      arrayAcount = 1;
      left = 336;
    }

      if ($("#footstep-list").children("#footstep-list-div").size() > 0) {
        var i = 0;
        var count = 0;
        var trigger = 0;
        var multiply = arrayAcount;

        var topPxs = [

        ];

        //align the same disntance between left and right
        var balanceLength = ($('#footstep-list').width() - left*arrayAcount)/2;

        for(var h = 0; h < arrayAcount; h ++) {
          topPxs.push({"topPx": top, "leftPx": (left * h)+balanceLength});
        }

        var maxVal = 30;
        var listIndex = 0;
        $("#footstep-list").children("#footstep-list-div").each(function (index, element) {
          listIndex++;
          $(element).css({
            "top": topPxs[i].topPx + "px",
            "left": topPxs[i].leftPx + "px",
            "visibility": "visible"
          });

          if(maxTop < topPxs[i].topPx) {
            maxTop = topPxs[i].topPx;

            if (listIndex >= $("#footstep-list").children("#footstep-list-div").size() - 1) {
              $(element).css({
                "margin-bottom": "200px"
              });
            }
          }

          topPxs[i].topPx = topPxs[i].topPx + $(element).height() + 35;

          if ((index + 1) % multiply == 0) {
            i = 0;
            count++;
          } else {
            i++;

            if ((count * multiply) + multiply > $("#footstep-list").children("#footstep-list-div").size() && trigger == 0) {
              trigger++;
            }
          }
          if($("#footstep-list").children("#footstep-list-div").size() -1 == listIndex ) {
            console.log("children(#footstep-list-div) = " + $(".footstep_list_home").children("#footstep-list-div").size() + ", index = " + listIndex);
            maxVal = topPxs[i].topPx;
          }
        });
        allowScroll = true;
        $('.footstep-list_end').css('top', maxVal + 500);

      } else {
        $('.footstep-list_end').css('display', 'none');
      }

  },miles);
  
}



//deprecated
function dynamicallyCSS(mobileSize, defaultCSS, mobileCSS, cssObj) {
  if($(window).width() < mobileSize - 100) {
    cssObj.add(mobileCSS);
  } else {
    cssObj.add(defaultCSS);
  }
}



/* Get footsteps list */
buybsControllers.controller('FootstepsListCtrl', ['$scope', '$http', '$cookies', '$window','$css', function ($scope, $http, $cookies, $window, $css) {

  // $('.explore').css('display','block');

  $http({method: 'GET', url: ipAddress + '/footsteps/getFootsteps', params:{index_start: 0, count: 3, u_id: $cookies.get('u_id')}})
      .success(function(data){
        $scope.newest = data;
        // displayPosition(500,20);
      },function(error){
        $scope.error = error;
      });

  // $http({method: 'GET', url: ipAddress + '/countries/getCountries'})
  //     .success(function(data){
  //       $scope.countries = data;
  //     }, function(error){
  //       $scope.error = error;
  //     });

  
  // deprecated
  $scope.countryFilter = function(element, fs_from){
    $http({method: 'GET', url: ipAddress + '/footsteps/getFootsteps', params:{fs_from: fs_from,u_id: $cookies.get('u_id')}})
        .success(function(data){
          $scope.footsteps = data;
          displayPosition(500,20);
          // $scope.number = data.length;
        }, function(error){
          $scope.error = error;
        });
  };
  

  
  


  $scope.tag = '';
  $scope.tagFilter = function(element, fs_from){
    $scope.tag = $('#tagValue').val();
    $http({method: 'GET', url: ipAddress + '/footsteps/getFootstepsByTag', params:{tag: $('#tagValue').val(),u_id: $cookies.get('u_id'),index_start: 0, count: 20}})
        .success(function(data){
          // console.log(JSON.stringify(data));
          if(!data.errno){
            $('.footstep_list_home').css('display','block');
            $('.recommend').css('display', 'none');
            $scope.footsteps = data;
            $scope.footsteps.push({});
            displayPosition(500,20);
            $scope.isbusy = false;
            // $scope.number = data.length;
          }
        }, function(error){
          $scope.error = error;
        });
  };
  
  

  $scope.bgColorChange = function (divkey) {
    $(".bgColorChange"+divkey).css("background-color",'rgba(239,239,239,0.96)');

  };

  $scope.bgColorRemove = function (divkey) {
    $(".bgColorChange" + divkey).css("background-color",'white');
  };

  $http({method: 'GET', url: ipAddress + '/footsteps/getFootstepsNumber'})
      .success(function(data){
        $scope.number = data[0].number;
      },function(error){
        $scope.error = error;
      });

  $scope.isbusy = false;
  $scope.loadMore = function() {
    // console.log("load more...");
    if($scope.footsteps && $scope.number > $scope.footsteps.length) {
      $scope.isbusy = true;
      $http({
        method: 'GET',
        url: ipAddress + '/footsteps/getFootstepsByTag',
        params: {index_start: $scope.footsteps.length, count: 3,u_id: $cookies.get('u_id'), tag: $scope.tag}
      }).success(function (data) {
        if (data.length > 0) {
          for (var i = 0; i < data.length; i++) {
            $scope.footsteps.push(data[i]);
          }
          $scope.isbusy = false;
          displayPosition(500,20);
        }
      }, function (error) {
        $scope.error = error;
      });
    } else {
      if($scope.footsteps)
        $scope.footsteps.push({});
    }
  };

  $scope.stickBtn = function(id, u_id){
    if($cookies.get('u_id') == undefined){
      $window.location.href = '#/login';
      return;
    }
    $http({method: 'GET', url: ipAddress + '/sticks/search', params: {fs_id: id, u_id: $cookies.get('u_id')}})
        .success(function(data){
          if(data.length > 0 ) {
            var req = {
              method: 'POST',
              url: ipAddress + '/sticks/delete',
              headers: {
                'Content-Type': 'application/json'
              },
              data: {
                'fs_id': id,
                'u_id': $cookies.get('u_id')
              }
            };

            $http(req).success(function(result){
              // addEvent($http, $window, $cookies.get('u_id'),eCollect,u_id,eFootstep,id);
              $(".btnStick" + id).css("background-color","");

              //GET AND REFRESH STICK NUMBER
              $http({method: 'GET', url: ipAddress + '/sticks/search', params: {fs_id: id}})
                  .success(function(data){
                    $('.btnStickNum' + id).html(data.length);
                  });

            }, function(error){
              console.log(error);
            });


          } else {
            var req = {
              method: 'POST',
              url: ipAddress + '/sticks/add',
              headers: {
                'Content-Type': 'application/json'
              },
              data: {
                'fs_id': id,
                'u_id': $cookies.get('u_id')
              }
            };

            $http(req).success(function(result){
              addEvent($http, $window, $cookies.get('u_id'),eCollect,u_id,eFootstep,id, false);
              $(".btnStick" + id).css("background-color","#43c17e");

              //GET AND REFRESH STICK NUMBER
              $http({method: 'GET', url: ipAddress + '/sticks/search', params: {fs_id: id}})
                  .success(function(data){
                    $('.btnStickNum' + id).html(data.length);
                  });
            }, function(error){
              console.log(error);
            });
          }
        }, function(error){
          console.log(error);
        });

  };

  $scope.loginCheck = function(fs_id) {
      $window.location.href = "#/foot/" + fs_id;
  };

  $scope.likeBtn = function(id, u_id){
    if($cookies.get('u_id') == undefined){
      $window.location.href = '#/login';
      return;
    }

    $http({method: 'GET', url: ipAddress + '/likes/search', params: {fs_id: id, u_id: $cookies.get('u_id')}})
        .success(function(data){
          console.log(data);
          if(data.length > 0) {
            // alert('每个人只能喜欢一次哦');
            var req = {
              method: 'POST',
              url: ipAddress + '/likes/delete',
              header: {
                'Content-Type': 'application/json'
              },
              data: {
                'fs_id': id,
                'u_id': $cookies.get('u_id')
              }
            };
            $http(req).success(function(result){
              // addEvent($http, $window, $cookies.get('u_id'),eLike,u_id,eFootstep,id);
             $(".btnLike" + id).css("background-color","");

              //GET AND REFRESH STICK NUMBER
              $http({method: 'GET', url: ipAddress + '/likes/search', params: {fs_id: id}})
                  .success(function(data){
                    $('.btnLikeNum' + id).html(data.length);
                  });

            }, function(error){
              console.log(error);
            })
          } else {
            var req = {
              method: 'POST',
              url: ipAddress + '/likes/add',
              header: {
                'Content-Type': 'application/json'
              },
              data: {
                'fs_id': id,
                'u_id': $cookies.get('u_id')
              }
            };
            $http(req).success(function(result){
              addEvent($http, $window, $cookies.get('u_id'),eLike,u_id,eFootstep,id, false);
              $(".btnLike" + id).css("background-color","#43c17e");

              //GET AND REFRESH STICK NUMBER
              $http({method: 'GET', url: ipAddress + '/likes/search', params: {fs_id: id}})
                  .success(function(data){
                    $('.btnLikeNum' + id).html(data.length);
                  });

            }, function(error){
              console.log(error);
            })
          }
        }, function(error){
          $scope.error = error;
        });
  };


}]);

/* get footstep detail by foot id */
buybsControllers.controller('FootDetailCtrl', ['$scope', '$routeParams', '$http', '$cookies', '$window','$css','$sce', function ($scope, $routeParams, $http, $cookies, $window,$css,$sce) {

  if($(window).width() < mobileSize - 100) {
    $scope.zoom = false;
  } else {
    $scope.zoom = true;
  }

  $scope.nextPic = function(fs_id){
    $http({method: 'GET', url: ipAddress + '/footsteps/getNext', params:{fs_id: fs_id}})
        .success(function(data){
          console.log('data: ' + (JSON.stringify(data)));
          if(data.fs_id) {
            $(".next_pic").html("下一张图");
            // $window.location.href = "#/foot/" + data.fs_id;



            $http({method: 'GET', url: ipAddress + '/footsteps/getFootstepsDetail', params:{fs_id:data.fs_id}})
                .success(function(data){
                  console.log('data: ' + (JSON.stringify(data)));
                  $scope.foot = data[0];
                  $scope.checkUser = $scope.foot.u_id == $cookies.get('u_id')?true:false;
                }, function(error){
                  $scope.error = error;
                });

            $http({method: 'GET', url: ipAddress + '/comments/getCommentsByFSID', params:{fs_id:data.fs_id}})
                .success(function(data){
                  $scope.comments = data;
                }, function(error){
                  $scope.error = error;
                });

            $http({method: 'GET', url: ipAddress + '/sticks/getSticksByFSID', params:{fs_id:data.fs_id}})
                .success(function(data){
                  $scope.sticks = data;
                }, function(error){
                  $scope.error = error;
                });




          } else {
            $(".next_pic").html("没有了");
          }
        }, function(error){
          $scope.error = error;
        });
  };

  $scope.prevPic = function(fs_id){
    $http({method: 'GET', url: ipAddress + '/footsteps/getPrev', params:{fs_id: fs_id}})
        .success(function(data){
          console.log('data: ' + (JSON.stringify(data)));
          if(data.fs_id) {
            $(".prev_pic").html("上一张图");
            // $window.location.href = "#/foot/" + data.fs_id;


            $http({method: 'GET', url: ipAddress + '/footsteps/getFootstepsDetail', params:{fs_id:data.fs_id}})
                .success(function(data){
                  console.log('data: ' + (JSON.stringify(data)));
                  $scope.foot = data[0];
                  $scope.checkUser = $scope.foot.u_id == $cookies.get('u_id')?true:false;
                }, function(error){
                  $scope.error = error;
                });

            $http({method: 'GET', url: ipAddress + '/comments/getCommentsByFSID', params:{fs_id:data.fs_id}})
                .success(function(data){
                  $scope.comments = data;
                }, function(error){
                  $scope.error = error;
                });

            $http({method: 'GET', url: ipAddress + '/sticks/getSticksByFSID', params:{fs_id:data.fs_id}})
                .success(function(data){
                  $scope.sticks = data;
                }, function(error){
                  $scope.error = error;
                });


          } else {
            $(".prev_pic").html("没有了");
          }
        }, function(error){
          $scope.error = error;
        });
  };

  
  $scope.windowSize = $(window).width();

  $scope.trustSrc = function(src){
    return $sce.trustAsResourceUrl(src);
  };

  $scope.renderHtml = function(value) {
    return $sce.trustAsHtml(value);
  };

  $scope.likeBtn = function(id, u_id){
    if($cookies.get('u_id') == undefined){
      $window.location.href = '#/login';
      return;
    }

    $http({method: 'GET', url: ipAddress + '/likes/search', params: {fs_id: id, u_id: $cookies.get('u_id')}})
        .success(function(data){
          console.log(data);
          if(data.length > 0) {
            var req = {
              method: 'POST',
              url: ipAddress + '/likes/delete',
              header: {
                'Content-Type': 'application/json'
              },
              data: {
                'fs_id': id,
                'u_id': $cookies.get('u_id')
              }
            };
            $http(req).success(function(result){
              // addEvent($http, $window, $cookies.get('u_id'),eLike,u_id,eFootstep,id);
              $(".like_footstep").css("background-color","");

              //GET AND REFRESH STICK NUMBER
              $http({method: 'GET', url: ipAddress + '/likes/search', params: {fs_id: id}})
                  .success(function(data){
                    $('.btnLikeNum' + id).html(data.length);
                  });

            }, function(error){
              console.log(error);
            })
          } else {
            var req = {
              method: 'POST',
              url: ipAddress + '/likes/add',
              header: {
                'Content-Type': 'application/json'
              },
              data: {
                'fs_id': id,
                'u_id': $cookies.get('u_id')
              }
            };
            $http(req).success(function(result){
              addEvent($http, $window, $cookies.get('u_id'),eLike,u_id,eFootstep,id, false);
              $(".like_footstep").css("background-color","#43c17e");

              //GET AND REFRESH STICK NUMBER
              $http({method: 'GET', url: ipAddress + '/likes/search', params: {fs_id: id}})
                  .success(function(data){
                    $('.btnLikeNum' + id).html(data.length);
                  });

            }, function(error){
              console.log(error);
            })
          }
        }, function(error){
          $scope.error = error;
        });
  };
  
  $scope.delBtn = function(id,u_id) {
    if($cookies.get('u_id') == undefined){
      $window.location.href = '#/login';
      return;
    }
    
      var req = {
        method: 'POST',
        url: ipAddress + '/footsteps/delete',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          'fs_id': id
        }
      };
  
      $http(req).success(function(result){
        if(result.errno) {
          alert("操作失败, 请稍后再试");
        } else {
          alert("删除成功");
          $window.location.href = '#/';
        }
      }, function(error){
        console.log(error);
      });
    
  };
  

  $scope.stickBtn = function(id, u_id){
    if($cookies.get('u_id') == undefined){
      $window.location.href = '#/login';
      return;
    }
    $http({method: 'GET', url: ipAddress + '/sticks/search', params: {fs_id: id, u_id: $cookies.get('u_id')}})
        .success(function(data){
          if(data.length > 0 ) {
            var req = {
              method: 'POST',
              url: ipAddress + '/sticks/delete',
              headers: {
                'Content-Type': 'application/json'
              },
              data: {
                'fs_id': id,
                'u_id': $cookies.get('u_id')
              }
            };

            $http(req).success(function(result){
              // addEvent($http, $window, $cookies.get('u_id'),eCollect,u_id,eFootstep,id);
              $(".stick_footstep").css("background-color","");

              //GET AND REFRESH STICK NUMBER
              $http({method: 'GET', url: ipAddress + '/sticks/search', params: {fs_id: id}})
                  .success(function(data){
                    $('.btnStickNum' + id).html(data.length);
                  });

            }, function(error){
              console.log(error);
            });


          } else {
            var req = {
              method: 'POST',
              url: ipAddress + '/sticks/add',
              headers: {
                'Content-Type': 'application/json'
              },
              data: {
                'fs_id': id,
                'u_id': $cookies.get('u_id')
              }
            };

            $http(req).success(function(result){
              addEvent($http, $window, $cookies.get('u_id'),eCollect,u_id,eFootstep,id, false);
              $(".stick_footstep").css("background-color","#43c17e");

              //GET AND REFRESH STICK NUMBER
              $http({method: 'GET', url: ipAddress + '/sticks/search', params: {fs_id: id}})
                  .success(function(data){
                    $('.btnStickNum' + id).html(data.length);
                  });

            }, function(error){
              console.log(error);
            });
          }
        }, function(error){
          console.log(error);
        });
  };
  
  $http({method: 'GET', url: ipAddress + '/footsteps/getFootstepsDetail', params:{fs_id:$routeParams.footId}})
      .success(function(data){
        console.log('data: ' + (JSON.stringify(data)));
        $scope.foot = data[0];
        $scope.checkUser = $scope.foot.u_id == $cookies.get('u_id')?true:false;
      }, function(error){
        $scope.error = error;
      });

  $http({method: 'GET', url: ipAddress + '/comments/getCommentsByFSID', params:{fs_id:$routeParams.footId}})
      .success(function(data){
        $scope.comments = data;
      }, function(error){
        $scope.error = error;
      });

  $http({method: 'GET', url: ipAddress + '/sticks/getSticksByFSID', params:{fs_id:$routeParams.footId}})
      .success(function(data){
        $scope.sticks = data;
      }, function(error){
        $scope.error = error;
      });


  $scope.backHome = function () {
    window.location.href = '#/foot'
  };

  $scope.loginCheck = function(){
    if($cookies.get('u_id') == undefined){
      return true;
    }
  };


  $scope.followUpBtn = function(id) {

    if($cookies.get('u_id') == undefined){
      $window.location.href = '#/login';
      return;
    }
    
    $http({method: 'GET', url: ipAddress + '/followers/getFollowCheck', params:{u_id:id, fl_fl_id:$cookies.get('u_id')}})
        .success(function(data){
          if(data.length == 0){
            var reqData = {
              u_id: id,
              fl_fl_id: $cookies.get('u_id')
            };
            var req = {
              method: 'POST',
              url: ipAddress + '/followers/add',
              headers: {
                'Content-Type': 'application/json'
              },
              data: reqData
            };

            $http(req).success(function(result){
              addEvent($http, $window, $cookies.get('u_id'),eFollow,id,ePeople,id, true);
            }, function(error){
              console.log(error);
            });
          } else {
            alert("您已经关注成功了.");
          }

        }, function(error){
          $scope.error = error;
        });
  };

  $scope.addComment = {
    cm_content: '',
    fs_id: '',
    u_id: $cookies.get('u_id')
  };

  $scope.submit = function(){

    if($cookies.get('u_id') == undefined){
      $window.location.href = '#/login';
      return;
    }
    
    $scope.addComment.fs_id = $scope.foot.fs_id;
    $scope.addComment.cm_content = CKEDITOR.instances.editor1.getData();
    var req = {
      method: 'POST',
      url: ipAddress + '/comments/add',
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify($scope.addComment)
    };

    // console.log("add comment: " + JSON.stringify(CKEDITOR.instances.editor1.getData()));

    $http(req).success(function(result){
      console.log($scope.foot.u_id + " ; " + $scope.foot.fs_id);
      addEvent($http, $window, $cookies.get('u_id'),eComment,$scope.foot.u_id,eFootstep,$scope.foot.fs_id, true);
    }, function(error){
      console.log(error);
    });
  };



  $scope.switchPic = function(pic) {
    $('.picture-present').attr('src',pic);
  };



  
}]);






// Controllers for account profile management
buybsControllers.controller('ProfileController', ['$scope', '$http', '$window','$cookies','$routeParams','$css', function($scope, $http, $window, $cookies, $routeParams, $css) {

  var data = {
    fs_desc: '',
    fs_from: '',
    fs_pic: '',
    fs_bigImg: '',
    fs_smallImg:''
  };
  $scope.footstep = angular.copy(data);

  $scope.createBtn = function(){
    $window.location.href = "#/footsteps/add";
  };

  $scope.editProfileBtn = function(){
    $window.location.href = "#/profile/edit";
  };

  $scope.bgColorChange = function (divkey) {
    $(".bgColorChange"+divkey).css("background-color",'rgba(239,239,239,0.96)');
  };

  $scope.bgColorRemove = function (divkey) {
    $(".bgColorChange" + divkey).css("background-color",'white');
  };
  
  $scope.isMobile = function (){
    if($(".view-container").width() < (mobileSize - 100)){
      return true;
    }
  };
  
  $http({method: 'GET', url: ipAddress + '/countries/getCountries'})
      .success(function(data){
        console.log('countries: ' + data);
        $scope.countries = data;
      }, function(error){
        $scope.error = error;
      });
  
  $http({method: 'GET', url: ipAddress + '/users/getUserById', params:{u_id:$cookies.get('u_id'),secret:$cookies.get('secret')}})
      .success(function(data){
        console.log('user: ' + data);
        $scope.user = data[0];
      }, function(error){
        $scope.error = error;
      });
  
  $http({method: 'GET', url: ipAddress + '/users/getUserDetail', params:{u_id: $routeParams.u_id,secret:$cookies.get('secret')}})
      .success(function(data){
        $scope.userProfile = data;
      }, function(error){
        $scope.error = error;
      });

  $scope.loadMore = function() {
    $scope.isbusy = true;
    console.log("loadmore= " + $scope.val);
    if($scope.val === 1 && allowScroll === true) {
      $http({
        method: 'GET',
        url: ipAddress + '/footsteps/getFootstepsByUID',
        params: {
          u_id: $cookies.get('u_id'),
          index_start: $scope.footsteps.length,
          count: 5
        }
      }).success(function (data) {
        console.log("loaded = " + data.length);
        if (data.length > 0) {
          for (var i = 0; i < data.length; i++) {
            $scope.footsteps.push(data[i]);
          }
          $scope.isbusy = false;
          displayPosition(500,50);
        } else {
          $scope.isbusy = true;
        }

      }, function (error) {
        $scope.error = error;
      });
    } else if($scope.val === 2 && allowScroll === true){
      $http({
        method: 'GET',
        url: ipAddress + '/footsteps/getStickFootstepsByUID',
        params: {
          u_id: $cookies.get('u_id'),
          index_start: $scope.footsteps.length,
          count: 5
        }
      }).success(function (data) {
        console.log("loaded = " + data.length);
        if (data.length > 0) {
          for (var i = 0; i < data.length; i++) {
            $scope.footsteps.push(data[i]);
          }

          $scope.isbusy = false;
          displayPosition(300,50);
        } else {
          $scope.isbusy = true;
        }
      }, function (error) {
        $scope.error = error;
      });
    }

  };

  $scope.footsteps = [];
  $scope.val = 1;
  $scope.isbusy = false;
  allowScroll = false;
  $http({method: 'GET', url: ipAddress + '/footsteps/getFootstepsByUID', params:{u_id: $cookies.get("u_id"), index_start: 0, count: 12}})
      .success(function(data){
        $scope.footsteps = data;
        $('.follow-list').css("display",'none');
        $(".footstep-list").css("display", "block");
        displayPosition(500,50);
        $scope.results = null;
      }, function(error){
        $scope.error = error;
      });

  
  $scope.profileFootsteps = function(u_id) {
    $scope.footsteps = [];
    $scope.val = 1;
    $scope.isbusy = false;
    allowScroll = true;
    $http({method: 'GET', url: ipAddress + '/footsteps/getFootstepsByUID', params:{u_id: u_id, index_start: 0, count: 12}})
        .success(function(data){
          $scope.footsteps = data;
          $('.follow-list').css("display",'none');
          $(".footstep-list").css("display", "block");
          $scope.results = null;
        }, function(error){
          $scope.error = error;
        });
    displayPosition(500,50);
  };
  
  $scope.profileSticks = function(u_id) {
    $scope.footsteps = [];
    $scope.val = 2;
    $scope.isbusy = false;
    allowScroll = true;
    $http({method: 'GET', url: ipAddress + '/footsteps/getStickFootstepsByUID', params:{u_id: u_id, index_start: 0, count: 12}})
        .success(function(data){
          $scope.footsteps = data;
          $('.follow-list').css("display",'none');
          $(".footstep-list").css("display", "block");
          $scope.results = null;
        }, function(error){
          $scope.error = error;
        });
    displayPosition(500,50);
  };

  $scope.profileFollows = function(u_id) {
    $http({method: 'GET', url: ipAddress + '/followers/getFollowsByUID', params:{u_id: u_id}})
        .success(function(data){
          $scope.results = data;
          $(".footstep-list").css("display", "none");
          $('.follow-list').css("display",'block');
        }, function(error){
          $scope.error = error;
        });
  };

  $scope.profileFans = function(u_id) {
    $http({method: 'GET', url: ipAddress + '/followers/getFansByUID', params:{u_id: u_id}})
        .success(function(data){
          $scope.results = data;
          $(".footstep-list").css("display", "none");
          $('.follow-list').css("display",'block');
        }, function(error){
          $scope.error = error;
        });
  };

}]);

buybsControllers.controller('FootstepAddController', ['$scope', '$cookies', '$window', '$http','$css', function($scope, $cookies, $window, $http, $css){

  if($cookies.get('u_id') == undefined){
    $window.location.href = '#/email_login';
    return;
  }
  // deprecated
  $http({method: 'GET', url: ipAddress + '/countries/getCountries'})
      .success(function(data){
        $scope.countries = data;
      }, function(error){
        $scope.error = error;
      });

  $scope.closeBtn = function() {
    $window.location.href = '#/profile?u_id=' + $cookies.get('u_id');
  };

  var progress = 1;
  var progressBar = function(){
    progress += 1;
    if(progress < 99) {
      $('#myBar').width(progress + "%");
      $('#myBar').text(progress + "%");
    } else {
      clearInterval(progressBar);
    }
  };

  $scope.footstep = {
    fs_pic : '',
    fs_des : '',
    fs_from : '',
    u_id : $cookies.get('u_id'),
    fs_bigImg : '',
    fs_smallImg : '',
    fs_create_time : '',
    fs_update_time : '',
    fs_status : '',
    fs_pic2 : '',
    fs_pic3 : '',
    secret : $cookies.get('secret')
  };


  $scope.submit = function() {
    if($scope.footstep.fs_desc == null){
      alert('描述不能为空');
      return;
    }
    
    var req = {
      method: 'POST',
      url: ipAddress + '/footsteps/create',
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify($scope.footstep)
    };

    console.log(req);

    $http(req).success(function(result){
      if(result.errno){
        alert("创建失败, 请稍后再试.");
      } else {
        alert("恭喜, 创建成功.");
        $window.location.href = '#/profile?u_id=' + $cookies.get('u_id');
      }
    }, function(error){
      console.log(error);
    });
  };

  $scope.uploadFile = function(file, num) {
      progress = 1;
      console.log('upload file');
      setInterval(progressBar, 20);

      var file_data = $(file).prop('files')[0];
      var form_data = new FormData();
      form_data.append('u_id', $cookies.get('u_id'));
      form_data.append("file", file_data);

      $.ajax({
        url: ipAddress + "/api/uploadPhotos",
        contentType: false,
        data: form_data,
        processData: false,
        cache: false,
        type: "POST",
        success: function (res) {
          $('#myBar').width("100%");
          $('#myBar').text('上传完成!');
          console.log('successfully uploaded, URL: ' + res);
          $(file).parent().css("min-height", '0px');
          $('.present_picture').attr('src', res.bigImg);
          $('.footstep_pic' + num).attr('src', res.bigImg);
          
          if(num == 0) {$scope.footstep.fs_pic = res.bigImg; $scope.footstep.fs_smallImg = res.smallImg; $scope.footstep.fs_bigImg = res.bigImg;}
          if(num == 2) $scope.footstep.fs_pic2 = res.bigImg;
          if(num == 3) $scope.footstep.fs_pic3 = res.bigImg;
          
          $(file).css("display", "none");
          $('.footstep_pic_btn' + num).css("display", 'none');
          $('.footstep_pic' + num).css('display', 'inline-block');
        },
        error: function(res) {
          $('#myBar').text('上传失败!');
        }
      });
  };

  $scope.switchPic = function(pic) {
    $('.present_picture').attr('src', pic);
  };



}]);

buybsControllers.controller('ProfileEditController', ['$scope', '$cookies', '$window', '$http','$css', function($scope, $cookies, $window, $http, $css){

  $scope.closeBtn = function() {
    $window.location.href = '#/profile?u_id=' + $cookies.get('u_id');
  };

  $http({method: 'GET', url: ipAddress + '/users/getUserById', params:{u_id:$cookies.get('u_id'),secret:$cookies.get('secret')}})
      .success(function(data){
        $scope.user = data[0];
      }, function(error){
        $scope.error = error;
      });

  $scope.updateSubmit = function() {
    var reqData = {
      u_name: $scope.user.u_name,
      u_avatar: $scope.user.u_avatar,
      u_link: $scope.user.u_link,
      u_slogan: $scope.user.u_slogan,
      u_id: $scope.user.u_id,
      secret: $cookies.get('secret')
    };

    var req = {
      method: 'POST',
      url: ipAddress + '/users/update',
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(reqData)
    };

    $http(req).success(function(result){
      if(result.errno){
        alert("更新失败, 请稍后再试.");
      } else {
        $window.location.href = '#/profile?u_id=' + $cookies.get('u_id');
      }
    }, function(error){
      console.log(error);
    });
  };

  $scope.uploadAvatar = function(file) {
    console.log('upload file');
    var file_data = $(file).prop('files')[0];
    var form_data = new FormData();
    form_data.append('u_id', $cookies.get('u_id'));
    form_data.append("file", file_data);

    $.ajax({
      url:  ipAddress + "/api/uploadAvatar",
      contentType: false,
      data: form_data,
      processData: false,
      cache: false,
      type: "POST",
      success: function (res) {
        console.log('uploaded, URL: ' + res);
        $('.profile_top_info-avatar-div_img').attr('src', res);
        $scope.user.u_avatar = res;
      }
    });
  };

}]);




// Controller for other features.
buybsControllers.controller('WelcomeCtrl', ['$scope', '$cookies', '$window','$css', function($scope, $cookies, $window, $css){

  $scope.isMobile = function (){
    if($(".view-container").width() < (mobileSize - 100)){
      return true;
    }
  };

  if($(".view-container").width() < (mobileSize - 100)){

    $scope.items = [{
      src: 'http://o99spo2ev.bkt.clouddn.com/images/big/21/1473346832363.jpg',
      title: "分享图片, 交流经验, 寻找伙伴",
      content: "上传，管理，分享，评论，社区，图友约伴一体化，这里是旅行爱好者的大本营. ",
      position: "-220px",
      padding: "30% 30% 10% 9%",
      color: 'white'
    },
      {
        src: 'http://o99spo2ev.bkt.clouddn.com/images/big/21/1473335616052.jpeg',
        title: "分享图片",
        content: "" +
        "" +
        "图友社区汇聚了世界各地的旅行目的地图片, 通过快速搜素，图友社区将为你展示最丰富，最全面，最值得去的旅行目的地. ",
        position: "-220px",
        padding: "30% 30% 10% 9%",
        color: 'crimson'
      },
      {
        src: 'http://o99spo2ev.bkt.clouddn.com/images/big/21/1473346609808.jpg',
        title: "交流经验",
        content: "图友社区汇聚了世界各地的旅行经验分享与常见问题解决方案, 图友们相互分享，相互交流，让彼此的旅行变的更容易，让旅行体验最大化.",
        position: "-220px",
        padding: "30% 30% 10% 9%",
        color: ''
      },
      {
        src: 'http://o99spo2ev.bkt.clouddn.com/images/big/47/1473604143983.JPG',
        title: "寻找伙伴",
        content: "让旅行不再孤单. 图友约伴将根据你的所在位置，停留时间去匹配同样时间，同样地点的图友. 让约伴更容易, 让旅行不再孤单. ",
        position: "-220px",
        padding: "30% 30% 10% 9%",
        color: 'white'
      },
      {
        src: 'http://o99spo2ev.bkt.clouddn.com/images/big/47/1474806207636.jpeg',
        title: "图友社区",
        content: "汇聚每一个爱旅行的人，构建一个绿色，和谐，友爱的社区, 彼此交流，分享，让旅行变的更容易. ",
        position: "-220px",
        padding: "30% 30% 10% 9%",
        color: 'lawngreen'
      }
    ];
  } else {

    $scope.items = [{
      src: 'http://o99spo2ev.bkt.clouddn.com/wel-header.jpg',
      title: "分享图片, 交流经验, 寻找伙伴",
      content: "上传，管理，分享，评论，社区，图友约伴一体化，这里是旅行爱好者的大本营. ",
      color: 'white',
      style: 'height: 100%; color: white; text-align: center; padding: 40px; background-position-y: -200px;'
    },
      {
        src: 'http://o99spo2ev.bkt.clouddn.com/wel_image5.JPG',
        title: "分享图片",
        content: "图友社区汇聚了世界各地的旅行目的地图片, 通过快速搜素，图友社区将为你展示最丰富，最全面，最值得去的旅行目的地. ",
        color: 'crimson'
      },
      {
        src: 'http://o99spo2ev.bkt.clouddn.com/wel_image3.JPG',
        title: "交流经验",
        content: "图友社区汇聚了世界各地的旅行经验分享与常见问题解决方案, 图友们相互分享，相互交流，让彼此的旅行变的更容易，让旅行体验最大化.",
        color: 'white'
      },
      {
        src: 'http://o99spo2ev.bkt.clouddn.com/wel_image4.JPG',
        title: "寻找伙伴",
        content: "让旅行不再孤单. 图友约伴将根据你的所在位置，停留时间去匹配同样时间，同样地点的图友. 让约伴更容易, 让旅行不再孤单. ",
        color: ''
      },
      {
        src: 'http://o99spo2ev.bkt.clouddn.com/wel_image2.JPG',
        title: "图友社区",
        content: "汇聚每一个爱旅行的人，构建一个绿色，和谐，友爱的社区, 彼此交流，分享，让旅行变的更容易. ",
        color: ''
      }
    ];
  }

}]);

buybsControllers.controller('headerController', ['$scope', '$cookies', '$window','$http', function($scope, $cookies, $window,$http){

  $scope.homepageBtn = function() {
    // $('.view-frame').css('display','none');
    $window.location = '#/foot/';

  };

  $scope.logout = function(){
    console.log("remove cookies");
    $cookies.remove('username');
    $cookies.remove('u_id');
    $cookies.remove('u_avatar');
    $cookies.remove('secret');
    $window.location.href = '#/foot';
    $window.location.reload();
  };

  $http({method: 'GET', url: ipAddress + '/notifications/getNotifications', params:{u_id: $cookies.get('u_id')}})
      .success(function(data){
        $scope.notifications = data;
        var newmsgShow = false;
        $scope.notifications.forEach(function (item, index) {
          // alert(item);
          for(var key in item) {
            // alert(key + " ; " + item[key]);
            if(key === 'nf_status' && item[key] == 0){
              newmsgShow = true;
              return;
            }
          }
        });
        // alert(newmsgShow);
        if(newmsgShow) {
          $('.newmsg').css("display","block");
        }else{
          $('.newmsg').css("display","none");
        }
      },function(error){
        $scope.error = error;
      });

  $scope.linkTo = function(type, c_id, nf_id) {

    $http({method: 'POST', url: ipAddress + '/notifications/consume', params: {nf_id: nf_id}})
        .success(function(data){
          if(type === '足迹'){
            $window.location.href = '#/foot/' + c_id;
          } else {
            $window.location.href = '#/community/topics/' + c_id;
          }
        }, function(error){
          $scope.error = error;
        });

  };


}]);

buybsControllers.controller('MessageController', ['$scope', '$cookies', '$window', '$http', '$css', function($scope, $cookies, $window, $http, $css){

  if($cookies.get('u_id') == undefined){
    $window.location.href = '#/login';
    return;
  }

  $scope.message = {
    u_id: $cookies.get('u_id'),
    m_content: ''
  };

  $scope.submit = function(){

    var req = {
      method: 'POST',
      url: ipAddress + '/messages/add',
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify($scope.message)
    };

    $http(req).success(function(result){
      alert("留言发送成功.");
      $window.history.back();
    }, function(error){
      console.log(error);
    });
  };


  $scope.closeTopic = function() {
    $window.history.back();
  };


}]);

buybsControllers.controller('AboutController', ['$scope', '$cookies', '$window', '$http', '$css', function($scope, $cookies, $window, $http, $css){

}]);













