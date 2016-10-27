jQuery(document).ready(function ($) {
    'use strict'
    /*===================================== GLOBAL VARIABLES ================================================*/
    var $list = $('.b-calc__list'), //список элементов
        $btn = $list.find('.b-calc__item--btn'), //родительские блоки (кнопки)
        $target = $list.find('.b-calc__item--target'), //целевые блоки
        $panel = $('.bcl-panel'); //итоговый блок


    /*=========================================== DATA ======================================================*/
    var data = [], //в этом массиве будут храниться все выбранные значения (в нулевом элементе - общие для всего проекта (период, сервис, скидка))
        sale = discountTable || []; //считываем таблицу скидок со страницы


    /*=========================================== MODEL =====================================================*/
    var model = {
        isInit: false,
        time: 0, //период (1, 2, 3, 4, 5)
        timeName:'', //название периода ('1 year', '2 years'...)
        service: 0, //начальная стоимость сервиса
        serviceName:'', //название сервис-плана ('Basic', 'Standart', ...)
        serviceLevel: 0, //итоговая цена сервиса (начальная цена * общее кол-во специалистов)
        discount: 0, //подсчитаем сумму скидки (применим только к serviceLevel !!!)
        total: 0, //общая цена
        countHeads: 0, //общее кол-во персонала
        countBlocks : 0, //будем хранить закешированное кол-во целевых блоков

        initData: function () {//формируем массив данных
            model.getProjectTime();
            model.getProjectService();
            var main = { //в нулевом элементе массива будем хранить общие для проекта данные
                'Time': model.time,
                'TimeName': model.timeName,
                'Service': model.service, //начальная цена сервиса (за одного специалиста)
                'ServiceName': model.serviceName,
                'ServiceLevel': model.serviceLevel,
                'Discount': model.discount, //сумма скидки
                'Heads': model.countHeads, //общее кол-во "нанятых" сотрудников - нужно для подсчета скидки
                'Total': model.total
            };
            data.push(main);

            $btn.each(function () {//индекс остальных элементов массива соответствует data-item целевого блока. ВАЖНО - data-item должны начинаться с 1 !!!!!
                var index = parseInt($(this).data('item')),
                    name = $(this).find('.b-calc__title').text().trim(),
                    item = {};
                item = { 'Index': index, 'Name': name, 'Items': [], 'Price': 0, 'Heads':0 }; //в массив  Items запишем данные из дочерних блоков целевого блока
                data.push(item);
                model.countBlocks++;
            });
            model.isInit = true;
        },

        getProjectTime: function () {//определяем значение переменных периода
            var $el = $target.filter(':first').find('.js-time-radio').filter(':checked');
            model.time = $el.val();
            model.timeName = $el.next('label').text();
        },

        getProjectService: function () {//определяем значения переменных сервиса
            var $el = $target.filter(':first').find('.js-service-radio').filter(':checked');
            model.service = $el.val();
            model.serviceName = $el.next('label').text();
        },

        recalcTotal: function () { //подсчет итоговых значений
            model.total = 0;
            model.countHeads = 0;
            model.serviceLevel = 0;
            for (var i = 1; i <= model.countBlocks; i++) {
                model.total = model.total + parseInt(data[i].Price);
                model.countHeads = model.countHeads + parseInt(data[i].Heads);
            };
            this.calcDiscount();
            model.serviceLevel = model.service * model.countHeads;
            model.total = model.total + Math.floor(model.serviceLevel * model.discount);
        },

        calcDiscount: function () {
            var discount = 0;
            for (var i = sale.length - 1; i >= 0; i--) {
                if (model.countHeads >= sale[i].min && model.countHeads <= sale[i].max) {
                    discount = sale[i].discount[model.time - 1];
                    break;
                }
            }
            model.discount = (100 - discount) / 100;
        },

        writeMeta: function () {//запишем общие для всех целевых блоков значения в нулевой элемент массива данных
            if (model.isInit) {
                data[0].Time = model.time;
                data[0].TimeName = model.timeName;
                data[0].Service = model.service;
                data[0].ServiceName = model.serviceName;
                data[0].ServiceLevel = model.serviceLevel;
                data[0].Discount = model.discount;
                data[0].Heads = model.countHeads;
                data[0].Total = model.total;
            }
        },

        recalcBlock: function (block) {//пересчитаем целевой блок
            var index = parseInt(block.data('item')),
                $item = block.find('.bcl__list').children('li'),
                content = '';

            data[index].Price = 0;//стерли старые данные
            data[index].Heads = 0;
            data[index].Items.length = 0;

            $item.each(function () {//проходим по всем дочерним блокам целевого блока
                var $elem = $(this),
                    $check = $(this).find('input[type=checkbox]');
                $check.each(function () {
                    if ($(this).is(':checked')) {
                        var price = parseInt($(this).val()),
                            level = $(this).next('label').text(),
                            count = parseInt($(this).parents('.bcl__row').find('.js-count-input').val()),
                            position = $elem.find('.bcl__subtitle').text().trim();
                        data[index].Items.push({
                            'Position': position,
                            'Level': level,
                            'Price': price,
                            'Count': count
                        });
                        data[index].Price = data[index].Price + price * count;
                        data[index].Heads = data[index].Heads + count;
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

        clickList: (function () { //клик по "родительским" блокам - покажем / спрячем целевые блоки
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
                $panel.addClass('g-invisible');
                method.check(lastWinW);
                $(window).bind('resize', method.startResize);
            }
            return method;
        })(),

        writeToBlock: function (block) {//выведем промежуточные данные в целевой блок
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

        writeToPanel: function () {//выведем итоговую информацию в панель сайдбара
            if (model.total > 0) {
                $panel.removeClass('g-invisible');
            } else {
                $panel.addClass('g-invisible');
            }

            var $main_panel = $panel.find('.bcl-panel__inner--main dl'),
                $plan_panel = $panel.find('.bcl-panel__inner--plan dl'),
                $sale_panel = $panel.find('.bcl-panel__inner--sale dl'),
                $total = $panel.find('.bcl-total__price');
            
            var main = '';
            for (var i = 1; i <= model.countBlocks; i++) {
                var price = data[i].Price;
                if (price > 0) {
                    main = main + '<dt>' + data[i].Name + '</dt><dd>' + price + '</dd>';
                }
            }
            $main_panel.html(main);

            var plan = '<dt>' + model.serviceName + '</dt><dd>' + model.serviceLevel + '</dd>';
            $plan_panel.html(plan);

            var discount = '<dt>Discount</dt><dd>-' + (model.serviceLevel - Math.floor(model.serviceLevel * model.discount)) + '</dd>';
            $sale_panel.html(discount);

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
                model.getProjectTime();//записали новое значение времени в модель
                model.recalcTotal(); //пересчитали итоговую сумму
                model.writeMeta(); //записали данные в итоговый массив
                view.writeToPanel(); //вывели новые значения в панель
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
                model.getProjectService();//записали новое значение сервиса в модель
                model.recalcTotal();//пересчитали итоговую сумму
                model.writeMeta();//записали данные в итоговый массив
                view.writeToPanel();//вывели новые значения в панель
            });
        },

        changeCheckBox: function () { //изменение чекбокса в целевом блоке
            var $check = $target.find('.bcl__list').find('input[type=checkbox]');
            $check.on('change', function () {
                var $block = $(this).parents('.bcl');
                model.recalcBlock($block);//пересчитали блок
                view.writeToBlock($block);//вывели промежуточные данные в блок
                model.recalcTotal();//пересчитали итоговую сумму
                model.writeMeta();//записали данные в итоговый массив
                view.writeToPanel();//вывели новые значения в панель
            });
        },

        changeCountInput: function () {//изменение значения кол-ва сотрудников в целевом блоке
            var $input = $target.find('.js-count-input');
            $input.on('change', function () {
                var $row = $(this).parents('.bcl__row'),
                    $check = $row.find('input[type=checkbox]');
                if ($check.is(':checked')) {//если стоит галочка возле инпута
                    var $block = $row.parents('.bcl');
                    model.recalcBlock($block);//пересчитали блок
                    view.writeToBlock($block);//вывели промежуточные данные в блок
                    model.recalcTotal();//пересчитали итоговую сумму
                    model.writeMeta();//записали данные в итоговый массив
                    view.writeToPanel();//вывели новые значения в панель
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
    
    controller.init();  //точка входа в приложение



    /*======================================== SEND DATA ===================================================*/

    //При нажатии на кнопку Send Quote в итоговой панели - отправим массив data на сервер
    $panel.on('click', '.g-btn', function () {
        var email = $('#sq_email').val(),
            re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(email)) {
            /// отправляем куда-то email, на который нужно будет что-то прислать
        };
        //отправляем куда-то данные калькулятора
        //$.post("test.php", { json_string: JSON.stringify(data) });
        //открываем форму в модальном окне, откуда получим остальные данные о пользователе
        $panel.find('.js-modal-init').trigger('click');
    });
});