var CrashText = cc.Sprite.extend({
    ctor: function( layer ) {
    	this.layer = layer;
        this._super();
        this.setScale(gameScale);
        this.textHeight=116*gameScale;
        this.setPosition(new cc.Point( screenWidth/2, screenHeight/2-this.textHeight/2));
        this.updateTime=5;
        this.vy=this.textHeight/5;
        this.toTop=false;
    },
    update: function( dt ) {
        var pos=this.getPosition();
    	this.setPosition(new cc.Point( pos.x, pos.y+this.vy));
    	if(Math.floor(this.getPosition().y)>=screenHeight/2+this.textHeight/2 && !this.toTop)
        {
    		this.vy=-this.textHeight/(100);
            this.toTop=true;
        }
        else
            this.setOpacity(this.getOpacity()-5);
        if(this.getOpacity() <5){
            this.unscheduleUpdate();
        }
    },

    reset: function(type){
        var src = "images/"+type+"Text.png";
        this.initWithFile( src );
        this.setPosition(new cc.Point( screenWidth/2, screenHeight/2-this.textHeight));
        this.vy=this.textHeight/5;
        this.setOpacity(255);
        this.toTop=false;
        this.scheduleUpdate();
    }
});