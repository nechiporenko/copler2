/*!
 * Copler
 * @author: 'Digital Force', http://digitalforce.ua
 * @version: 0.3.0
 * Copyright 2016.
 */

// Place any jQuery/helper plugins in here.
/*
 * verge 1.9.1+201402130803
 * https://github.com/ryanve/verge
 * MIT License 2013 Ryan Van Etten
 */
!function (a, b, c) { "undefined" != typeof module && module.exports ? module.exports = c() : a[b] = c() }(this, "verge", function () { function a() { return { width: k(), height: l() } } function b(a, b) { var c = {}; return b = +b || 0, c.width = (c.right = a.right + b) - (c.left = a.left - b), c.height = (c.bottom = a.bottom + b) - (c.top = a.top - b), c } function c(a, c) { return a = a && !a.nodeType ? a[0] : a, a && 1 === a.nodeType ? b(a.getBoundingClientRect(), c) : !1 } function d(b) { b = null == b ? a() : 1 === b.nodeType ? c(b) : b; var d = b.height, e = b.width; return d = "function" == typeof d ? d.call(b) : d, e = "function" == typeof e ? e.call(b) : e, e / d } var e = {}, f = "undefined" != typeof window && window, g = "undefined" != typeof document && document, h = g && g.documentElement, i = f.matchMedia || f.msMatchMedia, j = i ? function (a) { return !!i.call(f, a).matches } : function () { return !1 }, k = e.viewportW = function () { var a = h.clientWidth, b = f.innerWidth; return b > a ? b : a }, l = e.viewportH = function () { var a = h.clientHeight, b = f.innerHeight; return b > a ? b : a }; return e.mq = j, e.matchMedia = i ? function () { return i.apply(f, arguments) } : function () { return {} }, e.viewport = a, e.scrollX = function () { return f.pageXOffset || h.scrollLeft }, e.scrollY = function () { return f.pageYOffset || h.scrollTop }, e.rectangle = c, e.aspect = d, e.inX = function (a, b) { var d = c(a, b); return !!d && d.right >= 0 && d.left <= k() }, e.inY = function (a, b) { var d = c(a, b); return !!d && d.bottom >= 0 && d.top <= l() }, e.inViewport = function (a, b) { var d = c(a, b); return !!d && d.bottom >= 0 && d.right >= 0 && d.top <= l() && d.left <= k() }, e });
jQuery.extend(verge);

/*!
Waypoints - 4.0.0
Copyright  2011-2015 Caleb Troughton
Licensed under the MIT license.
https://github.com/imakewebthings/waypoints/blog/master/licenses.txt
*/
!function () { "use strict"; function t(o) { if (!o) throw new Error("No options passed to Waypoint constructor"); if (!o.element) throw new Error("No element option passed to Waypoint constructor"); if (!o.handler) throw new Error("No handler option passed to Waypoint constructor"); this.key = "waypoint-" + e, this.options = t.Adapter.extend({}, t.defaults, o), this.element = this.options.element, this.adapter = new t.Adapter(this.element), this.callback = o.handler, this.axis = this.options.horizontal ? "horizontal" : "vertical", this.enabled = this.options.enabled, this.triggerPoint = null, this.group = t.Group.findOrCreate({ name: this.options.group, axis: this.axis }), this.context = t.Context.findOrCreateByElement(this.options.context), t.offsetAliases[this.options.offset] && (this.options.offset = t.offsetAliases[this.options.offset]), this.group.add(this), this.context.add(this), i[this.key] = this, e += 1 } var e = 0, i = {}; t.prototype.queueTrigger = function (t) { this.group.queueTrigger(this, t) }, t.prototype.trigger = function (t) { this.enabled && this.callback && this.callback.apply(this, t) }, t.prototype.destroy = function () { this.context.remove(this), this.group.remove(this), delete i[this.key] }, t.prototype.disable = function () { return this.enabled = !1, this }, t.prototype.enable = function () { return this.context.refresh(), this.enabled = !0, this }, t.prototype.next = function () { return this.group.next(this) }, t.prototype.previous = function () { return this.group.previous(this) }, t.invokeAll = function (t) { var e = []; for (var o in i) e.push(i[o]); for (var n = 0, r = e.length; r > n; n++) e[n][t]() }, t.destroyAll = function () { t.invokeAll("destroy") }, t.disableAll = function () { t.invokeAll("disable") }, t.enableAll = function () { t.invokeAll("enable") }, t.refreshAll = function () { t.Context.refreshAll() }, t.viewportHeight = function () { return window.innerHeight || document.documentElement.clientHeight }, t.viewportWidth = function () { return document.documentElement.clientWidth }, t.adapters = [], t.defaults = { context: window, continuous: !0, enabled: !0, group: "default", horizontal: !1, offset: 0 }, t.offsetAliases = { "bottom-in-view": function () { return this.context.innerHeight() - this.adapter.outerHeight() }, "right-in-view": function () { return this.context.innerWidth() - this.adapter.outerWidth() } }, window.Waypoint = t }(), function () { "use strict"; function t(t) { window.setTimeout(t, 1e3 / 60) } function e(t) { this.element = t, this.Adapter = n.Adapter, this.adapter = new this.Adapter(t), this.key = "waypoint-context-" + i, this.didScroll = !1, this.didResize = !1, this.oldScroll = { x: this.adapter.scrollLeft(), y: this.adapter.scrollTop() }, this.waypoints = { vertical: {}, horizontal: {} }, t.waypointContextKey = this.key, o[t.waypointContextKey] = this, i += 1, this.createThrottledScrollHandler(), this.createThrottledResizeHandler() } var i = 0, o = {}, n = window.Waypoint, r = window.onload; e.prototype.add = function (t) { var e = t.options.horizontal ? "horizontal" : "vertical"; this.waypoints[e][t.key] = t, this.refresh() }, e.prototype.checkEmpty = function () { var t = this.Adapter.isEmptyObject(this.waypoints.horizontal), e = this.Adapter.isEmptyObject(this.waypoints.vertical); t && e && (this.adapter.off(".waypoints"), delete o[this.key]) }, e.prototype.createThrottledResizeHandler = function () { function t() { e.handleResize(), e.didResize = !1 } var e = this; this.adapter.on("resize.waypoints", function () { e.didResize || (e.didResize = !0, n.requestAnimationFrame(t)) }) }, e.prototype.createThrottledScrollHandler = function () { function t() { e.handleScroll(), e.didScroll = !1 } var e = this; this.adapter.on("scroll.waypoints", function () { (!e.didScroll || n.isTouch) && (e.didScroll = !0, n.requestAnimationFrame(t)) }) }, e.prototype.handleResize = function () { n.Context.refreshAll() }, e.prototype.handleScroll = function () { var t = {}, e = { horizontal: { newScroll: this.adapter.scrollLeft(), oldScroll: this.oldScroll.x, forward: "right", backward: "left" }, vertical: { newScroll: this.adapter.scrollTop(), oldScroll: this.oldScroll.y, forward: "down", backward: "up" } }; for (var i in e) { var o = e[i], n = o.newScroll > o.oldScroll, r = n ? o.forward : o.backward; for (var s in this.waypoints[i]) { var a = this.waypoints[i][s], l = o.oldScroll < a.triggerPoint, h = o.newScroll >= a.triggerPoint, p = l && h, u = !l && !h; (p || u) && (a.queueTrigger(r), t[a.group.id] = a.group) } } for (var c in t) t[c].flushTriggers(); this.oldScroll = { x: e.horizontal.newScroll, y: e.vertical.newScroll } }, e.prototype.innerHeight = function () { return this.element == this.element.window ? n.viewportHeight() : this.adapter.innerHeight() }, e.prototype.remove = function (t) { delete this.waypoints[t.axis][t.key], this.checkEmpty() }, e.prototype.innerWidth = function () { return this.element == this.element.window ? n.viewportWidth() : this.adapter.innerWidth() }, e.prototype.destroy = function () { var t = []; for (var e in this.waypoints) for (var i in this.waypoints[e]) t.push(this.waypoints[e][i]); for (var o = 0, n = t.length; n > o; o++) t[o].destroy() }, e.prototype.refresh = function () { var t, e = this.element == this.element.window, i = e ? void 0 : this.adapter.offset(), o = {}; this.handleScroll(), t = { horizontal: { contextOffset: e ? 0 : i.left, contextScroll: e ? 0 : this.oldScroll.x, contextDimension: this.innerWidth(), oldScroll: this.oldScroll.x, forward: "right", backward: "left", offsetProp: "left" }, vertical: { contextOffset: e ? 0 : i.top, contextScroll: e ? 0 : this.oldScroll.y, contextDimension: this.innerHeight(), oldScroll: this.oldScroll.y, forward: "down", backward: "up", offsetProp: "top" } }; for (var r in t) { var s = t[r]; for (var a in this.waypoints[r]) { var l, h, p, u, c, d = this.waypoints[r][a], f = d.options.offset, w = d.triggerPoint, y = 0, g = null == w; d.element !== d.element.window && (y = d.adapter.offset()[s.offsetProp]), "function" == typeof f ? f = f.apply(d) : "string" == typeof f && (f = parseFloat(f), d.options.offset.indexOf("%") > -1 && (f = Math.ceil(s.contextDimension * f / 100))), l = s.contextScroll - s.contextOffset, d.triggerPoint = y + l - f, h = w < s.oldScroll, p = d.triggerPoint >= s.oldScroll, u = h && p, c = !h && !p, !g && u ? (d.queueTrigger(s.backward), o[d.group.id] = d.group) : !g && c ? (d.queueTrigger(s.forward), o[d.group.id] = d.group) : g && s.oldScroll >= d.triggerPoint && (d.queueTrigger(s.forward), o[d.group.id] = d.group) } } return n.requestAnimationFrame(function () { for (var t in o) o[t].flushTriggers() }), this }, e.findOrCreateByElement = function (t) { return e.findByElement(t) || new e(t) }, e.refreshAll = function () { for (var t in o) o[t].refresh() }, e.findByElement = function (t) { return o[t.waypointContextKey] }, window.onload = function () { r && r(), e.refreshAll() }, n.requestAnimationFrame = function (e) { var i = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || t; i.call(window, e) }, n.Context = e }(), function () { "use strict"; function t(t, e) { return t.triggerPoint - e.triggerPoint } function e(t, e) { return e.triggerPoint - t.triggerPoint } function i(t) { this.name = t.name, this.axis = t.axis, this.id = this.name + "-" + this.axis, this.waypoints = [], this.clearTriggerQueues(), o[this.axis][this.name] = this } var o = { vertical: {}, horizontal: {} }, n = window.Waypoint; i.prototype.add = function (t) { this.waypoints.push(t) }, i.prototype.clearTriggerQueues = function () { this.triggerQueues = { up: [], down: [], left: [], right: [] } }, i.prototype.flushTriggers = function () { for (var i in this.triggerQueues) { var o = this.triggerQueues[i], n = "up" === i || "left" === i; o.sort(n ? e : t); for (var r = 0, s = o.length; s > r; r += 1) { var a = o[r]; (a.options.continuous || r === o.length - 1) && a.trigger([i]) } } this.clearTriggerQueues() }, i.prototype.next = function (e) { this.waypoints.sort(t); var i = n.Adapter.inArray(e, this.waypoints), o = i === this.waypoints.length - 1; return o ? null : this.waypoints[i + 1] }, i.prototype.previous = function (e) { this.waypoints.sort(t); var i = n.Adapter.inArray(e, this.waypoints); return i ? this.waypoints[i - 1] : null }, i.prototype.queueTrigger = function (t, e) { this.triggerQueues[e].push(t) }, i.prototype.remove = function (t) { var e = n.Adapter.inArray(t, this.waypoints); e > -1 && this.waypoints.splice(e, 1) }, i.prototype.first = function () { return this.waypoints[0] }, i.prototype.last = function () { return this.waypoints[this.waypoints.length - 1] }, i.findOrCreate = function (t) { return o[t.axis][t.name] || new i(t) }, n.Group = i }(), function () { "use strict"; function t(t) { this.$element = e(t) } var e = window.jQuery, i = window.Waypoint; e.each(["innerHeight", "innerWidth", "off", "offset", "on", "outerHeight", "outerWidth", "scrollLeft", "scrollTop"], function (e, i) { t.prototype[i] = function () { var t = Array.prototype.slice.call(arguments); return this.$element[i].apply(this.$element, t) } }), e.each(["extend", "inArray", "isEmptyObject"], function (i, o) { t[o] = e[o] }), i.adapters.push({ name: "jquery", Adapter: t }), i.Adapter = t }(), function () { "use strict"; function t(t) { return function () { var i = [], o = arguments[0]; return t.isFunction(arguments[0]) && (o = t.extend({}, arguments[1]), o.handler = arguments[0]), this.each(function () { var n = t.extend({}, o, { element: this }); "string" == typeof n.context && (n.context = t(this).closest(n.context)[0]), i.push(new e(n)) }), i } } var e = window.Waypoint; window.jQuery && (window.jQuery.fn.waypoint = t(window.jQuery)), window.Zepto && (window.Zepto.fn.waypoint = t(window.Zepto)) }();


