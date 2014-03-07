var Unit = cc.Sprite.extend({
    ctor: function( layer ) {
    	this.isReverse = false;
    	this.layer = layer;
        this._super();
        this.initWithFile( 'images/Unit.png' );
        this.endPos = new cc.Point( 2*screenWidth , screenHeight/2 );
        this.scheduleUpdate();
        this.keyLeft = false;
        this.keyRight = false;
    },
    update: function( dt ) {
    	var pos = this.getPosition();
    	var theta = this.getRotation();
    	var turnSpeed = 0;
    	if(this.keyLeft) 
    		turnSpeed -= GameLayer.UNIT_TURN_SPEED;
    	if(this.keyRight)
    		turnSpeed += GameLayer.UNIT_TURN_SPEED;
    	if(this.isReverse)
    		turnSpeed *= -1;
    	this.setRotation(theta+turnSpeed);
    	if(this.distance( pos ) < 1)
    	{
    		var newPos = this.genStartPos();
    		var newTheta = this.layer.randomNumber( 0,360 );
    		this.endPos = this.genEndPos( newPos );
    		this.setPosition( newPos );
    		this.setRotation( newTheta );
    		this.stopAllActions();
        	var moveAction = cc.MoveTo.create(  GameLayer.UNIT_VELOCITY, this.endPos );
        	this.runAction( moveAction );
    	}
    },
    genStartPos: function() {
    	var distance = Math.sqrt(3/4*Math.pow(screenWidth,2));
    	var y = this.layer.randomNumber( -distance , distance );
    	var x = Math.sqrt(Math.pow(screenWidth,2)-Math.pow(y,2));
    	var playerPos = GameLayer.PLAYER_POS;
    	var posX = playerPos.x-x;
    	var posY = playerPos.y+y;
    	return new cc.Point( posX,posY );
    },
    genEndPos: function( point ) {
    	var playerPos = GameLayer.PLAYER_POS;
    	var x = playerPos.x+Math.abs(playerPos.x-point.x);
    	var y = 2*playerPos.y-point.y;
    	return new cc.Point( x,y );
    },
    distance: function( point ) {
    	return Math.sqrt( Math.pow(point.x-this.endPos.x,2)+Math.pow(point.y-this.endPos.y,2) );
    }
});

