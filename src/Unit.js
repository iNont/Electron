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
        this.enabled = true;
    },
    update: function( dt ) {
    	var pos = this.getPosition();
    	var theta = this.getRotation();
    	var turnSpeed = 0;
    	if(this.distance( pos,this.endPos ) < 1) {
    			this.startNewUnit();
    	}
    	if(this.enabled) {
    		if(this.keyLeft) 
    			turnSpeed -= GameLayer.UNIT_TURN_SPEED;
    		if(this.keyRight)
    			turnSpeed += GameLayer.UNIT_TURN_SPEED;
    		if(this.isReverse) 
    			turnSpeed *= -1;
    		this.setRotation(theta+turnSpeed);
    	}
    	else {
    		this.hideUnit();
    	}
    },
    startNewUnit: function() {
    	this.setScale( gameScale );
        this.enabled = true;
    	var newPos = this.genStartPos();
    	var newTheta = this.layer.randomNumber( 0,360 );
    	this.endPos = this.genEndPos( newPos );
   		this.setPosition( newPos );
   		this.setRotation( newTheta );
    	this.stopAllActions();
       	var moveAction = cc.MoveTo.create(  GameLayer.UNIT_VELOCITY, this.endPos );
       	this.runAction( moveAction );
    },
    hideUnit: function() {
    	this.setScale( this.getScale()*0.5 );
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
    checkEvent: function() {
    	var pos = this.getPosition();
    	var length = this.distance( pos,GameLayer.PLAYER_POS );
    	var lengthCheck = GameLayer.UNIT_DIAMETER/2-GameLayer.PLAYER_DIAMETER/2;
    	if(this.enabled) {
    		if(length < lengthCheck/4) {
    			console.log("Perfect");
    			this.enabled = false;

    		}
    		else if(length < lengthCheck/2) {
    			console.log("Great");
    			this.enabled = false;
    		}
    		else if(length < lengthCheck) {
    			console.log("Bad");
    			this.enabled = false;
    		}
    		else if(length < 1.5*lengthCheck) {
    			console.log("Miss");
    			this.enabled = false;
    		}
    	}
    },
    distance: function( point1,point2 ) {
    	return Math.sqrt( Math.pow(point1.x-point2.x,2)+Math.pow(point1.y-point2.y,2) );
    }
});

