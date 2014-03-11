var Unit = cc.Sprite.extend({
    ctor: function( layer ) {
    	this.layer = layer;
        this._super();
        this.initWithFile( 'images/Unit.png' );
        this.endPos = new cc.Point( 2*screenWidth , screenHeight/2 );
        this.scheduleUpdate();
        this.keyLeft = false;
        this.keyRight = false;
        this.enabled = true;
        this.winkSpeed = 17/4;
        this.checkDetectBool = false;
    },
    update: function( dt ) {
    	var pos = this.getPosition();
    	var theta = this.getRotation();
    	var turnSpeed = 0;
    	if(this.enabled) {
    		if(this.keyLeft) 
    			turnSpeed -= GameLayer.UNIT_TURN_SPEED;
    		if(this.keyRight)
    			turnSpeed += GameLayer.UNIT_TURN_SPEED;
    		if(this.layer.isReverse) 
    			turnSpeed *= -1;
    		if(this.layer.isWink) 
    			this.wink();
    		this.setRotation(theta+turnSpeed);
            this.detection();
    	}
    	else {
    		this.hideUnit();
    	}
    	if(this.distance( pos,this.endPos ) < 1) {
    			this.startNewUnit();
    	}
    },
    detection: function() {
        var pos = this.getPosition();
        var theta = this.getRotation();
        if(this.distance( pos,GameLayer.PLAYER_POS ) <= GameLayer.UNIT_DIAMETER/2+GameLayer.PLAYER_DIAMETER/2) {
            if(this.checkDetect( theta-45,theta-90 )
            || this.checkDetect( theta-90,theta-135 )
            || this.checkDetect( theta-135,theta-180 )
            || this.checkDetect( theta-225,theta-270 )
            || this.checkDetect( theta-270,theta-315 )
            || this.checkDetect( theta-315,theta-360 ))
                this.checkDetectBool = true;
            else
                this.checkDetectBool = false;
            if(this.checkDetectBool && !this.checkDetect( theta-0,theta-45 ))
                this.enabled = false;
            else if(this.checkDetectBool && !this.checkDetect( theta-180,theta-225 ))
                this.enabled = false;
        }
    },
    checkDetect: function( theta1,theta2 ) {
        var rad1 = theta1*Math.PI/180;
        var rad2 = theta2*Math.PI/180;
        var unitR = GameLayer.UNIT_DIAMETER/2;
        var pos = this.getPosition();
        var point1 = new cc.Point( pos.x+unitR*Math.cos(rad1),pos.y+unitR*Math.sin(rad1) );
        var point2 = new cc.Point( unitR*Math.cos(rad2),unitR*Math.sin(rad2) );
        var A = (point1.y-point2.y)/(point1.x-point2.x);
        var B = -1;
        var C = point1.y-A*point1.x;
        var playerPos = GameLayer.PLAYER_POS;
        var distance = Math.abs(A*playerPos.x+B*playerPos.y+C)/Math.sqrt(A*A+B*B);
        return distance < GameLayer.PLAYER_DIAMETER/3;
    },
    startNewUnit: function() {
    	this.setOpacity( 255 );
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
    	this.setOpacity( this.getOpacity()*0.7 );
    },
    wink: function() {
    	var opacity = this.getOpacity();
    	this.setOpacity( opacity-this.winkSpeed );
    	opacity = this.getOpacity();
    	if( opacity < 0 || opacity > 255) {
    		this.winkSpeed *= -1;
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

