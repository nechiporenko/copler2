jQuery(document).ready(function ($) {
    //
    // Модальное окно
    //---------------------------------------------------------------------------------------
    var modal = (function () {
        var scrollbarW = getScrollBarWidth(),//будем фиксить подергивание элементов, у которых position:fixed перед открытием окна
            $fixed_el = $('.b-header__wrapper, .b-footer__inner, .b-pager'), //элементы которые будем фиксить
            $scroller = $('.scroll-up-btn'), //скроем кнопку скролла страницы перед открытием окна
            $page = $(document),
            method = {}; //создадим надстройки над плагином arcticmodal


        method.modalFixStart = function () {//перед открытием окна
            var winH = $.viewportH(),
                pageH = $page.outerHeight();
            if (pageH > winH) { //если есть скролл-бар
                $fixed_el.css('padding-right', scrollbarW + 'px');
            };
            $scroller.addClass('g-hidden');
        };


        method.modalFixEnd = function () {//перед закрытием окна
            $fixed_el.removeAttr('style', 'padding-right');//очистим в любом случае
            $scroller.removeClass('g-hidden');
        };

        function getScrollBarWidth() {//helper - определим ширину скроллбара браузера
            var inner = document.createElement('p');
            inner.style.width = "100%";
            inner.style.height = "200px";

            var outer = document.createElement('div');
            outer.style.position = "absolute";
            outer.style.top = "0px";
            outer.style.left = "0px";
            outer.style.visibility = "hidden";
            outer.style.width = "200px";
            outer.style.height = "150px";
            outer.style.overflow = "hidden";
            outer.appendChild(inner);

            document.body.appendChild(outer);
            var w1 = inner.offsetWidth;
            outer.style.overflow = 'scroll';
            var w2 = inner.offsetWidth;
            if (w1 == w2) w2 = outer.clientWidth;

            document.body.removeChild(outer);

            return (w1 - w2);
        };

        $.arcticmodal('setDefault', {//сократим время открытия - закрытия окна
            openEffect: {
                speed: 200
            },
            closeEffect: {
                speed: 100
            }
        });

        //надстройки над плагином arcticmodal
        method.show = function (id) {//откроем окно по айди
            var $el = $(id);
            if ($el.length) {
                $el.arcticmodal({
                    beforeOpen: method.modalFixStart,
                    afterClose: method.modalFixEnd
                });
            };
        };

        method.close = function (id) {//закроем конкретное окно по id
            var $el = $(id);
            if ($el.length) {
                //modalFixEnd();
                method.modalFixEnd();
                $el.arcticmodal('close');
            }
        };

        method.closeAll = function () {//закроем все открытые модальные окна
            //modalFixEnd();
            method.modalFixEnd();
            $.arcticmodal('close');
        };

        method.showThankYou = function () {//покажем Thank you когда нужно
            method.closeAll();
            setTimeout(function () { method.show('#thankyou'); }, 600);
        }

        $('body').on('click', '[data-modal]', function (e) {//по клику на элемент с data-modal="#..." откроем модальное окно
            e.preventDefault();
            var link = $(this).data('modal');
            method.show(link);
        });

        return method; //вернем для внешнего использования
    })();

    //
    // Валидация полей
    //---------------------------------------------------------------------------------------
    (function () {
        var commonRules = {//стилизация полей - общие правила для всех форм
            highlight: function (element, errorClass, validClass) {
                $(element).addClass(errorClass).removeClass(validClass);
                $(element.form).find("label[for=" + element.id + "]").parent('.g-validate').addClass(errorClass).removeClass(validClass);
            },
            unhighlight: function (element, errorClass, validClass) {
                $(element).removeClass(errorClass).addClass(validClass);
                $(element.form).find("label[for=" + element.id + "]").parent('.g-validate').removeClass(errorClass).addClass(validClass);
            }
        };

        $.validator.addMethod("regex", function (value, element, regexpr) {//добавим метод валидации по регулярному выражению
            return regexpr.test(value);
        }, "Please enter a valid data");

        // правила для формы в разделе Контакты
        //---------------------------------------------------------------------------------------
        var contactFormRules = {
            rules: {
                c_name: {
                    required: true,
                    minlength: 2
                },
                c_mail: {
                    required: true,
                    email: true,
                },
                c_query: {
                    required: true,
                    minlength: 5,
                    maxlength: 160,
                },
            },
            submitHandler: function (form) {
                $.ajax({
                    //
                    success: function () {
                        modal.showThankYou();
                    }
                });
                return false;
            }
        };
        $('#c_form').validate($.extend(commonRules, contactFormRules));

        // правила для формы в модальном окне Callback
        //---------------------------------------------------------------------------------------
        var callbackFormRules = {
            rules: {
                clbc_name: {
                    required: true,
                    minlength: 2
                },
                clbc_phone: {
                    required: true,
                    minlength: 8,
                    regex: /[0-9\-\(\)\s]+/
                }
            },
            submitHandler: function (form) {
                $.ajax({
                    //
                    success: function () {
                        modal.close('#callback');
                        modal.showThankYou();
                    }
                });
                return false;
            }
        };
        $('#callback').validate($.extend(commonRules, callbackFormRules));

        // правила для формы в модальном окне Contact a sales expert
        //---------------------------------------------------------------------------------------
        var contactExpertFormRules = {
            rules: {
                exp_name: {
                    required: true,
                    minlength: 2
                },
                exp_mail: {
                    required: true,
                    email: true,
                },
                exp_msg: {
                    required: true,
                    minlength: 5,
                    maxlength: 160,
                }
            },
            submitHandler: function (form) {
                $.ajax({
                    //
                    success: function () {
                        modal.close('#expert');
                        modal.showThankYou();
                    }
                });
                return false;
            }
        };
        $('#expert').validate($.extend(commonRules, contactExpertFormRules));


        // правила для формы в модальном окне Вакансии
        //---------------------------------------------------------------------------------------
        function checkCareerForm() {
            var $form = $('#vacancy'),
                $option = $form.find('.g-select option');

            function showForm(num) {//"кастомное" открытие формы в модальном окне
                if ($form.length) {
                    $form.arcticmodal({
                        beforeOpen: function () {
                            $option.prop('selected', false).each(function () {
                                var current = +$(this).data('value');
                                if (current === num) {
                                    $(this).prop('selected', true);
                                    return;
                                };
                            });
                            modal.modalFixStart();
                        },
                        afterClose: function () {
                            modal.modalFixEnd();
                        }
                    });
                };
            };

            $('.js-career-slider').on('click', 'button[data-form]', function () {//откроем модальное окно по клику
                var num = +$(this).data('value'); //передадим в форму номер option, которую нужно активировать в Select
                showForm(num);
            });

            var careerFormRules = {//правила валидации для формы Вакансии
                rules: {
                    vcn_name: {
                        required: true,
                        minlength: 2
                    },
                    vcn_mail: {
                        required: true,
                        email: true,
                    }
                },
                submitHandler: function (form) {
                    $.ajax({
                        //
                        success: function () {
                            modal.close('#vacancy');
                            modal.showThankYou();
                        }
                    });
                    return false;
                }
            };
            $form.validate($.extend(commonRules, careerFormRules));
        };
        if ($('.js-career-slider').length) {
            checkCareerForm();
        };

        // правила для формы в модальном окне TELL US ABOUT YOURSELF
        //---------------------------------------------------------------------------------------
        function checkRequestForm() {
            var $form = $('#request'),
                $title = $form.find('span[data-title]'),
                $list = $form.find('ul[data-list]'),
                $hidden = $form.find('.g-hidden[data-hidden]');

            function showForm(el) {//открываем форму в модальном окне
                $form.arcticmodal({
                    beforeOpen: function () {
                        var title = el.find('.b-list__title').data('title');//передадим тайтл (в текст и скрытое поле)
                        $title.text(title);
                        $('#rq_title').val(title);

                        $list.find('li').remove();//очистили список
                        $hidden.html('');//очистили скрытый блок

                        el.find('input[type="checkbox"]').each(function () {//передали отмеченные чекбоксы в скрытый блок, подписи - в список
                            if ($(this).is(':checked')) {
                                var chk = $(this).clone(),
                                    label = $(this).next('label').text();
                                chk.removeAttr('id').removeAttr('class').attr('checked', true);
                                $hidden.append(chk);
                                $list.append('<li>' + label + '</li>');
                            }
                        });
                        modal.modalFixStart();
                    },
                    afterClose: function () {
                        modal.modalFixEnd();
                    }
                });
            };

            $('.b-list').on('click', 'button[data-form]', function () {//клик по кнопке - откроем форму
                var $el = $(this).parents('.b-list__item.active');
                showForm($el);
            });

            var requestFormRules = {//правила валидации для формы TELL US ABOUT YOURSELF
                rules: {
                    rq_name1: {
                        required: true,
                        minlength: 2
                    },
                    rq_mail: {
                        required: true,
                        email: true,
                    }
                },
                submitHandler: function (form) {
                    $.ajax({
                        //
                        success: function () {
                            modal.close('#request');
                            modal.showThankYou();
                        }
                    });
                    return false;
                }
            };
            $form.validate($.extend(commonRules, requestFormRules));
        };
        if ($('#request').length) { checkRequestForm(); }


        // правила для формы в модальном окне Business Contact
        //---------------------------------------------------------------------------------------
        function checkBusinessForm() {
            var $form, //в эту переменную запишем форму, которую откроем в модальном окне
                isValidatorActive = false; //флаг состояния - запущен ли валидатор

            function showForm(el, form_id) {//передадим название в модальное окно
                $form = $(form_id);

                if (!isValidatorActive) {//проверяем подключен ли валидатор, если не подключен - запускаем
                    $form.validate($.extend(commonRules, businessFormRules));
                    isValidatorActive = true;
                };

                $form.arcticmodal({
                    beforeOpen: function () {
                        var title = el.find('.p-list__title').data('title');//находим название плана (заголовок блока)
                        $form.find('input[data-title]').val(title); //и передаем в поле с атрибутом data-title
                        modal.modalFixStart();
                    },
                    afterClose: function () {
                        modal.modalFixEnd();
                    }
                });
            };

            $('.p-list').on('click', 'button[data-form]', function () {
                var $el = $(this).parents('.p-list__item'), //блок, в котором кликаем на кнопку
                    form_id = $(this).data('form'); //id формы, которую нужно открыть
                showForm($el, form_id);
            });

            var businessFormRules = {//правила валидации для формы Business Contact
                rules: {
                    bc_name1: {
                        required: true,
                        minlength: 2
                    },
                    bc_mail: {
                        required: true,
                        email: true,
                    },
                    bc_plan: {
                        required: true
                    }
                },
                submitHandler: function (form) {
                    $.ajax({
                        //
                        success: function () {
                            var form_id = '#' + $form.attr('id');
                            modal.close(form_id);
                            modal.showThankYou();
                        }
                    });
                    return false;
                }
            };
        };
        if ($('.p-list').length) {
            checkBusinessForm();
        };

        // правила для формы в модальном окне Conversation
        //---------------------------------------------------------------------------------------
        function checkConversationForm() {
            var conversationFormRules = {
                rules: {
                    cnv_name: {
                        required: true,
                        minlength: 2,
                    },
                    cnv_mail: {
                        required: true,
                        email: true,
                    },
                    cnv_date: {
                        required: true,
                        regex: /\d{1,2}\/\d{1,2}\/\d{4}/
                    }
                },
                submitHandler: function (form) {
                    $.ajax({
                        //
                        success: function () {
                            modal.close('#conversation');
                            modal.showThankYou();
                        }
                    });
                    return false;
                }
            };
            $('#conversation').validate($.extend(commonRules, callbackFormRules));
        };
        if ($('#conversation').length) {
            checkConversationForm();
        };

        //в этой функции используем метод valid - запустить ее последней!
        $('.js-form-validate').each(function () {//если в полях формы есть ошибки валидации - будем блокировать кнопку отправки
            var $form = $(this),
                $el = $form.find('.g-input, .g-textarea'),
                $btn = $form.find('button[type="submit"]');

            $el.on('keyup blur', function () {
                if ($el.hasClass('error')) {
                    $btn.prop('disabled', 'disabled');
                } else {
                    $btn.prop('disabled', false);
                };
            });

            $btn.on('click', function () {
                if ($form.valid()) {
                    $btn.prop('disabled', false);
                } else {
                    $btn.prop('disabled', 'disabled');
                }
            });
        });
    })();

    
});