'use strict';

angular
    .module('jk_backend')
    .directive('zoom', function(){
        function link(scope, element, attrs){
            var $ = angular.element;
            var original = $(element[0].querySelector('.original'));
            var originalImg = original.find('img');
            var zoomed = $(element[0].querySelector('.zoomed'));
            var zoomedImg = zoomed.find('img');

            var mark = $('<div class="zoomed"></div>')
                .addClass('mark')
                .css('position', 'absolute')
                .css('height', scope.markHeight +'px')
                .css('width', scope.markWidth +'px');
            // .css('top', '200px');

            $(element).append(mark);

            element
                .on('mouseenter', function(evt){
                    mark.removeClass('hide');

                    var offset = calculateOffset(evt);
                    moveMark(offset.X, offset.Y);
                })
                .on('mouseleave', function(evt){
                    mark.addClass('hide');
                })
                .on('mousemove', function(evt){
                    var offset = calculateOffset(evt);
                    moveMark(offset.X, offset.Y);
                });

            scope.$on('mark:moved', function(event, data){
                updateZoomed.apply(this, data);
            });
            var firstMove = 1;
            var firstX;
            var firstY = 80;
            function moveMark(offsetX, offsetY){

                if(firstMove === 1) {
                    firstX = (scope.windowSize - 800)/2;
                    firstMove++;
                }
                console.log("offsetX: " + offsetX + " < " + firstX + " && " + offsetY + " < " + firstY);
                if(offsetX < firstX || offsetY < firstY) {
                    mark.addClass('hide');
                } else {
                    mark.removeClass('hide');
                }


                var  x = offsetX;
                var  y = offsetY;
                mark
                    .css('left', x + 'px')
                    .css('top',  y + 'px');

                scope.$broadcast('mark:moved', [
                    x - (scope.windowSize - 800)/2 + 20, y - 180, originalImg[0].height, originalImg[0].width
                ]);
            }

            function updateZoomed(originalX, originalY, originalHeight, originalWidth){
                var zoomLvl = scope.zoomLvl;
                scope.$apply(function(){
                    // zoomed
                    //     .css('height', '200px')
                    //     .css('width', '100%')
                    //     .css('margin-top','30px');
                    zoomedImg
                        .attr('src', scope.src)
                        .css('height', zoomLvl*originalHeight+'px')
                        .css('width', zoomLvl*originalWidth+'px')
                        .css('left',-zoomLvl*originalX +'px')
                        .css('top',-zoomLvl*originalY +'px');
                });

            }

            var rect;
            function calculateOffset(mouseEvent){
                rect = rect || mouseEvent.target.getBoundingClientRect();
                var offsetX = mouseEvent.clientX - 50;
                var offsetY = mouseEvent.clientY - 90;
                console.log("X: " + offsetX + ", Y: " + offsetY);
                return {
                    X: offsetX,
                    Y: offsetY
                }
            }

            attrs.$observe('ngSrc', function(data) {
                scope.src = attrs.ngSrc;
            }, true);


            attrs.$observe('zoomLvl', function(data) {
                scope.zoomLvl =  data;
            }, true);
        }

        return {
            restrict: 'EA',
            scope: {
                windowSize: '@windowSize',
                markHeight: '@markHeight',
                markWidth: '@markWidth',
                src: '@src',
                zoomLvl: "@zoomLvl"
            },
            template: [
                '<div class="original">',
                '<img style="width: 100%; height: 100%; cursor: zoom-in;" ng-src="{{src}}"/>',
                '</div>',
                '<div class="zoomed">',
                '<img/>',
                '</div>'
            ].join(''),
            link: link
        };
    });