"use strict";
! function() {
    function t(t, h) {
        return Math.sqrt(t * t + h * h)
    }

    function h(h, i) {
        var s = h.angle;
        d.translate(h.x, h.y), d.rotate(s);
        var a = t(h.dx - h.ox, h.dy - h.oy) / .05;
        d.drawImage(h.img, 0, 50 * i, 72, 50, 100, 100, 72, 50), d.rotate(-s), d.translate(-h.x, -h.y)
    }

    function i() {
        r.length < 3 && r.push(new y), ++e % o == 0 && (x >= 3 ? x = 1 : x += 1), n.width = n.width;
        for (var t = 0; t < r.length; t++) {
            var s = r[t];
            s.calc(), h(s, x)
        }
        requestAnimationFrame(i)
    }
    var s = $(window).width(),
        a = $(window).height(),
        n = document.getElementById("fish"),
        d = n.getContext("2d"),
        e = 0,
        o = 12,
        r = [];
    n.width = 2 * s, n.height = 2 * a;
    var g = new Image,
        x = 0;
    g.onload = function() {
        i()
    }, g.src = "http://cdn.pengsuplus.cn/invitation/static/h5/img/8-fish1.png";
    var y = function() {
        this.ox = this.dx = Math.random() - .5, this.oy = this.dy = Math.random() - .5, this.x = n.width * Math.random(), this.y = n.height * Math.random(), this.img = g
    };
    y.prototype.calc = function() {
        this.ox = this.dx, this.oy = this.dy;
        (this.x < .1 * n.width || this.x > .9 * n.width || this.y < .2 * n.height || this.y > .8 * n.height) && (this.dx += (n.width / 2 - this.x) / 5e3, this.dy += (n.height / 2 - this.y) / 5e3), this.angle = Math.atan2(this.dy, this.dx);
        var h = Math.max(.1, Math.min(1, t(this.dx, this.dy)));
        this.dx = Math.cos(this.angle) * (h + 2), this.dy = Math.sin(this.angle) * (h + 2), this.x += this.dx, this.y += this.dy
    }
}();