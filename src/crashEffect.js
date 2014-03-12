var crashEffect = cc.Sprite.extend({
    ctor: function( layer,type ) {
    	this.layer = layer;
        this._super();
        var src = "images/"+type+"Effect.png";
        this.initWithFile( src );
        this.scheduleUpdate();
        this.setScale(gameScale);
        this.effectHeight=491*gameScale;
        this.setPosition(new cc.Point( screenWidth/2, screenHeight/2));
        this.diffOpac = 51;
        this.setOpacity(0);
    },
    update: function( dt ) {
    	this.setOpacity(this.getOpacity()+this.diffOpac);
    	if(this.getOpacity()==255)
    		this.diffOpac=-17;
    	if(this.getOpacity()==0) this.layer.removeChild(this); 
    }
});