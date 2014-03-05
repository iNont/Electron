var Player = cc.Sprite.extend({
    ctor: function() {
        this._super();
        this.initWithFile( 'images/Player.png' );
    },
    update: function( dt ) 
    {
    }
});