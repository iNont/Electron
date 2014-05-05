var ImageShow = cc.Sprite.extend({
    ctor: function( name ) {
        this._super();
        this.initWithFile( "images/"+name );
    },
    reset: function( name ) {
        this.initWithFile( "images/"+name );

    },
});