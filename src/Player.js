var Player = cc.Sprite.extend({
    ctor: function() {
        this._super();
        this.initWithFile( 'images/Player.png' );
        this.scheduleUpdate();
        this.winkSpeed = 2;
    },
    update: function( dt ) {
        var opacity = this.getOpacity();
        this.setOpacity( opacity-this.winkSpeed );
        opacity = this.getOpacity();
        if( opacity < 100 || opacity > 255) {
            this.winkSpeed *= -1;
        }
    }
});