/**
 * bxSlider v4.2.5
 * Copyright 2013-2015 Steven Wanderski
 * Written while drinking Belgian ales and listening to jazz

 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */

!function (a) { var b = { mode: "horizontal", slideSelector: "", infiniteLoop: !0, hideControlOnEnd: !1, speed: 500, easing: null, slideMargin: 0, startSlide: 0, randomStart: !1, captions: !1, ticker: !1, tickerHover: !1, adaptiveHeight: !1, adaptiveHeightSpeed: 500, video: !1, useCSS: !0, preloadImages: "visible", responsive: !0, slideZIndex: 50, wrapperClass: "bx-wrapper", touchEnabled: !0, swipeThreshold: 50, oneToOneTouch: !0, preventDefaultSwipeX: !0, preventDefaultSwipeY: !1, ariaLive: !0, ariaHidden: !0, keyboardEnabled: !1, pager: !0, pagerType: "full", pagerShortSeparator: " / ", pagerSelector: null, buildPager: null, pagerCustom: null, controls: !0, nextText: "Next", prevText: "Prev", nextSelector: null, prevSelector: null, autoControls: !1, startText: "Start", stopText: "Stop", autoControlsCombine: !1, autoControlsSelector: null, auto: !1, pause: 4e3, autoStart: !0, autoDirection: "next", stopAutoOnClick: !1, autoHover: !1, autoDelay: 0, autoSlideForOnePage: !1, minSlides: 1, maxSlides: 1, moveSlides: 0, slideWidth: 0, shrinkItems: !1, onSliderLoad: function () { return !0 }, onSlideBefore: function () { return !0 }, onSlideAfter: function () { return !0 }, onSlideNext: function () { return !0 }, onSlidePrev: function () { return !0 }, onSliderResize: function () { return !0 } }; a.fn.bxSlider = function (c) { if (0 === this.length) return this; if (this.length > 1) return this.each(function () { a(this).bxSlider(c) }), this; var d = {}, e = this, f = a(window).width(), g = a(window).height(); if (!a(e).data("bxSlider")) { var h = function () { a(e).data("bxSlider") || (d.settings = a.extend({}, b, c), d.settings.slideWidth = parseInt(d.settings.slideWidth), d.children = e.children(d.settings.slideSelector), d.children.length < d.settings.minSlides && (d.settings.minSlides = d.children.length), d.children.length < d.settings.maxSlides && (d.settings.maxSlides = d.children.length), d.settings.randomStart && (d.settings.startSlide = Math.floor(Math.random() * d.children.length)), d.active = { index: d.settings.startSlide }, d.carousel = d.settings.minSlides > 1 || d.settings.maxSlides > 1 ? !0 : !1, d.carousel && (d.settings.preloadImages = "all"), d.minThreshold = d.settings.minSlides * d.settings.slideWidth + (d.settings.minSlides - 1) * d.settings.slideMargin, d.maxThreshold = d.settings.maxSlides * d.settings.slideWidth + (d.settings.maxSlides - 1) * d.settings.slideMargin, d.working = !1, d.controls = {}, d.interval = null, d.animProp = "vertical" === d.settings.mode ? "top" : "left", d.usingCSS = d.settings.useCSS && "fade" !== d.settings.mode && function () { for (var a = document.createElement("div"), b = ["WebkitPerspective", "MozPerspective", "OPerspective", "msPerspective"], c = 0; c < b.length; c++) if (void 0 !== a.style[b[c]]) return d.cssPrefix = b[c].replace("Perspective", "").toLowerCase(), d.animProp = "-" + d.cssPrefix + "-transform", !0; return !1 }(), "vertical" === d.settings.mode && (d.settings.maxSlides = d.settings.minSlides), e.data("origStyle", e.attr("style")), e.children(d.settings.slideSelector).each(function () { a(this).data("origStyle", a(this).attr("style")) }), j()) }, j = function () { var b = d.children.eq(d.settings.startSlide); e.wrap('<div class="' + d.settings.wrapperClass + '"><div class="bx-viewport"></div></div>'), d.viewport = e.parent(), d.settings.ariaLive && !d.settings.ticker && d.viewport.attr("aria-live", "polite"), d.loader = a('<div class="bx-loading" />'), d.viewport.prepend(d.loader), e.css({ width: "horizontal" === d.settings.mode ? 1e3 * d.children.length + 215 + "%" : "auto", position: "relative" }), d.usingCSS && d.settings.easing ? e.css("-" + d.cssPrefix + "-transition-timing-function", d.settings.easing) : d.settings.easing || (d.settings.easing = "swing"), d.viewport.css({ width: "100%", overflow: "hidden", position: "relative" }), d.viewport.parent().css({ maxWidth: n() }), d.settings.pager || d.settings.controls || d.viewport.parent().css({ margin: "0 auto 0px" }), d.children.css({ "float": "horizontal" === d.settings.mode ? "left" : "none", listStyle: "none", position: "relative" }), d.children.css("width", o()), "horizontal" === d.settings.mode && d.settings.slideMargin > 0 && d.children.css("marginRight", d.settings.slideMargin), "vertical" === d.settings.mode && d.settings.slideMargin > 0 && d.children.css("marginBottom", d.settings.slideMargin), "fade" === d.settings.mode && (d.children.css({ position: "absolute", zIndex: 0, display: "none" }), d.children.eq(d.settings.startSlide).css({ zIndex: d.settings.slideZIndex, display: "block" })), d.controls.el = a('<div class="bx-controls" />'), d.settings.captions && y(), d.active.last = d.settings.startSlide === q() - 1, d.settings.video && e.fitVids(), ("all" === d.settings.preloadImages || d.settings.ticker) && (b = d.children), d.settings.ticker ? d.settings.pager = !1 : (d.settings.controls && w(), d.settings.auto && d.settings.autoControls && x(), d.settings.pager && v(), (d.settings.controls || d.settings.autoControls || d.settings.pager) && d.viewport.after(d.controls.el)), k(b, l) }, k = function (b, c) { var d = b.find('img:not([src=""]), iframe').length, e = 0; return 0 === d ? void c() : void b.find('img:not([src=""]), iframe').each(function () { a(this).one("load error", function () { ++e === d && c() }).each(function () { this.complete && a(this).load() }) }) }, l = function () { if (d.settings.infiniteLoop && "fade" !== d.settings.mode && !d.settings.ticker) { var b = "vertical" === d.settings.mode ? d.settings.minSlides : d.settings.maxSlides, c = d.children.slice(0, b).clone(!0).addClass("bx-clone"), f = d.children.slice(-b).clone(!0).addClass("bx-clone"); d.settings.ariaHidden && (c.attr("aria-hidden", !0), f.attr("aria-hidden", !0)), e.append(c).prepend(f) } d.loader.remove(), s(), "vertical" === d.settings.mode && (d.settings.adaptiveHeight = !0), d.viewport.height(m()), e.redrawSlider(), d.settings.onSliderLoad.call(e, d.active.index), d.initialized = !0, d.settings.responsive && a(window).bind("resize", S), d.settings.auto && d.settings.autoStart && (q() > 1 || d.settings.autoSlideForOnePage) && I(), d.settings.ticker && J(), d.settings.pager && E(d.settings.startSlide), d.settings.controls && H(), d.settings.touchEnabled && !d.settings.ticker && N(), d.settings.keyboardEnabled && !d.settings.ticker && a(document).keydown(M) }, m = function () { var b = 0, c = a(); if ("vertical" === d.settings.mode || d.settings.adaptiveHeight) if (d.carousel) { var e = 1 === d.settings.moveSlides ? d.active.index : d.active.index * r(); for (c = d.children.eq(e), i = 1; i <= d.settings.maxSlides - 1; i++) c = e + i >= d.children.length ? c.add(d.children.eq(i - 1)) : c.add(d.children.eq(e + i)) } else c = d.children.eq(d.active.index); else c = d.children; return "vertical" === d.settings.mode ? (c.each(function (c) { b += a(this).outerHeight() }), d.settings.slideMargin > 0 && (b += d.settings.slideMargin * (d.settings.minSlides - 1))) : b = Math.max.apply(Math, c.map(function () { return a(this).outerHeight(!1) }).get()), "border-box" === d.viewport.css("box-sizing") ? b += parseFloat(d.viewport.css("padding-top")) + parseFloat(d.viewport.css("padding-bottom")) + parseFloat(d.viewport.css("border-top-width")) + parseFloat(d.viewport.css("border-bottom-width")) : "padding-box" === d.viewport.css("box-sizing") && (b += parseFloat(d.viewport.css("padding-top")) + parseFloat(d.viewport.css("padding-bottom"))), b }, n = function () { var a = "100%"; return d.settings.slideWidth > 0 && (a = "horizontal" === d.settings.mode ? d.settings.maxSlides * d.settings.slideWidth + (d.settings.maxSlides - 1) * d.settings.slideMargin : d.settings.slideWidth), a }, o = function () { var a = d.settings.slideWidth, b = d.viewport.width(); if (0 === d.settings.slideWidth || d.settings.slideWidth > b && !d.carousel || "vertical" === d.settings.mode) a = b; else if (d.settings.maxSlides > 1 && "horizontal" === d.settings.mode) { if (b > d.maxThreshold) return a; b < d.minThreshold ? a = (b - d.settings.slideMargin * (d.settings.minSlides - 1)) / d.settings.minSlides : d.settings.shrinkItems && (a = Math.floor((b + d.settings.slideMargin) / Math.ceil((b + d.settings.slideMargin) / (a + d.settings.slideMargin)) - d.settings.slideMargin)) } return a }, p = function () { var a = 1, b = null; return "horizontal" === d.settings.mode && d.settings.slideWidth > 0 ? d.viewport.width() < d.minThreshold ? a = d.settings.minSlides : d.viewport.width() > d.maxThreshold ? a = d.settings.maxSlides : (b = d.children.first().width() + d.settings.slideMargin, a = Math.floor((d.viewport.width() + d.settings.slideMargin) / b)) : "vertical" === d.settings.mode && (a = d.settings.minSlides), a }, q = function () { var a = 0, b = 0, c = 0; if (d.settings.moveSlides > 0) if (d.settings.infiniteLoop) a = Math.ceil(d.children.length / r()); else for (; b < d.children.length;)++a, b = c + p(), c += d.settings.moveSlides <= p() ? d.settings.moveSlides : p(); else a = Math.ceil(d.children.length / p()); return a }, r = function () { return d.settings.moveSlides > 0 && d.settings.moveSlides <= p() ? d.settings.moveSlides : p() }, s = function () { var a, b, c; d.children.length > d.settings.maxSlides && d.active.last && !d.settings.infiniteLoop ? "horizontal" === d.settings.mode ? (b = d.children.last(), a = b.position(), t(-(a.left - (d.viewport.width() - b.outerWidth())), "reset", 0)) : "vertical" === d.settings.mode && (c = d.children.length - d.settings.minSlides, a = d.children.eq(c).position(), t(-a.top, "reset", 0)) : (a = d.children.eq(d.active.index * r()).position(), d.active.index === q() - 1 && (d.active.last = !0), void 0 !== a && ("horizontal" === d.settings.mode ? t(-a.left, "reset", 0) : "vertical" === d.settings.mode && t(-a.top, "reset", 0))) }, t = function (b, c, f, g) { var h, i; d.usingCSS ? (i = "vertical" === d.settings.mode ? "translate3d(0, " + b + "px, 0)" : "translate3d(" + b + "px, 0, 0)", e.css("-" + d.cssPrefix + "-transition-duration", f / 1e3 + "s"), "slide" === c ? (e.css(d.animProp, i), 0 !== f ? e.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function (b) { a(b.target).is(e) && (e.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"), F()) }) : F()) : "reset" === c ? e.css(d.animProp, i) : "ticker" === c && (e.css("-" + d.cssPrefix + "-transition-timing-function", "linear"), e.css(d.animProp, i), 0 !== f ? e.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function (b) { a(b.target).is(e) && (e.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"), t(g.resetValue, "reset", 0), K()) }) : (t(g.resetValue, "reset", 0), K()))) : (h = {}, h[d.animProp] = b, "slide" === c ? e.animate(h, f, d.settings.easing, function () { F() }) : "reset" === c ? e.css(d.animProp, b) : "ticker" === c && e.animate(h, f, "linear", function () { t(g.resetValue, "reset", 0), K() })) }, u = function () { for (var b = "", c = "", e = q(), f = 0; e > f; f++) c = "", d.settings.buildPager && a.isFunction(d.settings.buildPager) || d.settings.pagerCustom ? (c = d.settings.buildPager(f), d.pagerEl.addClass("bx-custom-pager")) : (c = f + 1, d.pagerEl.addClass("bx-default-pager")), b += '<div class="bx-pager-item"><a href="" data-slide-index="' + f + '" class="bx-pager-link">' + c + "</a></div>"; d.pagerEl.html(b) }, v = function () { d.settings.pagerCustom ? d.pagerEl = a(d.settings.pagerCustom) : (d.pagerEl = a('<div class="bx-pager" />'), d.settings.pagerSelector ? a(d.settings.pagerSelector).html(d.pagerEl) : d.controls.el.addClass("bx-has-pager").append(d.pagerEl), u()), d.pagerEl.on("click touchend", "a", D) }, w = function () { d.controls.next = a('<a class="bx-next" href="">' + d.settings.nextText + "</a>"), d.controls.prev = a('<a class="bx-prev" href="">' + d.settings.prevText + "</a>"), d.controls.next.bind("click touchend", z), d.controls.prev.bind("click touchend", A), d.settings.nextSelector && a(d.settings.nextSelector).append(d.controls.next), d.settings.prevSelector && a(d.settings.prevSelector).append(d.controls.prev), d.settings.nextSelector || d.settings.prevSelector || (d.controls.directionEl = a('<div class="bx-controls-direction" />'), d.controls.directionEl.append(d.controls.prev).append(d.controls.next), d.controls.el.addClass("bx-has-controls-direction").append(d.controls.directionEl)) }, x = function () { d.controls.start = a('<div class="bx-controls-auto-item"><a class="bx-start" href="">' + d.settings.startText + "</a></div>"), d.controls.stop = a('<div class="bx-controls-auto-item"><a class="bx-stop" href="">' + d.settings.stopText + "</a></div>"), d.controls.autoEl = a('<div class="bx-controls-auto" />'), d.controls.autoEl.on("click", ".bx-start", B), d.controls.autoEl.on("click", ".bx-stop", C), d.settings.autoControlsCombine ? d.controls.autoEl.append(d.controls.start) : d.controls.autoEl.append(d.controls.start).append(d.controls.stop), d.settings.autoControlsSelector ? a(d.settings.autoControlsSelector).html(d.controls.autoEl) : d.controls.el.addClass("bx-has-controls-auto").append(d.controls.autoEl), G(d.settings.autoStart ? "stop" : "start") }, y = function () { d.children.each(function (b) { var c = a(this).find("img:first").attr("title"); void 0 !== c && ("" + c).length && a(this).append('<div class="bx-caption"><span>' + c + "</span></div>") }) }, z = function (a) { a.preventDefault(), d.controls.el.hasClass("disabled") || (d.settings.auto && d.settings.stopAutoOnClick && e.stopAuto(), e.goToNextSlide()) }, A = function (a) { a.preventDefault(), d.controls.el.hasClass("disabled") || (d.settings.auto && d.settings.stopAutoOnClick && e.stopAuto(), e.goToPrevSlide()) }, B = function (a) { e.startAuto(), a.preventDefault() }, C = function (a) { e.stopAuto(), a.preventDefault() }, D = function (b) { var c, f; b.preventDefault(), d.controls.el.hasClass("disabled") || (d.settings.auto && d.settings.stopAutoOnClick && e.stopAuto(), c = a(b.currentTarget), void 0 !== c.attr("data-slide-index") && (f = parseInt(c.attr("data-slide-index")), f !== d.active.index && e.goToSlide(f))) }, E = function (b) { var c = d.children.length; return "short" === d.settings.pagerType ? (d.settings.maxSlides > 1 && (c = Math.ceil(d.children.length / d.settings.maxSlides)), void d.pagerEl.html(b + 1 + d.settings.pagerShortSeparator + c)) : (d.pagerEl.find("a").removeClass("active"), void d.pagerEl.each(function (c, d) { a(d).find("a").eq(b).addClass("active") })) }, F = function () { if (d.settings.infiniteLoop) { var a = ""; 0 === d.active.index ? a = d.children.eq(0).position() : d.active.index === q() - 1 && d.carousel ? a = d.children.eq((q() - 1) * r()).position() : d.active.index === d.children.length - 1 && (a = d.children.eq(d.children.length - 1).position()), a && ("horizontal" === d.settings.mode ? t(-a.left, "reset", 0) : "vertical" === d.settings.mode && t(-a.top, "reset", 0)) } d.working = !1, d.settings.onSlideAfter.call(e, d.children.eq(d.active.index), d.oldIndex, d.active.index) }, G = function (a) { d.settings.autoControlsCombine ? d.controls.autoEl.html(d.controls[a]) : (d.controls.autoEl.find("a").removeClass("active"), d.controls.autoEl.find("a:not(.bx-" + a + ")").addClass("active")) }, H = function () { 1 === q() ? (d.controls.prev.addClass("disabled"), d.controls.next.addClass("disabled")) : !d.settings.infiniteLoop && d.settings.hideControlOnEnd && (0 === d.active.index ? (d.controls.prev.addClass("disabled"), d.controls.next.removeClass("disabled")) : d.active.index === q() - 1 ? (d.controls.next.addClass("disabled"), d.controls.prev.removeClass("disabled")) : (d.controls.prev.removeClass("disabled"), d.controls.next.removeClass("disabled"))) }, I = function () { if (d.settings.autoDelay > 0) { setTimeout(e.startAuto, d.settings.autoDelay) } else e.startAuto(), a(window).focus(function () { e.startAuto() }).blur(function () { e.stopAuto() }); d.settings.autoHover && e.hover(function () { d.interval && (e.stopAuto(!0), d.autoPaused = !0) }, function () { d.autoPaused && (e.startAuto(!0), d.autoPaused = null) }) }, J = function () { var b, c, f, g, h, i, j, k, l = 0; "next" === d.settings.autoDirection ? e.append(d.children.clone().addClass("bx-clone")) : (e.prepend(d.children.clone().addClass("bx-clone")), b = d.children.first().position(), l = "horizontal" === d.settings.mode ? -b.left : -b.top), t(l, "reset", 0), d.settings.pager = !1, d.settings.controls = !1, d.settings.autoControls = !1, d.settings.tickerHover && (d.usingCSS ? (g = "horizontal" === d.settings.mode ? 4 : 5, d.viewport.hover(function () { c = e.css("-" + d.cssPrefix + "-transform"), f = parseFloat(c.split(",")[g]), t(f, "reset", 0) }, function () { k = 0, d.children.each(function (b) { k += "horizontal" === d.settings.mode ? a(this).outerWidth(!0) : a(this).outerHeight(!0) }), h = d.settings.speed / k, i = "horizontal" === d.settings.mode ? "left" : "top", j = h * (k - Math.abs(parseInt(f))), K(j) })) : d.viewport.hover(function () { e.stop() }, function () { k = 0, d.children.each(function (b) { k += "horizontal" === d.settings.mode ? a(this).outerWidth(!0) : a(this).outerHeight(!0) }), h = d.settings.speed / k, i = "horizontal" === d.settings.mode ? "left" : "top", j = h * (k - Math.abs(parseInt(e.css(i)))), K(j) })), K() }, K = function (a) { var b, c, f, g = a ? a : d.settings.speed, h = { left: 0, top: 0 }, i = { left: 0, top: 0 }; "next" === d.settings.autoDirection ? h = e.find(".bx-clone").first().position() : i = d.children.first().position(), b = "horizontal" === d.settings.mode ? -h.left : -h.top, c = "horizontal" === d.settings.mode ? -i.left : -i.top, f = { resetValue: c }, t(b, "ticker", g, f) }, L = function (b) { var c = a(window), d = { top: c.scrollTop(), left: c.scrollLeft() }, e = b.offset(); return d.right = d.left + c.width(), d.bottom = d.top + c.height(), e.right = e.left + b.outerWidth(), e.bottom = e.top + b.outerHeight(), !(d.right < e.left || d.left > e.right || d.bottom < e.top || d.top > e.bottom) }, M = function (a) { var b = document.activeElement.tagName.toLowerCase(), c = "input|textarea", d = new RegExp(b, ["i"]), f = d.exec(c); if (null == f && L(e)) { if (39 === a.keyCode) return z(a), !1; if (37 === a.keyCode) return A(a), !1 } }, N = function () { d.touch = { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } }, d.viewport.bind("touchstart MSPointerDown pointerdown", O), d.viewport.on("click", ".bxslider a", function (a) { d.viewport.hasClass("click-disabled") && (a.preventDefault(), d.viewport.removeClass("click-disabled")) }) }, O = function (a) { if (d.controls.el.addClass("disabled"), d.working) a.preventDefault(), d.controls.el.removeClass("disabled"); else { d.touch.originalPos = e.position(); var b = a.originalEvent, c = "undefined" != typeof b.changedTouches ? b.changedTouches : [b]; d.touch.start.x = c[0].pageX, d.touch.start.y = c[0].pageY, d.viewport.get(0).setPointerCapture && (d.pointerId = b.pointerId, d.viewport.get(0).setPointerCapture(d.pointerId)), d.viewport.bind("touchmove MSPointerMove pointermove", Q), d.viewport.bind("touchend MSPointerUp pointerup", R), d.viewport.bind("MSPointerCancel pointercancel", P) } }, P = function (a) { t(d.touch.originalPos.left, "reset", 0), d.controls.el.removeClass("disabled"), d.viewport.unbind("MSPointerCancel pointercancel", P), d.viewport.unbind("touchmove MSPointerMove pointermove", Q), d.viewport.unbind("touchend MSPointerUp pointerup", R), d.viewport.get(0).releasePointerCapture && d.viewport.get(0).releasePointerCapture(d.pointerId) }, Q = function (a) { var b = a.originalEvent, c = "undefined" != typeof b.changedTouches ? b.changedTouches : [b], e = Math.abs(c[0].pageX - d.touch.start.x), f = Math.abs(c[0].pageY - d.touch.start.y), g = 0, h = 0; 3 * e > f && d.settings.preventDefaultSwipeX ? a.preventDefault() : 3 * f > e && d.settings.preventDefaultSwipeY && a.preventDefault(), "fade" !== d.settings.mode && d.settings.oneToOneTouch && ("horizontal" === d.settings.mode ? (h = c[0].pageX - d.touch.start.x, g = d.touch.originalPos.left + h) : (h = c[0].pageY - d.touch.start.y, g = d.touch.originalPos.top + h), t(g, "reset", 0)) }, R = function (a) { d.viewport.unbind("touchmove MSPointerMove pointermove", Q), d.controls.el.removeClass("disabled"); var b = a.originalEvent, c = "undefined" != typeof b.changedTouches ? b.changedTouches : [b], f = 0, g = 0; d.touch.end.x = c[0].pageX, d.touch.end.y = c[0].pageY, "fade" === d.settings.mode ? (g = Math.abs(d.touch.start.x - d.touch.end.x), g >= d.settings.swipeThreshold && (d.touch.start.x > d.touch.end.x ? e.goToNextSlide() : e.goToPrevSlide(), e.stopAuto())) : ("horizontal" === d.settings.mode ? (g = d.touch.end.x - d.touch.start.x, f = d.touch.originalPos.left) : (g = d.touch.end.y - d.touch.start.y, f = d.touch.originalPos.top), !d.settings.infiniteLoop && (0 === d.active.index && g > 0 || d.active.last && 0 > g) ? t(f, "reset", 200) : Math.abs(g) >= d.settings.swipeThreshold ? (0 > g ? e.goToNextSlide() : e.goToPrevSlide(), e.stopAuto()) : t(f, "reset", 200)), d.viewport.unbind("touchend MSPointerUp pointerup", R), d.viewport.get(0).releasePointerCapture && d.viewport.get(0).releasePointerCapture(d.pointerId) }, S = function (b) { if (d.initialized) if (d.working) window.setTimeout(S, 10); else { var c = a(window).width(), h = a(window).height(); (f !== c || g !== h) && (f = c, g = h, e.redrawSlider(), d.settings.onSliderResize.call(e, d.active.index)) } }, T = function (a) { var b = p(); d.settings.ariaHidden && !d.settings.ticker && (d.children.attr("aria-hidden", "true"), d.children.slice(a, a + b).attr("aria-hidden", "false")) }, U = function (a) { return 0 > a ? d.settings.infiniteLoop ? q() - 1 : d.active.index : a >= q() ? d.settings.infiniteLoop ? 0 : d.active.index : a }; return e.goToSlide = function (b, c) { var f, g, h, i, j = !0, k = 0, l = { left: 0, top: 0 }, n = null; if (d.oldIndex = d.active.index, d.active.index = U(b), !d.working && d.active.index !== d.oldIndex) { if (d.working = !0, j = d.settings.onSlideBefore.call(e, d.children.eq(d.active.index), d.oldIndex, d.active.index), "undefined" != typeof j && !j) return d.active.index = d.oldIndex, void (d.working = !1); "next" === c ? d.settings.onSlideNext.call(e, d.children.eq(d.active.index), d.oldIndex, d.active.index) || (j = !1) : "prev" === c && (d.settings.onSlidePrev.call(e, d.children.eq(d.active.index), d.oldIndex, d.active.index) || (j = !1)), d.active.last = d.active.index >= q() - 1, (d.settings.pager || d.settings.pagerCustom) && E(d.active.index), d.settings.controls && H(), "fade" === d.settings.mode ? (d.settings.adaptiveHeight && d.viewport.height() !== m() && d.viewport.animate({ height: m() }, d.settings.adaptiveHeightSpeed), d.children.filter(":visible").fadeOut(d.settings.speed).css({ zIndex: 0 }), d.children.eq(d.active.index).css("zIndex", d.settings.slideZIndex + 1).fadeIn(d.settings.speed, function () { a(this).css("zIndex", d.settings.slideZIndex), F() })) : (d.settings.adaptiveHeight && d.viewport.height() !== m() && d.viewport.animate({ height: m() }, d.settings.adaptiveHeightSpeed), !d.settings.infiniteLoop && d.carousel && d.active.last ? "horizontal" === d.settings.mode ? (n = d.children.eq(d.children.length - 1), l = n.position(), k = d.viewport.width() - n.outerWidth()) : (f = d.children.length - d.settings.minSlides, l = d.children.eq(f).position()) : d.carousel && d.active.last && "prev" === c ? (g = 1 === d.settings.moveSlides ? d.settings.maxSlides - r() : (q() - 1) * r() - (d.children.length - d.settings.maxSlides), n = e.children(".bx-clone").eq(g), l = n.position()) : "next" === c && 0 === d.active.index ? (l = e.find("> .bx-clone").eq(d.settings.maxSlides).position(), d.active.last = !1) : b >= 0 && (i = b * parseInt(r()), l = d.children.eq(i).position()), "undefined" != typeof l ? (h = "horizontal" === d.settings.mode ? -(l.left - k) : -l.top, t(h, "slide", d.settings.speed)) : d.working = !1), d.settings.ariaHidden && T(d.active.index * r()) } }, e.goToNextSlide = function () { if (d.settings.infiniteLoop || !d.active.last) { var a = parseInt(d.active.index) + 1; e.goToSlide(a, "next") } }, e.goToPrevSlide = function () { if (d.settings.infiniteLoop || 0 !== d.active.index) { var a = parseInt(d.active.index) - 1; e.goToSlide(a, "prev") } }, e.startAuto = function (a) { d.interval || (d.interval = setInterval(function () { "next" === d.settings.autoDirection ? e.goToNextSlide() : e.goToPrevSlide() }, d.settings.pause), d.settings.autoControls && a !== !0 && G("stop")) }, e.stopAuto = function (a) { d.interval && (clearInterval(d.interval), d.interval = null, d.settings.autoControls && a !== !0 && G("start")) }, e.getCurrentSlide = function () { return d.active.index }, e.getCurrentSlideElement = function () { return d.children.eq(d.active.index) }, e.getSlideElement = function (a) { return d.children.eq(a) }, e.getSlideCount = function () { return d.children.length }, e.isWorking = function () { return d.working }, e.redrawSlider = function () { d.children.add(e.find(".bx-clone")).outerWidth(o()), d.viewport.css("height", m()), d.settings.ticker || s(), d.active.last && (d.active.index = q() - 1), d.active.index >= q() && (d.active.last = !0), d.settings.pager && !d.settings.pagerCustom && (u(), E(d.active.index)), d.settings.ariaHidden && T(d.active.index * r()) }, e.destroySlider = function () { d.initialized && (d.initialized = !1, a(".bx-clone", this).remove(), d.children.each(function () { void 0 !== a(this).data("origStyle") ? a(this).attr("style", a(this).data("origStyle")) : a(this).removeAttr("style") }), void 0 !== a(this).data("origStyle") ? this.attr("style", a(this).data("origStyle")) : a(this).removeAttr("style"), a(this).unwrap().unwrap(), d.controls.el && d.controls.el.remove(), d.controls.next && d.controls.next.remove(), d.controls.prev && d.controls.prev.remove(), d.pagerEl && d.settings.controls && !d.settings.pagerCustom && d.pagerEl.remove(), a(".bx-caption", this).remove(), d.controls.autoEl && d.controls.autoEl.remove(), clearInterval(d.interval), d.settings.responsive && a(window).unbind("resize", S), d.settings.keyboardEnabled && a(document).unbind("keydown", M), a(this).removeData("bxSlider")) }, e.reloadSlider = function (b) { void 0 !== b && (c = b), e.destroySlider(), h(), a(e).data("bxSlider", this) }, h(), a(e).data("bxSlider", this), this } } }(jQuery);

