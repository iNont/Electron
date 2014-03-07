var Unit = cc.Sprite.extend({
    ctor: function( layer ) {
        this._super();
        this.initWithFile( 'images/Unit.png' );
        this.endPos = new cc.Point( 5*screenWidth/4 , screenHeight/2 );
        this.endBox = cc.rect(this.endPos.x, this.endPos.y, 50, 50)
        this.scheduleUpdate();
    },
    update: function( dt ) 
    {
    	var pos = this.getPosition();
    	if(this.distance( pos ) < Math.pow(1,-10))
    	{
    		this.setPosition( new cc.Point( -screenWidth/4, screenHeight/2) );
    		this.stopAllActions();
        	var moveAction = cc.MoveTo.create(  GameLayer.UNIT_VELOCITY, this.endPos );
        	this.runAction( moveAction );
    	}
    },
    distance: function( point )
    {
    	return Math.sqrt( Math.pow(point.x-this.endPos.x,2)+Math.pow(point.y-this.endPos.y,2) );
    }
});