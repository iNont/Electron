var CrashEffect = cc.Sprite.extend({
    ctor: function( layer ) {
    	this.layer = layer;
        this._super();
        this.scheduleUpdate();
        this.setScale( gameScale );
        this.setPosition( new cc.Point( screenWidth/2, screenHeight/2 ) );
    },
    update: function( dt ) {
    	this.setOpacity( this.getOpacity()+this.diffOpac );
    	if( this.getOpacity()==255 )
    		this.diffOpac=-CrashEffect.OPACITY_HIDE;
        if( this.getOpacity()==0 )
            this.unscheduleUpdate();
    },

    reset: function( type ){
        var src="images/"+type+"Effect.png";
        this.initWithFile( src );
        this.diffOpac=CrashEffect.OPACITY_SHOW;
        this.setOpacity( 0 );
        this.scheduleUpdate();
    }
});

CrashEffect.OPACITY_SHOW = 51;
CrashEffect.OPACITY_HIDE = 17;