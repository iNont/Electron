var crashEffect = cc.Sprite.extend({
    ctor: function( layer ) {
    	this.layer = layer;
        this._super();
        this.scheduleUpdate();
        this.setScale(gameScale);
        this.effectHeight=491*gameScale;
        this.setPosition(new cc.Point( screenWidth/2, screenHeight/2));
    },
    update: function( dt ) {
    	this.setOpacity(this.getOpacity()+this.diffOpac);
    	if(this.getOpacity()==255)
    		this.diffOpac=-17;
        if(this.getOpacity() === 0){
            this.unscheduleUpdate();
        }
    },

    reset: function(type){
        var src = "images/"+type+"Effect.png";
        this.initWithFile( src );
        this.diffOpac = 51;
        this.setOpacity(0);
        this.scheduleUpdate();
    }
});