/*

 arcticModal  jQuery plugin
 Version: 0.3
 Author: Sergey Predvoditelev (sergey.predvoditelev@gmail.com)
 Company: Arctic Laboratory (http://arcticlab.ru/)

 Docs & Examples: http://arcticlab.ru/arcticmodal/

 */
!function (e) { var o = { type: "html", content: "", url: "", ajax: {}, ajax_request: null, closeOnEsc: !0, closeOnOverlayClick: !0, clone: !1, overlay: { block: void 0, tpl: '<div class="arcticmodal-overlay"></div>', css: { backgroundColor: "#000", opacity: .6 } }, container: { block: void 0, tpl: '<div class="arcticmodal-container"><table class="arcticmodal-container_i"><tr><td class="arcticmodal-container_i2"></td></tr></table></div>' }, wrap: void 0, body: void 0, errors: { tpl: '<div class="arcticmodal-error arcticmodal-close"></div>', autoclose_delay: 2e3, ajax_unsuccessful_load: "Error" }, openEffect: { type: "fade", speed: 400 }, closeEffect: { type: "fade", speed: 400 }, beforeOpen: e.noop, afterOpen: e.noop, beforeClose: e.noop, afterClose: e.noop, afterLoading: e.noop, afterLoadingOnShow: e.noop, errorLoading: e.noop }, a = 0, r = e([]), t = { isEventOut: function (o, a) { var r = !0; return e(o).each(function () { e(a.target).get(0) == e(this).get(0) && (r = !1), 0 == e(a.target).closest("HTML", e(this).get(0)).length && (r = !1) }), r } }, c = { getParentEl: function (o) { var a = e(o); return a.data("arcticmodal") ? a : (a = e(o).closest(".arcticmodal-container").data("arcticmodalParentEl"), a ? a : !1) }, transition: function (o, a, r, t) { switch (t = void 0 == t ? e.noop : t, r.type) { case "fade": "show" == a ? o.fadeIn(r.speed, t) : o.fadeOut(r.speed, t); break; case "none": "show" == a ? o.show() : o.hide(), t() } }, prepare_body: function (o, a) { e(".arcticmodal-close", o.body).unbind("click.arcticmodal").bind("click.arcticmodal", function () { return a.arcticmodal("close"), !1 }) }, init_el: function (o, i) { var l = o.data("arcticmodal"); if (!l) { if (l = i, a++, l.modalID = a, l.overlay.block = e(l.overlay.tpl), l.overlay.block.css(l.overlay.css), l.container.block = e(l.container.tpl), l.body = e(".arcticmodal-container_i2", l.container.block), i.clone ? l.body.html(o.clone(!0)) : (o.before('<div id="arcticmodalReserve' + l.modalID + '" style="display: none" />'), l.body.html(o)), c.prepare_body(l, o), l.closeOnOverlayClick && l.overlay.block.add(l.container.block).click(function (a) { t.isEventOut(e(">*", l.body), a) && o.arcticmodal("close") }), l.container.block.data("arcticmodalParentEl", o), o.data("arcticmodal", l), r = e.merge(r, o), e.proxy(n.show, o)(), "html" == l.type) return o; if (void 0 != l.ajax.beforeSend) { var d = l.ajax.beforeSend; delete l.ajax.beforeSend } if (void 0 != l.ajax.success) { var s = l.ajax.success; delete l.ajax.success } if (void 0 != l.ajax.error) { var f = l.ajax.error; delete l.ajax.error } var u = e.extend(!0, { url: l.url, beforeSend: function () { void 0 == d ? l.body.html('<div class="arcticmodal-loading" />') : d(l, o) }, success: function (e) { o.trigger("afterLoading"), l.afterLoading(l, o, e), void 0 == s ? l.body.html(e) : s(l, o, e), c.prepare_body(l, o), o.trigger("afterLoadingOnShow"), l.afterLoadingOnShow(l, o, e) }, error: function () { o.trigger("errorLoading"), l.errorLoading(l, o), void 0 == f ? (l.body.html(l.errors.tpl), e(".arcticmodal-error", l.body).html(l.errors.ajax_unsuccessful_load), e(".arcticmodal-close", l.body).click(function () { return o.arcticmodal("close"), !1 }), l.errors.autoclose_delay && setTimeout(function () { o.arcticmodal("close") }, l.errors.autoclose_delay)) : f(l, o) } }, l.ajax); l.ajax_request = e.ajax(u), o.data("arcticmodal", l) } }, init: function (a) { if (a = e.extend(!0, {}, o, a), !e.isFunction(this)) return this.each(function () { c.init_el(e(this), e.extend(!0, {}, a)) }); if (void 0 == a) return void e.error("jquery.arcticmodal: Uncorrect parameters"); if ("" == a.type) return void e.error('jquery.arcticmodal: Don\'t set parameter "type"'); switch (a.type) { case "html": if ("" == a.content) return void e.error('jquery.arcticmodal: Don\'t set parameter "content"'); var r = a.content; return a.content = "", c.init_el(e(r), a); case "ajax": return "" == a.url ? void e.error('jquery.arcticmodal: Don\'t set parameter "url"') : c.init_el(e("<div />"), a) } } }, n = { show: function () { var o = c.getParentEl(this); if (o === !1) return void e.error("jquery.arcticmodal: Uncorrect call"); var a = o.data("arcticmodal"); if (a.overlay.block.hide(), a.container.block.hide(), e("BODY").append(a.overlay.block), e("BODY").append(a.container.block), a.beforeOpen(a, o), o.trigger("beforeOpen"), "hidden" != a.wrap.css("overflow")) { a.wrap.data("arcticmodalOverflow", a.wrap.css("overflow")); var t = a.wrap.outerWidth(!0); a.wrap.css("overflow", "hidden"); var n = a.wrap.outerWidth(!0); n != t && a.wrap.css("marginRight", n - t + "px") } return r.not(o).each(function () { var o = e(this).data("arcticmodal"); o.overlay.block.hide() }), c.transition(a.overlay.block, "show", r.length > 1 ? { type: "none" } : a.openEffect), c.transition(a.container.block, "show", r.length > 1 ? { type: "none" } : a.openEffect, function () { a.afterOpen(a, o), o.trigger("afterOpen") }), o }, close: function () { return e.isFunction(this) ? void r.each(function () { e(this).arcticmodal("close") }) : this.each(function () { var o = c.getParentEl(this); if (o === !1) return void e.error("jquery.arcticmodal: Uncorrect call"); var a = o.data("arcticmodal"); a.beforeClose(a, o) !== !1 && (o.trigger("beforeClose"), r.not(o).last().each(function () { var o = e(this).data("arcticmodal"); o.overlay.block.show() }), c.transition(a.overlay.block, "hide", r.length > 1 ? { type: "none" } : a.closeEffect), c.transition(a.container.block, "hide", r.length > 1 ? { type: "none" } : a.closeEffect, function () { a.afterClose(a, o), o.trigger("afterClose"), a.clone || e("#arcticmodalReserve" + a.modalID).replaceWith(a.body.find(">*")), a.overlay.block.remove(), a.container.block.remove(), o.data("arcticmodal", null), e(".arcticmodal-container").length || (a.wrap.data("arcticmodalOverflow") && a.wrap.css("overflow", a.wrap.data("arcticmodalOverflow")), a.wrap.css("marginRight", 0)) }), "ajax" == a.type && a.ajax_request.abort(), r = r.not(o)) }) }, setDefault: function (a) { e.extend(!0, o, a) } }; e(function () { o.wrap = e(document.all && !document.querySelector ? "html" : "body") }), e(document).bind("keyup.arcticmodal", function (e) { var o = r.last(); if (o.length) { var a = o.data("arcticmodal"); a.closeOnEsc && 27 === e.keyCode && o.arcticmodal("close") } }), e.arcticmodal = e.fn.arcticmodal = function (o) { return n[o] ? n[o].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof o && o ? void e.error("jquery.arcticmodal: Method " + o + " does not exist") : c.init.apply(this, arguments) } }(jQuery);

