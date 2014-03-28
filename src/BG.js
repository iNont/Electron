var BG = cc.Sprite.extend({
    ctor: function() {
    	this.oneRoundX=4221*gameScale;
        this._super();
		this.setOpacity( 255 );
        this.initWithFile( "images/ingameBG.png" );
        this.setScale( gameScale );
        this.setPosition( new cc.Point( screenWidth,screenHeight/2 ) );
		this.setAnchorPoint( new cc.Point( 1,1 ) );
        this.vx=BG.VELOCITY_X*gameScale;
        this.vy=0;
        this.winkSpeed=0.5;
        this.opaDif=0;
        this.scheduleUpdate();
    },
    update: function( dt ) {
    	var pos = this.getPosition();
    	if(pos.x>=this.oneRoundX+screenWidth)
    		this.setPosition(new cc.Point(screenWidth, pos.y ))
    	if(pos.y>screenHeight) {
    		this.setPosition(new cc.Point(pos.x, screenHeight))
    		this.vy=0;
    		this.opaDif=0;
        	this.schedule(this.updateWink,0,Infinity,0);
    	}
    	this.setOpacity(this.getOpacity()-this.opaDif);
    	this.setPosition(new cc.Point(pos.x+this.vx,pos.y+this.vy))
    },
    updateWink: function() {
        var opacity=this.getOpacity();
        this.setOpacity( opacity-this.winkSpeed );
        opacity=this.getOpacity();
        if( opacity<BG.WINK_OPACITY_MIN || opacity>BG.WINK_OPACITY_MAX )
            this.winkSpeed *= -1;
    },

    startGameAnimation: function() {
    	this.opaDif=BG.WINK_SPEED;
        this.vy=BG.VELOCITY_Y*gameScale;
    }
});

BG.WINK_OPACITY_MIN = 85;
BG.WINK_OPACITY_MAX = 155;
BG.WINK_SPEED = 2.5;
BG.VELOCITY_X = 5;
BG.VELOCITY_Y = 15;