// Application Scripts:
// Покажем / спрячем хидер и кнопку скролла страницы
// Навигация по секциям
// Гугл карта
// Слайдер (головы)
// Слайдер (вакансии)
// Список с выпадайками
// Стилизуем input file field
// Если браузер не знает о плейсхолдерах в формах

jQuery(document).ready(function ($) {
    //
    // Покажем / спрячем хидер и кнопку скролла страницы
    //---------------------------------------------------------------------------------------
    (function () {
        var $header = $('.js-header'),
            isHeaderVisible = false,//флаг состояния
            isScrollerVisible = false,
            $scroller = $('<button type="button" class="scroll-up-btn"><i class="icon-up"></i></button>'),
            method = {};

        $('body').append($scroller);

        method.showHeader = function () {
            $header.addClass('visible');
            isHeaderVisible = true;
        };

        method.hideHeader = function () {
            $header.removeClass('visible');
            isHeaderVisible = false;
        };

        method.showScroller = function () {
            $scroller.show();
            isScrollerVisible = true;
        };

        method.hideScroller = function () {
            $scroller.hide();
            isScrollerVisible = false;
        };

        method.checkState = function () {
            var fromTop = $.scrollY();//
            if (fromTop >= 100 && !isHeaderVisible) {
                method.showHeader();
            } else if (fromTop < 100 && isHeaderVisible) {
                method.hideHeader();
            };

            if (fromTop >= 500 && !isScrollerVisible) {
                method.showScroller();
            } else if (fromTop < 500 && isScrollerVisible) {
                method.hideScroller();
            };
        };

        method.checkState();

        $(window).bind('scroll', method.checkState);

        $scroller.on('click', function () {
            $('html, body').animate({ scrollTop: 0 }, 800);
            return false;
        });
    })();


    //
    // Навигация по секциям
    //---------------------------------------------------------------------------------------
    function sectionNav() {
        var $menu_link = $('.h-menu__link, .b-pager__link'),
            $sections = $('.page__section'),
            $footer = $('.b-footer'),
            $header = $('.b-header__container'), //на мобильных когда вернемся на первый экран - прокрутим к началу, чтобы показать лого на первом экране
            isFooterVisible = false,//будем показывать/скрывать футер с кнопками при скролле (скрывать на первой и последней секции)
            isGoogleMapLoad = false,//будем загружать Гугл-карту когда дойдем до последней секции
            infograph = 'who-we-are',
            isInfographAnimated=false,
            method = {};

        method.changeLinkState = function (el) {//находим и подсвечиваем линк в хидере и пейджере
            $menu_link.removeClass('current');
            var $current = $('.h-menu, .b-pager').find('a[href^="#' + el + '"]');
            $current.addClass('current');
        };

        method.scrollToContent = function (el) {//плавный скролл к секции по клику на линк
            $('html,body').animate({ scrollTop: $($(el).attr('href')).offset().top }, 800);
        };

        method.showFooter = function () {
            $footer.addClass('visible');
            isFooterVisible = true;
        };

        method.hideFooter = function () {
            $footer.removeClass('visible');
            isFooterVisible = false;
        };

        method.checkHeaderScroll = function () {//на мобильных при прокрутке вверх вернем хидеру "стандартное" горизонтальное положение
            var fromLeft = $header.scrollLeft();
            if (fromLeft != 0) {
                $header.stop().animate({ scrollLeft: '0' }, 800);
            };
        };

        method.animateInfograph = function () {//анимации в секции с инфографикой
            isInfographAnimated = true;//изменили флаг - запустим только один раз
            var time = 0;
            $('.i-header').each(function () {//сперва анимируем заголовок блока
                var $el = $(this);
                animateItem($el);
                $el.next('.i-list').find('.i-list__item').each(function () {//затем список элементов
                    animateItem($(this));
                });
            });

            function getAnimationClass(el) {//будем брать класс анимации из data-атрибута
                var className = el.data('animate');
                if (className.length < 1) {
                    className = 'fade-in';
                };
                return className;
            };

            function animateItem(el) {//добавляем класс анимации и меняем значение таймера
                var animate = getAnimationClass(el);
                setTimeout(function () {
                    el.addClass('animated ' + animate);
                }, time);
                time += 700;
            };
        };

        var waypoints = $sections.waypoint({//подключили плагин
            handler: function (direction) {
                var prev = this.previous();//предыдущая секция

                if (this.element.id === infograph && !isInfographAnimated) {//запустим анимацию в секции с инфографикой
                    method.animateInfograph();
                };

                if (this === this.group.last() && !isGoogleMapLoad) {//когда дошли до последней секции - загрузим карту
                    initGoogleMap();
                    isGoogleMapLoad = true;
                };


                if (direction === 'down') {//скроллим вниз
                    method.changeLinkState(this.element.id);

                    if (this !== this.group.first() && !isFooterVisible) {
                        method.showFooter();
                    };
                    if (this === this.group.last() && isFooterVisible) {
                        method.hideFooter();
                    };
                };
                if (direction === 'up') { //если скроллим вверх - подсвечиваем предыдущую секцию
                    method.changeLinkState(prev.element.id);

                    if (prev !== this.group.last() && !isFooterVisible) {
                        method.showFooter();
                    };
                    if (prev === this.group.first() && isFooterVisible) {
                        method.hideFooter();
                        method.checkHeaderScroll();
                    };
                };
            },
            group: 'section',
            offset: '35%'
        });


        $('.b-header__inner, .b-pager').on('click', 'a', function (e) {//перехватываем клик по линку в хидере
            e.preventDefault();
            var $el = $(this);
            method.scrollToContent($el);
        });

        $('.b-intro').on('click', '.b-intro__next', function () {//скролл к следующей секции при клике на кнопку в первой секции
            var pos = $sections.eq(1).offset().top;
            $('html,body').animate({ scrollTop: pos }, 800)
        });

        $('.p-menu').on('click', 'a[data-scroll-link]', function (e) {//скролл по клику в футере(в разделе Контакты)
            e.preventDefault();
            var $el = $(this);
            method.scrollToContent($el);
        });
    };

    if ($('.js-navigate').length) {
        sectionNav();
    };


    //
    // Гугл карта
    //---------------------------------------------------------------------------------------
    function initGoogleMap() {//запуск - см. Навигация по секциям
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&' +
            'callback=gmap_draw';

        window.gmap_draw = function () {
            var map_lating = new google.maps.LatLng(50.463413, 30.508862),
                map_options = {
                    zoom: 17,
                    center: map_lating,
                    panControl: false,
                    zoomControl: true,
                    scrollwheel: false,
                    streetViewControl: false,
                    scaleControl: true,
                    mapTypeId: google.maps.MapTypeId.ROAD
                },
                map = new google.maps.Map(document.getElementById('map'), map_options),
                marker = new google.maps.Marker({
                    position: map_lating,
                    icon: "img/marker.png",
                    map: map
                }),
                info = new google.maps.InfoWindow({
                    content: '<div class="g-subtitle">Copler</div>'
                });

            google.maps.event.addListener(marker, 'mouseover', function () {
                info.open(map, marker);
            });

            google.maps.event.addListener(marker, 'mouseout', function () {
                info.close(map, marker);
            });

            google.maps.event.addDomListener(window, 'resize', function () {
                var center = map.getCenter();
                google.maps.event.trigger(map, 'resize');
                map.setCenter(center);
            });
        };

        document.body.appendChild(script);
    };


    //
    // Слайдер (головы)
    //---------------------------------------------------------------------------------------
    (function () {
        $('.js-slider').each(function () {
            var $slider = $(this),
                $prev = $slider.parent().find('.js-slider-prev'),
                $next = $slider.parent().find('.js-slider-next');

            $slider.bxSlider({
                pager: false,
                controls: true,
                nextText: '<i class="icon-arrow-right"></i>',
                prevText: '<i class="icon-arrow-left"></i>',
                useCSS: false,
                onSliderLoad: function (currentIndex) {
                    $slider.css('visibility', 'visible');//показали содержимое
                    $slider.children('li').eq(currentIndex + 1).addClass('current');//будем добавлять к текущему слайду класс current
                },
                onSlideBefore: function () {
                    $slider.children('li').removeClass('current');
                },
                onSlideAfter: function ($slideElement) {
                    $slideElement.addClass('current');
                }
            });

            $prev.on('click', function () {//доп. кнопки управления на десктопе
                $slider.goToPrevSlide();
            });

            $next.on('click', function () {
                $slider.goToNextSlide();
            });
        });
    })();

    //
    // Слайдер (вакансии)
    //---------------------------------------------------------------------------------------
    (function () {
        var $slider = $('.js-career-slider');

        $slider.bxSlider({
            controls: true,
            nextText: '<i class="icon-arrow-right"></i>',
            prevText: '<i class="icon-arrow-left"></i>',
            useCSS: false,
            pagerCustom: '.js-career-nav'
        });
    })();

    //
    // Список с выпадайками
    //---------------------------------------------------------------------------------------
    (function () {
        var $list = $('.js-drop-list'),
            $body = $('body'),
            $header=$('.b-header'),
            method = {};

        method.hideItem = function (el) {
            el.removeClass('active').find('.js-drop').hide();
            $body.unbind('click', method.hideAllItems);
        };
        method.showItem = function (el) {//покажем скрытый блок
            el.addClass('active').find('.js-drop').fadeIn(400);
            method.scrollToInner(el);//прокрутим к внутреннему блоку на маленьком экране
            el.on('mouseleave', function () {//будем закрывать по клику в документе
                $body.bind('click', method.hideAllItems);
            }).on('mouseenter', function () {
                $body.unbind('click', method.hideAllItems);
            });
        };
        method.hideAllItems = function () {
            $list.find('.js-drop').hide();
            $list.children('li').removeClass('active');
            $body.unbind('click', method.hideAllItems);
        };

        method.scrollToInner = function (el) {
            var winW = $.viewportW();
            if (winW < 992) {
                var fromTop = el.offset().top + el.outerHeight() - $header.outerHeight() - 20;
                $('html,body').animate({ scrollTop: fromTop }, 800);
            };
        };

        $list.on('click', 'figure', function () {
            var $el = $(this).parent('li');
            if ($el.hasClass('active')) {
                method.hideItem($el);
            } else {
                method.hideAllItems();
                method.showItem($el);
            }
        });
    })();

    //
    // Стилизуем input file field
    //---------------------------------------------------------------------------------------
    $(document).on('change', '.js-input-file input[type="file"]', function () {
        var file_field = $(this).closest('.js-input-file');
        var path_input = file_field.find('input.g-input-file__path');
        var files = $(this)[0].files;
        var file_names = [];
        for (var i = 0; i < files.length; i++) {
            file_names.push(files[i].name);
        }
        path_input.val(file_names.join(", "));
        path_input.trigger('change');
    });

   
    //
    // Если браузер не знает о плейсхолдерах в формах
    //---------------------------------------------------------------------------------------
    if ($('html').hasClass('no-placeholder')) {
        /* Placeholders.js v4.0.1 */
        !function (a) { "use strict"; function b() { } function c() { try { return document.activeElement } catch (a) { } } function d(a, b) { for (var c = 0, d = a.length; d > c; c++) if (a[c] === b) return !0; return !1 } function e(a, b, c) { return a.addEventListener ? a.addEventListener(b, c, !1) : a.attachEvent ? a.attachEvent("on" + b, c) : void 0 } function f(a, b) { var c; a.createTextRange ? (c = a.createTextRange(), c.move("character", b), c.select()) : a.selectionStart && (a.focus(), a.setSelectionRange(b, b)) } function g(a, b) { try { return a.type = b, !0 } catch (c) { return !1 } } function h(a, b) { if (a && a.getAttribute(B)) b(a); else for (var c, d = a ? a.getElementsByTagName("input") : N, e = a ? a.getElementsByTagName("textarea") : O, f = d ? d.length : 0, g = e ? e.length : 0, h = f + g, i = 0; h > i; i++) c = f > i ? d[i] : e[i - f], b(c) } function i(a) { h(a, k) } function j(a) { h(a, l) } function k(a, b) { var c = !!b && a.value !== b, d = a.value === a.getAttribute(B); if ((c || d) && "true" === a.getAttribute(C)) { a.removeAttribute(C), a.value = a.value.replace(a.getAttribute(B), ""), a.className = a.className.replace(A, ""); var e = a.getAttribute(I); parseInt(e, 10) >= 0 && (a.setAttribute("maxLength", e), a.removeAttribute(I)); var f = a.getAttribute(D); return f && (a.type = f), !0 } return !1 } function l(a) { var b = a.getAttribute(B); if ("" === a.value && b) { a.setAttribute(C, "true"), a.value = b, a.className += " " + z; var c = a.getAttribute(I); c || (a.setAttribute(I, a.maxLength), a.removeAttribute("maxLength")); var d = a.getAttribute(D); return d ? a.type = "text" : "password" === a.type && g(a, "text") && a.setAttribute(D, "password"), !0 } return !1 } function m(a) { return function () { P && a.value === a.getAttribute(B) && "true" === a.getAttribute(C) ? f(a, 0) : k(a) } } function n(a) { return function () { l(a) } } function o(a) { return function () { i(a) } } function p(a) { return function (b) { return v = a.value, "true" === a.getAttribute(C) && v === a.getAttribute(B) && d(x, b.keyCode) ? (b.preventDefault && b.preventDefault(), !1) : void 0 } } function q(a) { return function () { k(a, v), "" === a.value && (a.blur(), f(a, 0)) } } function r(a) { return function () { a === c() && a.value === a.getAttribute(B) && "true" === a.getAttribute(C) && f(a, 0) } } function s(a) { var b = a.form; b && "string" == typeof b && (b = document.getElementById(b), b.getAttribute(E) || (e(b, "submit", o(b)), b.setAttribute(E, "true"))), e(a, "focus", m(a)), e(a, "blur", n(a)), P && (e(a, "keydown", p(a)), e(a, "keyup", q(a)), e(a, "click", r(a))), a.setAttribute(F, "true"), a.setAttribute(B, T), (P || a !== c()) && l(a) } var t = document.createElement("input"), u = void 0 !== t.placeholder; if (a.Placeholders = { nativeSupport: u, disable: u ? b : i, enable: u ? b : j }, !u) { var v, w = ["text", "search", "url", "tel", "email", "password", "number", "textarea"], x = [27, 33, 34, 35, 36, 37, 38, 39, 40, 8, 46], y = "#ccc", z = "placeholdersjs", A = new RegExp("(?:^|\\s)" + z + "(?!\\S)"), B = "data-placeholder-value", C = "data-placeholder-active", D = "data-placeholder-type", E = "data-placeholder-submit", F = "data-placeholder-bound", G = "data-placeholder-focus", H = "data-placeholder-live", I = "data-placeholder-maxlength", J = 100, K = document.getElementsByTagName("head")[0], L = document.documentElement, M = a.Placeholders, N = document.getElementsByTagName("input"), O = document.getElementsByTagName("textarea"), P = "false" === L.getAttribute(G), Q = "false" !== L.getAttribute(H), R = document.createElement("style"); R.type = "text/css"; var S = document.createTextNode("." + z + " {color:" + y + ";}"); R.styleSheet ? R.styleSheet.cssText = S.nodeValue : R.appendChild(S), K.insertBefore(R, K.firstChild); for (var T, U, V = 0, W = N.length + O.length; W > V; V++) U = V < N.length ? N[V] : O[V - N.length], T = U.attributes.placeholder, T && (T = T.nodeValue, T && d(w, U.type) && s(U)); var X = setInterval(function () { for (var a = 0, b = N.length + O.length; b > a; a++) U = a < N.length ? N[a] : O[a - N.length], T = U.attributes.placeholder, T ? (T = T.nodeValue, T && d(w, U.type) && (U.getAttribute(F) || s(U), (T !== U.getAttribute(B) || "password" === U.type && !U.getAttribute(D)) && ("password" === U.type && !U.getAttribute(D) && g(U, "text") && U.setAttribute(D, "password"), U.value === U.getAttribute(B) && (U.value = T), U.setAttribute(B, T)))) : U.getAttribute(C) && (k(U), U.removeAttribute(B)); Q || clearInterval(X) }, J); e(a, "beforeunload", function () { M.disable() }) } }(this);
    };
    
});
