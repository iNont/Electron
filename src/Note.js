var Note = cc.Sprite.extend({
    ctor: function(clickPos,angle) {
        this._super();
        this.clickPos=clickPos;
        this.angle=angle;
    }
});