/*
* jquery-match-height master by @liabru
* http://brm.io/jquery-match-height/
* License MIT
*/
!function (t) { "use strict"; "function" == typeof define && define.amd ? define(["jquery"], t) : "undefined" != typeof module && module.exports ? module.exports = t(require("jquery")) : t(jQuery) }(function (t) {
    var e = -1, o = -1, i = function (t) { return parseFloat(t) || 0 }, n = function (e) { var o = 1, n = t(e), a = null, r = []; return n.each(function () { var e = t(this), n = e.offset().top - i(e.css("margin-top")), s = r.length > 0 ? r[r.length - 1] : null; null === s ? r.push(e) : Math.floor(Math.abs(a - n)) <= o ? r[r.length - 1] = s.add(e) : r.push(e), a = n }), r }, a = function (e) {
        var o = {
            byRow: !0, property: "height", target: null, remove: !1
        }; return "object" == typeof e ? t.extend(o, e) : ("boolean" == typeof e ? o.byRow = e : "remove" === e && (o.remove = !0), o)
    }, r = t.fn.matchHeight = function (e) { var o = a(e); if (o.remove) { var i = this; return this.css(o.property, ""), t.each(r._groups, function (t, e) { e.elements = e.elements.not(i) }), this } return this.length <= 1 && !o.target ? this : (r._groups.push({ elements: this, options: o }), r._apply(this, o), this) }; r.version = "master", r._groups = [], r._throttle = 80, r._maintainScroll = !1, r._beforeUpdate = null,
    r._afterUpdate = null, r._rows = n, r._parse = i, r._parseOptions = a, r._apply = function (e, o) {
        var s = a(o), h = t(e), c = [h], l = t(window).scrollTop(), p = t("html").outerHeight(!0), d = h.parents().filter(":hidden"); return d.each(function () { var e = t(this); e.data("style-cache", e.attr("style")) }), d.css("display", "block"), s.byRow && !s.target && (h.each(function () {
            var e = t(this), o = e.css("display"); "inline-block" !== o && "flex" !== o && "inline-flex" !== o && (o = "block"), e.data("style-cache", e.attr("style")), e.css({
                display: o, "padding-top": "0",
                "padding-bottom": "0", "margin-top": "0", "margin-bottom": "0", "border-top-width": "0", "border-bottom-width": "0", height: "100px", overflow: "hidden"
            })
        }), c = n(h), h.each(function () { var e = t(this); e.attr("style", e.data("style-cache") || "") })), t.each(c, function (e, o) {
            var n = t(o), a = 0; if (s.target) a = s.target.outerHeight(!1); else {
                if (s.byRow && n.length <= 1) return void n.css(s.property, ""); n.each(function () {
                    var e = t(this), o = e.css("display"); "inline-block" !== o && "flex" !== o && "inline-flex" !== o && (o = "block"); var i = { display: o }; i[s.property] = "",
                    e.css(i), e.outerHeight(!1) > a && (a = e.outerHeight(!1)), e.css("display", "")
                })
            } n.each(function () { var e = t(this), o = 0; s.target && e.is(s.target) || ("border-box" !== e.css("box-sizing") && (o += i(e.css("border-top-width")) + i(e.css("border-bottom-width")), o += i(e.css("padding-top")) + i(e.css("padding-bottom"))), e.css(s.property, a - o + "px")) })
        }), d.each(function () { var e = t(this); e.attr("style", e.data("style-cache") || null) }), r._maintainScroll && t(window).scrollTop(l / p * t("html").outerHeight(!0)), this
    }, r._applyDataApi = function () {
        var e = {}; t("[data-match-height], [data-mh]").each(function () { var o = t(this), i = o.attr("data-mh") || o.attr("data-match-height"); i in e ? e[i] = e[i].add(o) : e[i] = o }), t.each(e, function () { this.matchHeight(!0) })
    }; var s = function (e) { r._beforeUpdate && r._beforeUpdate(e, r._groups), t.each(r._groups, function () { r._apply(this.elements, this.options) }), r._afterUpdate && r._afterUpdate(e, r._groups) }; r._update = function (i, n) {
        if (n && "resize" === n.type) { var a = t(window).width(); if (a === e) return; e = a } i ? -1 === o && (o = setTimeout(function () {
            s(n), o = -1
        }, r._throttle)) : s(n)
    }, t(r._applyDataApi), t(window).bind("load", function (t) { r._update(!1, t) }), t(window).bind("resize orientationchange", function (t) { r._update(!0, t) })
});

