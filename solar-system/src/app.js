var SolarSystem = (function() {

    function SolarSystem(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        var ctx = this.ctx;

        ctx.beginPath();
        ctx.moveTo(50, 50);
        ctx.lineTo(100, 100);
        ctx.stroke();
    }

    return SolarSystem;
})();
