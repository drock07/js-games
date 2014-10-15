var SolarSystem = (function() {

    function SolarSystem(canvas) {
        var _this = this;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.bounds = {};
        this.aspect = 16/9;

        this.resizeCanvas();
        this.calculateBounds();

        // this.onResize();

        this.bodies = [];
        this.bodies.push(new Sun(this.bounds));
        this.bodies.push(new Earth(this.bounds));

        this.startTime = new Date();

        // this.draw();


        window.addEventListener('resize', function() {
            _this.onResize();
        });
    }

    SolarSystem.prototype.resizeCanvas = function() {
        var c = this.canvas;
        var wrapper = c.parentNode;

        c.style.marginLeft = c.style.marginTop = 0;

        var w = wrapper.clientWidth;
        var h = wrapper.clientHeight;

        var curRatio = w / h;
        var margin;
        if (curRatio > this.aspect) {

            c.height = h;
            c.width = h * this.aspect;

            margin = (w - c.width) / 2;

            c.style.marginLeft = margin;
        } else {

            c.width = w;
            c.height = w / this.aspect;

            margin = (h - c.height) / 2;

            c.style.marginTop = margin;
        }
    };

    SolarSystem.prototype.calculateBounds = function() {
        var boundsWidth = this.canvas.width;
        var boundsHeight = this.canvas.height;

        this.bounds.x = 0;
        this.bounds.y = 0;

        this.bounds.w = boundsWidth;
        this.bounds.h = boundsHeight;

        this.bounds.cx = this.bounds.x + this.bounds.w / 2;
        this.bounds.cy = this.bounds.y + this.bounds.h / 2;
    };

    SolarSystem.prototype.onResize = function() {
        this.resizeCanvas();

        this.calculateBounds();

        // this.sun.onResize(this.bounds.cx, this.bounds.cy, this.bounds.h);
        var i;
        for(i=0;i<this.bodies.length;i++){
            this.bodies[i].onResize(this.bounds);
        }

        // this.draw();
    };

    SolarSystem.prototype.update = function() {
        var time = new Date();
        var i;
        for(i=0;i<this.bodies.length;i++){
            this.bodies[i].update(time - this.startTime);
        }
    };

    SolarSystem.prototype.draw = function() {
        var ctx = this.ctx;
        var bnds = this.bounds;

        ctx.beginPath();
        ctx.rect(bnds.x, bnds.y, bnds.w, bnds.h);
        ctx.fillStyle = 'black';
        ctx.fill();

        var i;
        for(i=0;i<this.bodies.length;i++){
            this.bodies[i].draw(ctx);
        }

    };

    SolarSystem.prototype.animate = function() {
        var _this = this;

        this.update();

        this.draw();

        requestAnimFrame(function() {
            _this.animate();
        });
    };

    return SolarSystem;
})();

var Sun = (function() {

    function Sun(bounds) {
        this.o = {};
        this.onResize(bounds);
    }

    Sun.prototype.onResize = function(bounds) {
        this.o.x = bounds.cx;
        this.o.y = bounds.cy;
        this.r = bounds.h * 0.03;
    };

    Sun.prototype.update = function(time) {
        this.scalingFactorSin = Math.sin(time * 2*Math.PI / 5000) / 20 + 1.1;
        this.scalingFactorCos = -1 * Math.cos(time * 2*Math.PI / 5000) / 20 + 1.1;
    };

    Sun.prototype.draw = function(ctx) {

        ctx.save();

        ctx.translate(this.o.x, this.o.y);
        ctx.scale(this.scalingFactorSin, this.scalingFactorCos);
        ctx.beginPath();
        ctx.arc(0, 0, this.r, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'yellow';
        ctx.fill();

        ctx.restore();
    };

    return Sun;
})();

var Earth = (function() {

    function Earth(bounds) {
        this.o = {};
        this.onResize(bounds);
        this.angle = 0;
    }

    Earth.prototype.onResize = function(bounds) {
        this.o.x = bounds.cx;
        this.o.y = bounds.cy;
        this.r = bounds.h * 0.01;
        this.radialDistance = this.r * 40;
    };

    Earth.prototype.update = function(time) {
        this.angle += 0.02 * Math.PI / 180;
    };

    Earth.prototype.draw = function(ctx) {

        // draw earth orbit
        ctx.save();

        ctx.translate(this.o.x, this.o.y);

        ctx.save();

        ctx.globalAlpha = 0.3;

        ctx.beginPath();
        ctx.moveTo(this.radialDistance, 0);
        ctx.arc(0, 0, this.radialDistance, 0, 2 * Math.PI, false);
        ctx.closePath();

        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        ctx.restore();

        ctx.rotate(this.angle);
        ctx.translate(this.radialDistance, 0);

        // draw earth
        ctx.save();

        ctx.beginPath();
        ctx.arc(0, 0, this.r, 0, 2 * Math.PI, false);
        ctx.closePath();

        ctx.fillStyle = 'green';
        ctx.fill();

        ctx.restore();

        // draw moon orbit
        ctx.save();

        ctx.globalAlpha = 0.3;

        ctx.beginPath();
        ctx.moveTo(20, 0);
        ctx.arc(0, 0, 20, 0, 2 * Math.PI, false);
        ctx.closePath();

        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        ctx.restore();

        // draw moon
        ctx.rotate(this.angle * 50);
        ctx.translate(20, 0);

        ctx.beginPath();
        ctx.arc(0, 0, this.r * 0.3, 0, 2 * Math.PI, false);
        ctx.closePath();

        ctx.fillStyle = 'gray';
        ctx.fill();

        ctx.restore();
    };

    return Earth;
})();


