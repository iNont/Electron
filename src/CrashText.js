var CrashText = cc.Sprite.extend({
    ctor: function( layer ) {
    	this.layer = layer;
        this._super();
        this.setScale( gameScale );
        this.initProperties();
        this.textHeight=CrashText.TEXT_HEIGHT*gameScale;
        this.setPosition( new cc.Point( screenWidth/2,screenHeight/2-this.textHeight/2 ) );
    },
    initProperties: function() {
        this.setOpacity( 255 );
        this.vy=this.textHeight*CrashText.VY_CONTROL.UP;
        this.timer=0;
        this.toTop=false;
    },
    update: function( dt ) {
        var pos=this.getPosition();
    	this.setPosition( new cc.Point( pos.x, pos.y+this.vy ) );
    	if( Math.floor( this.getPosition().y )>=screenHeight/2+this.textHeight/2 && !this.toTop ) {
    		this.vy=0;
            this.toTop=true;
        }
        else if( this.timer<=CrashText.TIMER_CHECK )
            this.timer+=CrashText.TIMER_PER_UPDATE;
        else {
            this.vy=-this.textHeight*CrashText.VY_CONTROL.DOWN;
            this.setOpacity( this.getOpacity()-CrashText.OPACITY_DIF );
        }
        if( this.getOpacity()<CrashText.OPACITY_DIF ){
            this.unscheduleUpdate();
        }
    },

    reset: function(type){
        var src = "images/"+type+"Text.png";
        this.initWithFile( src );
        this.setPosition( new cc.Point( screenWidth/2,screenHeight/2-this.textHeight ) );
        this.vy=this.textHeight*CrashText.VY_CONTROL.UP;
        this.initProperties();
        this.scheduleUpdate();
    }
});

CrashText.TEXT_HEIGHT = 116;
CrashText.VY_CONTROL = {
    UP: 0.2,
    DOWN: 0.01
};
CrashText.TIMER_CHECK = 1;
CrashText.TIMER_PER_UPDATE = 0.05;
CrashText.OPACITY_DIF = 5;