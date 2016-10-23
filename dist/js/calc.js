jQuery(document).ready(function ($) {
    /*===================================== GLOBAL VARIABLES ================================================*/
    var $list = $('.b-calc__list'), //список элементов
        $btn = $list.find('.b-calc__item--btn'), //родительские блоки (кнопки)
        $target = $list.find('.b-calc__item--target'), //целевые блоки
        $panel = $('.bcl-panel'); //итоговый блок


    /*=========================================== DATA ======================================================*/
    var data = []; //в этом массиве будут храниться все выбранные значения (в нулевом элементе - общие для всего проекта (период, сервис, скидка))


    /*=========================================== MODEL =====================================================*/
    var model = {
        isInit: false,
        time: 0,
        timeName:'',
        service: 0,
        serviceName:'',
        discount: 0,
        total: 0,
        countBlocks : 0,

        initData: function () {//формируем массив данных
            model.getProjectTime();
            model.getProjectService();
            var main = {
                'Time': model.time,
                'TimeName': model.timeName,
                'Service': model.service,
                'ServiceName': model.serviceName,
                'Discount': model.discount,
                'Total': model.total
            };
            data.push(main);

            $btn.each(function () {
                var index = parseInt($(this).data('item')),
                    name = $(this).find('.b-calc__title').text().trim();
                item = { 'Index': index, 'Name': name, 'Items': [], 'Price': 0 };
                data.push(item);
                model.countBlocks++;
            });
            model.isInit = true;
            console.log(data);
        },

        getProjectTime: function () {//меняем значение переменных периода
            var $el = $target.filter(':first').find('.js-time-radio').filter(':checked');
            model.time = $el.val();
            model.timeName = $el.next('label').text();
        },

        getProjectService: function () {//меняем значения переменных сервиса
            var $el = $target.filter(':first').find('.js-service-radio').filter(':checked');
            model.service = $el.val();
            model.serviceName = $el.next('label').text();
        },

        recalcTotal: function () {
            model.total = 0;
            var subtotal = 0;
            for (var i = 1; i < model.countBlocks; i++) {
                var arr = data[i].Items;
                if (arr.length > 0) {
                    subtotal = subtotal + parseInt(data[i].Price);
                };
            };
            model.total = subtotal;
        },

        writeMeta: function () {//запишем общие для всех целевых блоков значения в массив данных
            if (model.isInit) {
                data[0].Time = model.time;
                data[0].TimeName = model.timeName;
                data[0].Service = model.service;
                data[0].ServiceName = model.serviceName;
                data[0].Total = model.total;
            }
        },

        recalcBlock: function (block) {
            var index = parseInt(block.data('item')),
                $item = block.find('.bcl__list').children('li'),
                content = '',
                arr = data[index].Items;
            data[index].Price = 0;
            arr.length = 0; //стерли старые данные

            $item.each(function () {
                var $elem = $(this),
                    $check = $(this).find('input[type=checkbox]');
                $check.each(function () {
                    if ($(this).is(':checked')) {
                        var price = parseInt($(this).val()),
                            level = $(this).next('label').text(),
                            count = parseInt($(this).parents('.bcl__row').find('.js-count-input').val()),
                            position = $elem.find('.bcl__subtitle').text().trim();
                        arr.push({
                            'Position': position,
                            'Level': level,
                            'Price': price,
                            'Count': count
                        });
                        data[index].Price = data[index].Price + price * count;
                    }
                });
            });
        },

        init: function () {
            this.initData();
        }
    };

    /*=========================================== VIEW ======================================================*/
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

        clickList: (function () { //клик по блокам - покажем / спрячем целевые блоки
            var msnr = $('.bcl__list'),
                activeClass = 'active',
                method = {};

            method.showItem = function(el, index) {
                el.addClass(activeClass);
                $target.filter('[data-item=' + index + ']').fadeIn();
                msnr.masonry();
            };

            method.hideItem = function(el, index) {
                el.removeClass(activeClass);
                $target.filter('[data-item=' + index + ']').hide();
            };

            method.hideAllItem = function() {
                $target.hide();
                $btn.removeClass(activeClass);
            };

            method.init = function () {
                msnr.masonry({ //натравим Masonry на внутренний список, чтобы добиться эффекта пятнашек при клике
                    itemSelector: '.bcl__item',
                    percentPosition: true
                });

                $btn.on('click', function () {
                    var $el = $(this),
                        index = $el.data('item');

                    if ($(this).hasClass('active')) {
                        method.hideItem($el, index);
                    } else {
                        method.hideAllItem();
                        method.showItem($el, index);
                    };
                    view.stickyPanel.recalc();
                });

                $target.on('click', '.bcl__close', function () {
                    method.hideAllItem();
                });

                $('.bcl').on('click', '.bcl__wrap', function () {
                    $(this).parent().toggleClass(activeClass);
                    msnr.masonry();
                });
            };     
            return method;
        })(),

        countInput: (function () {//валидация полей ввода кол-ва сотрудников (только целые числа >=1)
            var $input = $('.js-count-input'),
                method = {};

            method.checkInput = function (el) {
                var num = Math.round(el.val()),
                    error = false;
                if (isNaN(num)) {
                    num = 1;
                    error = true;
                };
                el.val(num);
            };

            method.showError = function (el) {//покажем что в поле была ошибка - на 2 сек. выделим поле красным
                el.addClass('error');
                setTimeout(function () {
                    el.removeClass('error');
                }, 2000);
            };

            method.init = function () {
                $input.on('keydown', function (e) {//разрешим вводить только цифры
                    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                        (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
                        (e.keyCode >= 35 && e.keyCode <= 40)) {
                        return;
                    }
                    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                        e.preventDefault();
                    }
                });

                $input.on('blur', function () {
                    var $el = $(this);
                    method.checkInput($el);
                });
                //$input.on('blur', method.checkInput($(this)));
            };
            return method;
        })(),

        stickyPanel: (function () {//на десктопе будем фиксировать панель в сайдбаре при скролле
            var $parent = $('.b-calc'),
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

        writeToBlock: function (block) {//выведем промежуточные данные в блок
            var content = '',
                index = parseInt(block.data('item')),
                arr = data[index].Items,
                count = arr.length;
            if (count > 0) {
                for (var i = 0; i < count; i++) {
                    content = content +'<p>'+ arr[i].Position + ', ' + arr[i].Level + ', <b>' + arr[i].Count + '</b>, ' + arr[i].Price + '$ per month</p>';
                }
            }
            block.find('.bcl__data').html(content);
        },

        writeToPanel: function(){
            var $main_panel = $panel.find('.bcl-panel__inner--main dl'),
                $plan_panel = $panel.find('.bcl-panel__inner--plan dl'),
                $sale_panel = $panel.find('.bcl-panel__inner--sale dl'),
                $total = $panel.find('.bcl-total__price');
            
            var main = '';
            for (var i = 1; i < model.countBlocks; i++) {
                var price = data[i].Price;
                if (price > 0) {
                    main = main + '<dt>' + data[i].Name + '</dt><dd>' + price + '</dd>';
                }
            }
            $main_panel.html(main);

            var plan = '<dt>' + data[0].ServiceName + '</dt><dd>' + data[0].Service + '</dd>';
            $plan_panel.html(plan);
            $total.text(model.total);
        },

        init: function () {
            this.sortList.init();
            this.clickList.init();
            this.countInput.init();
            this.stickyPanel.init();
        }
    };


    /*======================================== CONTROLLER ===================================================*/
    var controller = {
        changeTime: function () { //Время (период) одинаковое для всего проекта - изменим значения в каждом целевом блоке при изменении в любом из них
            $('.js-time-radio').on('change', function () {
                var value = $(this).val();
                $target.each(function () {
                    var $radio = $(this).find('.js-time-radio'),
                        count = $radio.length;
                    for (var i = 0; i < count; i++) {
                        if ($radio.eq(i).val() == value) {
                            $radio.eq(i).prop('checked', true);
                            break;
                        }
                    }
                });
                model.getProjectTime();
                model.recalcTotal();
                model.writeMeta();
                view.writeToPanel();
            });
        },

        changeService: function () {//Сервис един для всего проекта - изменим значения в каждом целевом блоке при изменении в любом из них
            $('.js-service-radio').on('change', function () {
                var value = $(this).val();
                $target.each(function () {
                    var $radio = $(this).find('.js-service-radio'),
                        count = $radio.length;
                    for (var i = 0; i < count; i++) {
                        if ($radio.eq(i).val() == value) {
                            $radio.eq(i).prop('checked', true);
                            break;
                        }
                    }
                });
                model.getProjectService();
                model.recalcTotal();
                model.writeMeta();
                view.writeToPanel();
            });
        },

        changeCheckBox: function () { //изменение чекбокса в целевом блоке
            var $check = $target.find('.bcl__list').find('input[type=checkbox]');
            $check.on('change', function () {
                var $block = $(this).parents('.bcl');
                model.recalcBlock($block);
                view.writeToBlock($block);
                model.recalcTotal();
                model.writeMeta();
                view.writeToPanel();
            });
        },

        changeCountInput: function () {//изменение значения кол-ва сотрудников в целевом блоке
            var $input = $target.find('.js-count-input');
            $input.on('change', function () {
                var $row = $(this).parents('.bcl__row'),
                    $check = $row.find('input[type=checkbox]');
                if ($check.is(':checked')) {
                    var $block = $row.parents('.bcl');
                    model.recalcBlock($block);
                    view.writeToBlock($block);
                    model.recalcTotal();
                    model.writeMeta();
                    view.writeToPanel();
                }
            });
        },

        resetInit: function(){//нажатие на кнопку резет
            $target.on('click', '.bcl__reset', function () {//очистка одного целевого блока
                var $block = $(this).parent('.bcl');
                resetBlock($block);
                model.recalcBlock($block);
                view.writeToBlock($block);
                model.recalcTotal();
                model.writeMeta();
                view.writeToPanel();
            });

            $('.bcl-panel').on('click', '.bcl-panel__reset', function () {//очистка всех блоков
                $target.each(function () {
                    resetBlock($(this));
                    model.recalcBlock($(this));
                    view.writeToBlock($(this));
                });
                $target.filter(':first').find('.js-time-radio').filter(':first').trigger('click');
                $target.filter(':first').find('.js-service-radio').filter(':first').trigger('click');
                view.clickList.hideAllItem();
                model.recalcTotal();
                model.writeMeta();
                view.writeToPanel();
            });

            function resetBlock(block) {
                var $list = block.find('.bcl__list'),
                    $chk = $list.find('input[type=checkbox]'),
                    $input = $list.find('input[type=text]');
                $chk.each(function () {
                    $(this).attr('checked', false);
                });
                $input.each(function () {
                    $(this).val(1);
                });
            };
        },

        init: function () {
            model.init();
            view.init();
            this.changeTime();
            this.changeService();
            this.changeCheckBox();
            this.changeCountInput();
            this.resetInit();
        }
    };
    
    controller.init();
   
});