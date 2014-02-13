var Player = cc.Sprite.extend({
    ctor: function() {
        this._super();
        this.initWithFile( 'images/dot.png' );
    },
    update: function( dt ) {
        var pos = this.getPosition();
    }
});