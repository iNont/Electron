var Unit = cc.Sprite.extend({
    ctor: function( layer ) {
    	this.layer = layer;
        this._super();
        this.initWithFile( 'images/Unit.png' );
        this.endPos = new cc.Point( 2*screenWidth , screenHeight/2 );
        this.scheduleUpdate();
        this.keyLeft = false;
        this.keyRight = false;
        this.crashed = false;
        this.enabled = true;
        this.winkSpeed = 17/4;
        this.doneSpeed=1.3;
        this.crashSpeed = Math.pow(1.7,3);
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
            if(this.crashed)
                this.crashUnit();
            else
                this.doneUnit();
    	}
    	if(this.distance( pos,this.endPos ) < 1) {
    			this.startNewUnit();
    	}
    },
    detection: function() {
        var pos = this.getPosition();
        var theta = (this.getRotation()%180+180)%180;
        var startTheta = Math.atan((pos.y-GameLayer.PLAYER_POS.y)/(GameLayer.PLAYER_POS.x-pos.x))*180/Math.PI;
        var playerR = GameLayer.PLAYER_DIAMETER/2;
        var unitR = GameLayer.UNIT_DIAMETER/2;
        var detectionBalance = 4; //To make it harder or easier detect
        var checkTheta = 22.5-Math.asin(playerR/unitR)*180/Math.PI+detectionBalance;
        var check1 = (startTheta-checkTheta%180+180)%180;
        var check2 = (startTheta+checkTheta%180+180)%180;
        var bool1 = false;
        var bool2 = false;
        if( check1>check2 ) {
            bool1 = theta>=check1&&theta<=check1+2*checkTheta;
            bool2 = theta<=check2&&theta>=check2-2*checkTheta;
        }
        else {
            bool1 = theta>=check1&&theta<=check2;
            bool2 = false;
        }
        var R = unitR+playerR;
        var r = unitR-GameLayer.UNIT_BORDER_SIZE-playerR;
        var distance = this.distance( pos,GameLayer.PLAYER_POS );
        if(distance < R && distance > r ) {
            if( !(bool1||bool2) ) {
                //console.log("Miss");
                this.enabled=false;
                this.crashed=true;
                this.layer.crashEffectPlay("miss");
            }
        }
    },
    startNewUnit: function() {
    	this.setOpacity( 255 );
        this.setScale( gameScale );
        this.enabled = true;
        this.crashed = false;
        this.doneSpeed = 1.3;
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
        if(this.getOpacity()/255 > Math.pow(0.7,10))
    	   this.setOpacity( this.getOpacity()*0.7 );
        else this.setOpacity(0);
    },
    doneUnit: function() {
        if(this.getScale()/gameScale == Math.pow(1.3,2))
            this.doneSpeed=0.5;
        this.setScale( this.getScale()*this.doneSpeed );
    },
    crashUnit: function() {
        if(this.getScale()/gameScale < this.crashSpeed)
            this.setScale( this.getScale()*1.7 );
        else this.setScale(0);
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
    		if(length < lengthCheck/5) {
    			//console.log("Perfect");
    			this.enabled = false;
                this.layer.crashEffectPlay("perfect");
    		}
    		else if(length < lengthCheck*3/5) {
    			//console.log("Great");
    			this.enabled = false;
                this.layer.crashEffectPlay("great");
    		}
    		else if(length < 1.5*lengthCheck) {
    			//console.log("Cool");
    			this.enabled = false;
                this.layer.crashEffectPlay("cool");
    		}
    	}
    },
    distance: function( point1,point2 ) {
    	return Math.sqrt( Math.pow(point1.x-point2.x,2)+Math.pow(point1.y-point2.y,2) );
    }
});

