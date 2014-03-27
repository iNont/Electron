var Unit = cc.Sprite.extend({
    ctor: function( layer ) {
    	this.layer=layer;
        this._super();
        this.initWithFile( "images/Unit.png" );
        this.endPos=new cc.Point( 2*screenWidth,screenHeight/2 );
        this.scheduleUpdate();
        this.initProperties();
        this.crashSpeed=Math.pow( Unit.CRASH_SPEED,6 );
    },
    initProperties: function() {
        this.setScale( gameScale );
        this.keyLeft=false;
        this.keyRight=false;
        this.crashed=false;
        this.enabled=true;
        this.passPlayer=false;
        this.winkSpeed=17/4;
        this.doneSpeed=Unit.DONE_SPEED;
        this.crashOpacity=255;
    },
    update: function( dt ) {
    	var pos = this.getPosition();
    	var theta = this.getRotation();
    	var turnSpeed = 0;
        if(this.layer.state==GameLayer.STATES.STARTED) {
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
                if(pos.x > screenWidth-GameLayer.UNIT_DIAMETER/2) {
                    this.enabled=false;
                    this.passPlayer=true;
                    this.crashOpacity=this.getOpacity();
                    this.layer.crashEffectPlay("miss");
                }
            }
            else {
                this.hideUnit();
                if(this.crashed)
                    this.crashUnit();
                else if(!this.passPlayer)
                    this.doneUnit();
            }
            if(this.distance( pos,this.endPos ) < 1) {
                this.layer.units.shift();
                this.layer.removeChild(this);
                this.startNewRandomUnit();
    	    }
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
                this.crashOpacity=this.getOpacity();
                this.layer.crashEffectPlay("miss");
            }
        }
    },
    startNewUnit: function( startTheta ) {
        this.setOpacity( 255 );
        this.setScale( gameScale );
        this.enabled = true;
        this.passPlayer=false;
        this.crashed = false;
        this.doneSpeed = 1.3;
        var newPos = this.genStartPos();
        var theta = Math.atan((newPos.y-GameLayer.PLAYER_POS.y)/(GameLayer.PLAYER_POS.x-newPos.x))*180/Math.PI;
        var newTheta = theta+startTheta;
        this.endPos = this.genEndPos( newPos );
        this.setPosition( newPos );
        this.setRotation( newTheta );
        this.stopAllActions();
        var moveAction = cc.MoveTo.create( GameLayer.UNIT_VELOCITY, this.endPos );
        this.runAction( moveAction );
    },
    startNewRandomUnit: function() {
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
        if( this.getOpacity()/this.crashOpacity>Math.pow(Unit.HIDE_SPEED,10) )
    	   this.setOpacity( this.getOpacity()*Unit.HIDE_SPEED );
        else
            this.setOpacity( 0 );
    },
    doneUnit: function() {
        if( this.getScale()/gameScale==Math.pow(Unit.DONE_SPEED,2) )
            this.doneSpeed=0.5;
        this.setScale( this.getScale()*this.doneSpeed );
    },
    crashUnit: function() {
        if( this.getScale()/gameScale<this.crashSpeed )
            this.setScale( this.getScale()*Unit.CRASH_SPEED );
        else 
            this.setScale( 0 );
    },
    wink: function() {
    	var opacity=this.getOpacity();
    	this.setOpacity( opacity-this.winkSpeed );
    	opacity=this.getOpacity();
    	if( opacity<0 || opacity>255)
    		this.winkSpeed*=-1;
    },
    genStartPos: function() {
    	var distance=Math.sqrt(3/4*Math.pow(screenWidth,2));
    	var y=this.layer.randomNumber( -distance,distance );
    	var x=Math.sqrt(Math.pow(screenWidth,2)-Math.pow(y,2));
    	var playerPos=GameLayer.PLAYER_POS;
    	var posX=playerPos.x-x;
    	var posY=playerPos.y+y;
    	return new cc.Point( posX,posY );
    },
    genEndPos: function( point ) {
    	var playerPos=GameLayer.PLAYER_POS;
    	var x=playerPos.x+Math.abs(playerPos.x-point.x);
    	var y=2*playerPos.y-point.y;
    	return new cc.Point( x,y );
    },
    checkEvent: function() {
    	var lengthCheck=GameLayer.UNIT_DIAMETER/2-GameLayer.PLAYER_DIAMETER/2-GameLayer.UNIT_BORDER_SIZE;
    	if( this.enabled && !this.layer.spaceClick )
            this.checkLengthToCrash( lengthCheck );
    },
    checkLengthToCrash: function( lengthCheck ) {
        var pos=this.getPosition();
        var length=this.distance( pos,GameLayer.PLAYER_POS );
        if( length<lengthCheck/5 )
            this.crashPlay( "perfect" );
        else if( length<lengthCheck*3/5 )
            this.crashPlay( "great" );
        else if( length<lengthCheck*1.5 )
            this.crashPlay( "cool" );
    },
    crashPlay: function( type ) {
        this.enabled=false;
        this.layer.crashEffectPlay( type );
    },
    distance: function( point1,point2 ) {
    	return Math.sqrt( Math.pow(point1.x-point2.x,2)+Math.pow(point1.y-point2.y,2) );
    }
});

Unit.CRASH_SPEED = 1.4; 
Unit.DONE_SPEED = 1.3;
Unit.HIDE_SPEED = 0.7;
