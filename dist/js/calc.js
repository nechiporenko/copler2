jQuery(document).ready(function ($) {
    //Global variables
    var $list = $('.b-calc__list'),
        $btn = $list.find('.b-calc__item--btn'),
        $target = $list.find('.b-calc__item--target');

    /*============================================ VIEW =====================================================*/
    var view = {
        sortList: (function () { //будем сортировать главный список в зависимости от разрешения экрана таким образом, чтобы целевые блоки открывались на нужных рядах
            var count = $btn.length,
                lastWinW = $.viewportW(),
                rtime,
                timeout = false,
                delta = 200,
                method = {};

            method.recalc = function (winW) {
                if (winW < 480) {
                    resortList(1);
                };
                if (winW >= 480 && winW < 640) {
                    resortList(2);
                };
                if (winW >= 640) {
                    resortList(3);
                };

                function resortList(index) {
                    $btn.each(function () {
                        var num = parseInt($(this).data('item')),
                            $el = $target.filter('[data-item=' + num + ']');
                        
                        var targetNum = index * Math.ceil(num / index);
                        if (targetNum > count) {
                            targetNum = count;
                        };
                        if (parseInt($el.prev('li').data('item')) != targetNum) {//если не в том порядке в каком нужно
                            var content = $el.detach();
                            $btn.filter('[data-item=' + targetNum + ']').after(content);
                        }                     
                    });
                };
            };

            method.endResize = function () {
                if (new Date() - rtime < delta) {
                    setTimeout(method.endResize, delta);
                } else {
                    timeout = false;
                    var winW = $.viewportW();
                    if (winW !== lastWinW) {
                        lastWinW = winW;
                        method.recalc(winW);
                    }
                }
            };

            method.startResize = function () {
                rtime = new Date();
                if (timeout === false) {
                    timeout = true;
                    setTimeout(method.endResize, delta);
                }
            };

            method.init = function () {
                method.recalc(lastWinW);
                $(window).bind('resize', method.startResize);
            };

            return method;
        })(),

        listBtnClick: function () { //клик по блокам - покажем / спрячем целевые блоки
            var msnr = $('.bcl__list'),
                activeClass = 'active';

            msnr.masonry({ //натравим Masonry на внутренний список, чтобы добиться эффекта пятнашек при клике
                itemSelector: '.bcl__item',
                percentPosition: true
            });

            $btn.on('click', function () {
                var $el = $(this),
                    index = $el.data('item');

                if ($(this).hasClass('active')) {
                    hideItem($el, index);
                } else {
                    hideAllItem();
                    showItem($el, index);
                };
                view.stickyPanel.recalc();
            });

            function showItem(el, index) {
                el.addClass(activeClass);
                $target.filter('[data-item=' + index + ']').fadeIn();
                msnr.masonry();
            };

            function hideItem(el, index) {
                el.removeClass(activeClass);
                $target.filter('[data-item=' + index + ']').hide();
            };

            function hideAllItem() {
                $target.hide();
                $btn.removeClass(activeClass);
            };

            $target.on('click', '.bcl__close', function () {
                hideAllItem();
            });

            $('.bcl').on('click', '.bcl__wrap', function () {
                $(this).parent().toggleClass(activeClass);
                msnr.masonry();
            });
        },

        stickyPanel: (function () {
            var $parent = $('.b-calc'),
                $panel = $('.bcl-panel'),
                lastWinW = $.viewportW(),
                waypoint,
                rtime,
                timeout = false,
                delta = 300,
                isStick = false,
                method = {};

            method.check = function (winW) {
                if (winW >= 992 && !isStick) {
                    method.set();
                };
                if (winW < 992 && isStick) {
                    method.unset();
                }
            };
            method.set = function () {        
                $panel.stick_in_parent({
                    parent: $parent,
                    offset_top: 80,
                });
                isStick = true;
            };
            method.unset = function () {
                $panel.trigger("sticky_kit:detach");
                isStick = false;
            };

            method.recalc = function () {
                if (isStick) {
                    $panel.trigger("sticky_kit:recalc");
                }
            };

            method.endResize = function () {
                if (new Date() - rtime < delta) {
                    setTimeout(method.endResize, delta);
                } else {
                    timeout = false;
                    var winW = $.viewportW();
                    if (winW !== lastWinW) {
                        lastWinW = winW;
                        method.check(winW);
                    }
                }
            };
            method.startResize = function () {
                rtime = new Date();
                if (timeout === false) {
                    timeout = true;
                    setTimeout(method.endResize, delta);
                }
            };
            method.init = function () {
                method.check(lastWinW);
                $(window).bind('resize', method.startResize);
            }
            return method;
        })(),

        init: function () {
            this.sortList.init();
            this.listBtnClick();
            this.stickyPanel.init();
        }
    };


    /*======================================== CONTROLLER ===================================================*/
    var controller = {
        resetBlock: function (block) {
            var $list = block.find('.bcl__list'),
                    $chk = $list.find('input[type=checkbox]'),
                    $input = $list.find('input[type=text]');
            $chk.each(function () {
                $(this).attr('checked', false);
            });
            $input.each(function () {
                $(this).val(1);
            });
        },
        resetBlockClick: function () {
            $target.on('click', '.bcl__reset', function () {
                var $block = $(this).parent('.bcl');
                controller.resetBlock($block);
            });
            
        },
        allBlocksReset: function () {
            $('.bcl-panel').on('click', '.bcl-panel__reset', function () {
                $target.each(function () {
                    controller.resetBlock($(this));
                });
            });
        },
        init: function () {
            view.init();
            this.resetBlockClick();
            this.allBlocksReset();
        }
    };
    
    controller.init();
   
});