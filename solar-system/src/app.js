var SolarSystem = (function() {

    function SolarSystem(canvas) {
        var _this = this;
        this.canvas = canvas;
        this.cvsWrapper = canvas.parentNode;
        this.ctx = canvas.getContext('2d');
        this.bounds = {};
        this.aspect = 16/9;
        // this.calculateBounds();

        this.sun = new Sun(this.bounds);

        this.draw();

        this.onResize();

        window.addEventListener('resize', function() {
            _this.onResize();
        });
    }

    SolarSystem.prototype.calculateBounds = function() {
        var boundsWidth = this.canvas.width;
        var boundsHeight = this.canvas.height;
        // var boundsHeight = Math.round((boundsWidth/this.aspect));
        // var boundsHeightMargin = (this.canvas.height - boundsHeight) / 2;

        this.bounds.x = 0;
        // this.bounds.y = 0 + boundsHeightMargin;
        this.bounds.y = 0;

        this.bounds.w = boundsWidth;
        this.bounds.h = boundsHeight;

        this.bounds.cx = this.bounds.x + this.bounds.w / 2;
        this.bounds.cy = this.bounds.y + this.bounds.h / 2;
    };

    SolarSystem.prototype.onResize = function() {
        var c = this.canvas;
        var wrapper = c.parentNode;

        var w = wrapper.clientWidth;
        var h = wrapper.clientHeight;

        var curRatio = w / h;

        if (curRatio > this.aspect) {
            c.height = h;
            c.width = h * this.aspect;
        } else {
            c.width = w;
            c.height = w / this.aspect;
        }

        this.calculateBounds();

        this.sun.setBounds(this.bounds);
        this.draw();
    };

    SolarSystem.prototype.update = function() {
        this.sun.update();
    };

    SolarSystem.prototype.draw = function() {
        var ctx = this.ctx;
        var bnds = this.bounds;

        ctx.beginPath();
        ctx.rect(bnds.x, bnds.y, bnds.w, bnds.h);
        ctx.fillStyle = 'black';
        ctx.fill();

        this.sun.draw(ctx);
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
        this.bounds = bounds;

        this.x = this.bounds.x + 10;
        this.y = this.bounds.y + 10;
        this.r = 10;

        this.v = {};
        this.v.x = 4;
        this.v.y = 2;
    }

    Sun.prototype.setBounds = function(newBounds) {
        this.bounds = newBounds;
    };

    Sun.prototype.update = function() {
        this.r = this.bounds.h * 0.03;
        this.x += this.v.x;
        this.y += this.v.y;
    };

    Sun.prototype.draw = function(ctx) {
        var bnds = this.bounds;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'yellow';
        ctx.fill();
    };

    return Sun;
})();