// Application Scripts:
// Покажем / спрячем хидер и кнопку скролла страницы
// Навигация по секциям на главной странице
// Навигация по внутренним страницам (когда ссылки в хидере ведут на главную)
// Гугл карта
// Слайдер (головы)
// Слайдер (вакансии)
// Слайдер новостей
// Слайдер партнеров
// Слайдер HERO (fullpage изображения)
// Список с выпадайками
// Стилизуем input file field
// Скролл по странице к нужному id
// Если браузер не знает о плейсхолдерах в формах

jQuery(document).ready(function ($) {
    //
    // Покажем / спрячем хидер и кнопку скролла страницы
    //---------------------------------------------------------------------------------------
    (function () {
        var $header = $('.js-header'),
            //isHeaderVisible = false,//флаг состояния
            isScrollerVisible = false,
            $scroller = $('<button type="button" class="scroll-up-btn"><i class="icon-up"></i></button>'),
            method = {};

        $('body').append($scroller);

        //method.showHeader = function () {
        //    $header.addClass('visible');
        //    isHeaderVisible = true;
        //};

        //method.hideHeader = function () {
        //    $header.removeClass('visible');
        //    isHeaderVisible = false;
        //};

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
            //if (fromTop >= 100 && !isHeaderVisible) {
            //    method.showHeader();
            //} else if (fromTop < 100 && isHeaderVisible) {
            //    method.hideHeader();
            //};

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
    // Навигация по секциям на главной странице
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

        $('.p-footer__column').on('click', 'a[data-scroll-link]', function (e) {//если нужен скролл по стиранице по клику в футере (в разделе Контакты) - к линку добавим data-scroll-link
            e.preventDefault();
            var link = $(this).attr('href');
            link = link.slice(link.indexOf('#'), link.length); //обрежем все до символа #
            $('html,body').animate({ scrollTop: $(link).offset().top }, 800);
        });
    };

    if ($('.js-navigate').length) {
        sectionNav();
    };

    //
    // Навигация по внутренним страницам (когда ссылки в хидере ведут на главную)
    //---------------------------------------------------------------------------------------
    function innerPageNav() {
        var $pager = $('.b-pager'),
            $menu_link = $pager.find('.b-pager__link'),
            $sections = $('.page__section'),
            $footer = $('.b-footer'),
            $header = $('.b-header__container'), //на мобильных когда вернемся на первый экран - прокрутим к началу, чтобы показать лого на первом экране
            isFooterVisible = false,//будем показывать/скрывать футер с кнопками при скролле (скрывать на первой и последней секции)
            isGoogleMapLoad = false,//будем загружать Гугл-карту когда дойдем до последней секции
            isGoogleMapNeed = false,//будем загружать Гугл-карту только если она есть на странице!
            method = {};

        if ($('#map').length) {
            isGoogleMapNeed = true;
        };

        method.changeLinkState = function (el) {//находим и подсвечиваем линк в хидере и пейджере
            $menu_link.removeClass('current');
            var $current = $('.b-pager').find('a[href^="#' + el + '"]');
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

        method.makePagerLight = function () {
            $pager.addClass('b-pager--alt');
        };

        method.makePagerDefault = function () {
            $pager.removeClass('b-pager--alt');
        };

        var waypoints = $sections.waypoint({//подключили плагин
            handler: function (direction) {
                var prev = this.previous();//предыдущая секция

                if (this === this.group.last() && !isGoogleMapLoad && isGoogleMapNeed) {//когда дошли до последней секции - загрузим карту
                    initGoogleMap();
                    isGoogleMapLoad = true;
                };


                if (direction === 'down') {//скроллим вниз
                    method.changeLinkState(this.element.id);

                    if (this !== this.group.first() && !isFooterVisible) {
                        method.showFooter();
                        method.makePagerDefault();
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
                        method.makePagerLight();
                    };
                };
            },
            group: 'section',
            offset: '35%'
        });

        $pager.on('click', 'a', function (e) {//перехватываем клик по линку в пейджере
            e.preventDefault();
            var $el = $(this);
            method.scrollToContent($el);
        });


        $('.p-menu').on('click', 'a[data-scroll-link]', function (e) {//скролл по клику в футере(в разделе Контакты)
            e.preventDefault();
            var $el = $(this);
            method.scrollToContent($el);
        });
    };

    if ($('.js-page-navigate').length) {
        innerPageNav();
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
    // Слайдер новостей
    //---------------------------------------------------------------------------------------
    function initNewsSlider() {
        var $slider = $('.js-news-slider'),
            rtime, //переменные для пересчета ресайза окна с задержкой delta - будем показывать разное кол-во слайдов на разных разрешениях
            timeout = false,
            delta = 200,
            isImagesLoaded = false, //при загрузке слайдера покажем 3 первые фотки, остальные - после первой прокрутки
            method = {};

        method.getSliderSettings = function () {
            var setting,
                    settings1 = {
                        maxSlides: 1,
                        minSlides: 1,
                    },
                    settings2 = {
                        maxSlides: 2,
                        minSlides: 2,
                    },
                    settings3 = {
                        maxSlides: 3,
                        minSlides: 3,
                    },
                    common = {
                        slideWidth: 280,
                        moveSlides: 1,
                        slideMargin: 10,
                        auto: false,
                        infiniteLoop: false,
                        hideControlOnEnd: true,
                        useCSS: false,
                        nextText: '<i class="icon-right-arrow"></i>',
                        prevText: '<i class="icon-left-arrow"></i>',
                        pager: true,
                        onSlideBefore: function () {//если картинки не загружены - загружаем
                            if (!isImagesLoaded) {
                                method.showAllImages();
                            };
                        }
                    },
                    winW = $.viewportW(); //ширина окна

            if (winW < 640) {
                setting = $.extend(settings1, common);
            };
            if (winW >= 640 && winW < 992) {
                setting = $.extend(settings2, common);
            };
            if (winW >= 992) {
                setting = $.extend(settings3, common);
            };
            
            return setting;
        };

        method.reloadSliderSettings = function () {
            $slider.reloadSlider($.extend(method.getSliderSettings(), { startSlide: $slider.getCurrentSlide() }));
        };


        method.endResize = function () {
            if (new Date() - rtime < delta) {
                setTimeout(method.endResize, delta);
            } else {
                timeout = false;
                //ресайз окончен - пересчитываем
                method.reloadSliderSettings();
            }
        };

        method.startResize = function () {
            rtime = new Date();
            if (timeout === false) {
                timeout = true;
                setTimeout(method.endResize, delta);
            }
        };

        method.show3images = function () {//при загрузке слайдера, сперва загрузим первые 3 картинки
            for (var i = 0; i < 3; i++) {
                var $img = $slider.children('li').eq(i).find('.js-slider-img');
                if ($img.length) {
                    method.loadSliderImage($img);
                };
            };
        };

        method.showAllImages = function () {//дозагрузим остальные картинки в слайдер после первой прокрутки
            isImagesLoaded = true;
            $slider.children('li').each(function () {
                var $img = $(this).find('.js-slider-img');
                if ($img.length) {
                    method.loadSliderImage($img);
                };
            });
        };

        method.loadSliderImage = function (el) {
            var source = el.data('img');
            if (source != '') {
                el.attr('src', source);
                el.removeClass('js-slider-img');
            };
        };

        method.matchHeightContent = function () {//выровняем по высоте заголовки и блоки контента
            $slider.find('.b-news__title').matchHeight({ byRow: false });
            $slider.find('.b-news__quote').matchHeight({ byRow: false });
        };


        //запускаем
        method.matchHeightContent();//выровняем по высоте заголовки и блоки контента
        $slider.bxSlider(method.getSliderSettings());//запускаем слайдер
        method.show3images();//загрузили видимые картинки
        $(window).bind('resize', method.startResize);//пересчитываем кол-во видимых элементов при ресайзе окна с задержкой .2с
    };

    if ($('.js-news-slider').length) {
        initNewsSlider();
    };

    //
    // Слайдер партнеров
    //---------------------------------------------------------------------------------------
    function initPartnersSlider() {
        var $slider = $('.js-partner-slider'),
            rtime, //переменные для пересчета ресайза окна с задержкой delta - будем показывать разное кол-во слайдов на разных разрешениях
            timeout = false,
            delta = 200,
            method = {};

        method.getSliderSettings = function () {
            var setting,
                    settings1 = {
                        maxSlides: 1,
                        minSlides: 1,
                    },
                    settings2 = {
                        maxSlides: 2,
                        minSlides: 2,
                    },
                    settings3 = {
                        maxSlides: 3,
                        minSlides: 3,
                    },
                    common = {
                        slideWidth: 230,
                        moveSlides: 1,
                        slideMargin: 65,
                        auto: false,
                        infiniteLoop: false,
                        hideControlOnEnd: true,
                        useCSS: false,
                        nextSelector: $('.js-parent-slider-next'),
                        prevSelector: $('.js-parent-slider-prev'),
                        nextText: '<i class="icon-right-arrow"></i>&emsp;Next',
                        prevText: 'Prev&emsp;<i class="icon-left-arrow"></i>',
                        pager: true,
                    },
                    winW = $.viewportW(); //ширина окна

            if (winW < 550) {
                setting = $.extend(settings1, common);
            };
            if (winW >= 550 && winW < 850) {
                setting = $.extend(settings2, common);
            };
            if (winW >= 850) {
                setting = $.extend(settings3, common);
            };
            return setting;
        };

        method.reloadSliderSettings = function () {
            $slider.reloadSlider($.extend(method.getSliderSettings(), { startSlide: $slider.getCurrentSlide() }));
        };

        method.endResize = function () {
            if (new Date() - rtime < delta) {
                setTimeout(method.endResize, delta);
            } else {
                timeout = false;
                //ресайз окончен - пересчитываем
                method.reloadSliderSettings();
            }
        };

        method.startResize = function () {
            rtime = new Date();
            if (timeout === false) {
                timeout = true;
                setTimeout(method.endResize, delta);
            }
        };

        //запускаем
        $slider.bxSlider(method.getSliderSettings());//запускаем слайдер
        $(window).bind('resize', method.startResize);//пересчитываем кол-во видимых элементов при ресайзе окна с задержкой .2с
    };
    if ($('.js-partner-slider').length) {
        initPartnersSlider();
    };

    //
    // Слайдер HERO (fullpage изображения)
    //---------------------------------------------------------------------------------------
    function initHeroSlider() {
        var $slider = $('.js-heroslider');

        $slider.bxSlider({
            controls: false,
            pager: true,
            auto: true,
            mode: 'fade',
            pause: 7000,
            autoDelay: 5000,
            onSliderLoad: loadImages()
        });

        function loadImages() {
            $slider.find('.b-heroslider__bg').each(function () {
                var source = $(this).data('image');
                if (source != '') {
                    $(this).css('background-image', 'url(' + source + ')').removeAttr('data-image');
                }
            });
        };
    };
    if ($('.js-heroslider').length) {
        initHeroSlider();
    };

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
    // Скролл по странице к нужному id
    //---------------------------------------------------------------------------------------
    $(document).on('click', '[data-scroll-to-id]', function (e) {
        e.preventDefault;
        var id = $(this).data('scroll-to-id');
        if ($(id).length) {
            $('html,body').animate({ scrollTop: $(id).offset().top }, 800);
        }
    });
   
    //
    // Если браузер не знает о плейсхолдерах в формах
    //---------------------------------------------------------------------------------------
    if ($('html').hasClass('no-placeholder')) {
        /* Placeholders.js v4.0.1 */
        !function (a) { "use strict"; function b() { } function c() { try { return document.activeElement } catch (a) { } } function d(a, b) { for (var c = 0, d = a.length; d > c; c++) if (a[c] === b) return !0; return !1 } function e(a, b, c) { return a.addEventListener ? a.addEventListener(b, c, !1) : a.attachEvent ? a.attachEvent("on" + b, c) : void 0 } function f(a, b) { var c; a.createTextRange ? (c = a.createTextRange(), c.move("character", b), c.select()) : a.selectionStart && (a.focus(), a.setSelectionRange(b, b)) } function g(a, b) { try { return a.type = b, !0 } catch (c) { return !1 } } function h(a, b) { if (a && a.getAttribute(B)) b(a); else for (var c, d = a ? a.getElementsByTagName("input") : N, e = a ? a.getElementsByTagName("textarea") : O, f = d ? d.length : 0, g = e ? e.length : 0, h = f + g, i = 0; h > i; i++) c = f > i ? d[i] : e[i - f], b(c) } function i(a) { h(a, k) } function j(a) { h(a, l) } function k(a, b) { var c = !!b && a.value !== b, d = a.value === a.getAttribute(B); if ((c || d) && "true" === a.getAttribute(C)) { a.removeAttribute(C), a.value = a.value.replace(a.getAttribute(B), ""), a.className = a.className.replace(A, ""); var e = a.getAttribute(I); parseInt(e, 10) >= 0 && (a.setAttribute("maxLength", e), a.removeAttribute(I)); var f = a.getAttribute(D); return f && (a.type = f), !0 } return !1 } function l(a) { var b = a.getAttribute(B); if ("" === a.value && b) { a.setAttribute(C, "true"), a.value = b, a.className += " " + z; var c = a.getAttribute(I); c || (a.setAttribute(I, a.maxLength), a.removeAttribute("maxLength")); var d = a.getAttribute(D); return d ? a.type = "text" : "password" === a.type && g(a, "text") && a.setAttribute(D, "password"), !0 } return !1 } function m(a) { return function () { P && a.value === a.getAttribute(B) && "true" === a.getAttribute(C) ? f(a, 0) : k(a) } } function n(a) { return function () { l(a) } } function o(a) { return function () { i(a) } } function p(a) { return function (b) { return v = a.value, "true" === a.getAttribute(C) && v === a.getAttribute(B) && d(x, b.keyCode) ? (b.preventDefault && b.preventDefault(), !1) : void 0 } } function q(a) { return function () { k(a, v), "" === a.value && (a.blur(), f(a, 0)) } } function r(a) { return function () { a === c() && a.value === a.getAttribute(B) && "true" === a.getAttribute(C) && f(a, 0) } } function s(a) { var b = a.form; b && "string" == typeof b && (b = document.getElementById(b), b.getAttribute(E) || (e(b, "submit", o(b)), b.setAttribute(E, "true"))), e(a, "focus", m(a)), e(a, "blur", n(a)), P && (e(a, "keydown", p(a)), e(a, "keyup", q(a)), e(a, "click", r(a))), a.setAttribute(F, "true"), a.setAttribute(B, T), (P || a !== c()) && l(a) } var t = document.createElement("input"), u = void 0 !== t.placeholder; if (a.Placeholders = { nativeSupport: u, disable: u ? b : i, enable: u ? b : j }, !u) { var v, w = ["text", "search", "url", "tel", "email", "password", "number", "textarea"], x = [27, 33, 34, 35, 36, 37, 38, 39, 40, 8, 46], y = "#ccc", z = "placeholdersjs", A = new RegExp("(?:^|\\s)" + z + "(?!\\S)"), B = "data-placeholder-value", C = "data-placeholder-active", D = "data-placeholder-type", E = "data-placeholder-submit", F = "data-placeholder-bound", G = "data-placeholder-focus", H = "data-placeholder-live", I = "data-placeholder-maxlength", J = 100, K = document.getElementsByTagName("head")[0], L = document.documentElement, M = a.Placeholders, N = document.getElementsByTagName("input"), O = document.getElementsByTagName("textarea"), P = "false" === L.getAttribute(G), Q = "false" !== L.getAttribute(H), R = document.createElement("style"); R.type = "text/css"; var S = document.createTextNode("." + z + " {color:" + y + ";}"); R.styleSheet ? R.styleSheet.cssText = S.nodeValue : R.appendChild(S), K.insertBefore(R, K.firstChild); for (var T, U, V = 0, W = N.length + O.length; W > V; V++) U = V < N.length ? N[V] : O[V - N.length], T = U.attributes.placeholder, T && (T = T.nodeValue, T && d(w, U.type) && s(U)); var X = setInterval(function () { for (var a = 0, b = N.length + O.length; b > a; a++) U = a < N.length ? N[a] : O[a - N.length], T = U.attributes.placeholder, T ? (T = T.nodeValue, T && d(w, U.type) && (U.getAttribute(F) || s(U), (T !== U.getAttribute(B) || "password" === U.type && !U.getAttribute(D)) && ("password" === U.type && !U.getAttribute(D) && g(U, "text") && U.setAttribute(D, "password"), U.value === U.getAttribute(B) && (U.value = T), U.setAttribute(B, T)))) : U.getAttribute(C) && (k(U), U.removeAttribute(B)); Q || clearInterval(X) }, J); e(a, "beforeunload", function () { M.disable() }) } }(this);
    };
    
});
