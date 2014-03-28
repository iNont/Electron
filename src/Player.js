var Player = cc.Sprite.extend({
    ctor: function() {
        this._super();
        this.initWithFile( "images/Player.png" );
        this.scheduleUpdate();
        this.winkSpeed=Player.WINK_SPEED;
    },
    update: function( dt ) {
        var opacity=this.getOpacity();
        this.setOpacity( opacity-this.winkSpeed );
        opacity=this.getOpacity();
        if( opacity<Player.WINK_OPACITY_MIN || opacity>Player.WINK_OPACITY_MAX )
            this.winkSpeed*=-1;
    }
});

Player.WINK_SPEED = 2;
Player.WINK_OPACITY_MIN = 100;
Player.WINK_OPACITY_MAX = 255;