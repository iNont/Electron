var Unit = cc.Sprite.extend({
    ctor: function( layer ) {
    	this.layer = layer;
        this._super();
        this.initWithFile( "images/Unit.png" );
        this.endPos = new cc.Point( 2*screenWidth,screenHeight/2 );
        this.scheduleUpdate();
        this.initProperties();
        this.crashSpeed = Math.pow( Unit.CRASH_SPEED,6 );
    },
    initProperties: function() {
        this.initUnitStatus();
        this.initAnimationValue();
    },
    initUnitStatus: function() {
        this.isFake = false;
        this.fixedNote = false;
        this.keyLeft = false;
        this.keyRight = false;
        this.crashed = false;
        this.enabled = true;
        this.passPlayer = false;
    },
    initAnimationValue: function() {
        this.setScale( gameScale );
        this.winkSpeed = 17/4;
        this.doneSpeed = Unit.DONE_SPEED;
        this.crashOpacity = 255;
    },
    update: function( dt ) {
    	var pos = this.getPosition();
        if( this.enabled )
            this.updateEnabled();
        else 
            this.updateDisabled();
        if( this.distance( pos,this.endPos ) < 1 )
            this.removeThis();
    },
    updateEnabled: function() {
        var pos = this.getPosition();
        this.turnThis();
        if( ( this.layer.isWink ) && ( !this.layer.invisibleMode ) ) 
            this.wink();
        if( pos.x > screenWidth-GameLayer.UNIT_DIAMETER/2 ) {
            this.passPlayer = true;
            this.crashOpacity = this.getOpacity();
            if( !this.isFake )
                this.crashPlay( "miss" );
        }
        this.detection();
    },
    updateDisabled: function() {
        this.hideUnit();
        if( this.crashed )
            this.crashUnit();
        else if( !this.passPlayer )
            this.doneUnit();
    },
    removeThis: function() {
        if( !this.isFake )
            this.layer.units.shift();
        this.layer.removeChild( this );
    },
    turnThis: function() {
        var theta = this.getRotation();
        var turnSpeed = 0;
        if( this.keyLeft )  
            turnSpeed -= GameLayer.UNIT_TURN_SPEED;
        if( this.keyRight )
            turnSpeed += GameLayer.UNIT_TURN_SPEED;
        if( this.layer.isInverse ) 
            turnSpeed *= -1;
        if( this.fixedNote )
            turnSpeed = 0;
        this.setRotation( theta+turnSpeed );
        this.resetTurn();
    },
    resetTurn: function() {
        this.keyLeft = false;
        this.keyRight = false;
    },
    getThetaDegree: function( pos1,pos2 ) {
        var thetaInRadian = Math.atan( ( pos1.y-pos2.y )/( pos2.x-pos1.x ) );
        return this.radToDegree( thetaInRadian );
    },
    radToDegree: function( thetaInRadian ) {
        return thetaInRadian*180/Math.PI;
    },
    detection: function() {
        if( this.detectDirectionCheck() ) {
            if( this.detectAngleCheck() ) {
                this.crashed = true;
                this.crashOpacity = this.getOpacity();
                if( !this.isFake )
                    this.crashPlay( "miss" );
            }
        }
    },
    genCheckTheta: function() {
        var playerR = GameLayer.PLAYER_DIAMETER/2;
        var unitR = GameLayer.UNIT_DIAMETER/2;
        return Unit.DETECTION_ANGLE-this.radToDegree( Math.asin( playerR/unitR ) );
    },
    detectDirectionCheck: function() {
        var playerR = GameLayer.PLAYER_DIAMETER/2;
        var unitR = GameLayer.UNIT_DIAMETER/2;
        var R = unitR+playerR;
        var r = unitR-playerR-GameLayer.UNIT_BORDER_SIZE;
        var pos = this.getPosition();
        var distance = this.distance( pos,GameLayer.PLAYER_POS );
        return ( ( distance < R ) && ( distance > r ) );
    },
    detectAngleCheck: function() {
        var pos = this.getPosition();
        var theta = ( this.getRotation()%180+180 )%180;
        var startTheta = this.getThetaDegree( pos,GameLayer.PLAYER_POS );
        var checkTheta = this.genCheckTheta();
        var check1 = ( startTheta-checkTheta%180+180 )%180;
        var check2 = ( startTheta+checkTheta%180+180 )%180;
        var bool1 = false;
        var bool2 = false;
        if( check1 > check2 ) {
            bool1 = ( ( theta >= check1 ) && ( theta <= check1+2*checkTheta ) );
            bool2 = ( ( theta <= check2 ) && ( theta >= check2-2*checkTheta ) );
        }
        else
            bool1 = ( ( theta >= check1 ) && ( theta <= check2) );
        return !( bool1 || bool2 );
    },
    startNewRandomUnit: function() {
        this.initProperties();
        var newTheta = Math.floor( this.layer.randomNumber( 0,360 ) )%4*45;  //SingleTurn
        if( this.layer.isFixNote ) {
            this.fixedNote = true;
            newTheta = 0;
        }
        this.startNewUnit( newTheta );
    },
    startNewUnit: function( startTheta ) {
        var newPos = this.genStartPos();
        var theta = this.getThetaDegree( newPos,GameLayer.PLAYER_POS );
        var newTheta = theta+startTheta;
        this.makeNewUnit( newPos,newTheta );
    },
    makeNewUnit: function( newPos,newTheta ) {
        this.endPos = this.genEndPos( newPos );
        this.setPosition( newPos );
        this.setRotation( newTheta );
        this.setMoveToUnit();
        if( this.layer.invisibleMode ) {
            this.setOpacity( 0 );
            this.schedule( this.updateInvisible,0,Infinity,0 );
        }
    },
    setMoveToUnit: function() {
        this.stopAllActions();
        var moveAction = cc.MoveTo.create( GameLayer.UNIT_VELOCITY,this.endPos );
        this.runAction( moveAction );
    },
    updateInvisible: function() {
        var pos = this.getPosition();
        var length = this.distance( pos,GameLayer.PLAYER_POS );
        if( length < 2*screenWidth/5 )
            this.setOpacity( this.getOpacity()+17/4 );
        if( this.getOpacity() >= 255 )
            this.unschedule( this.updateInvisible );
    },
    hideUnit: function() {
        if( this.getOpacity()/this.crashOpacity > Math.pow( Unit.HIDE_SPEED,10 ) )
    	   this.setOpacity( this.getOpacity()*Unit.HIDE_SPEED );
        else
            this.setOpacity( 0 );
    },
    doneUnit: function() {
        if( this.getScale()/gameScale == Math.pow( Unit.DONE_SPEED,2 ) )
            this.doneSpeed = 0.5;
        this.setScale( this.getScale()*this.doneSpeed );
    },
    crashUnit: function() {
        if( this.getScale()/gameScale < this.crashSpeed )
            this.setScale( this.getScale()*Unit.CRASH_SPEED );
        else 
            this.setScale( 0 );
    },
    wink: function() {
    	var opacity = this.getOpacity();
    	this.setOpacity( opacity-this.winkSpeed );
    	opacity = this.getOpacity();
    	if( ( opacity < 0 ) || ( opacity > 255 ) )
    		this.winkSpeed *= -1;
    },
    genStartPos: function() {
    	var distance = Math.sqrt( 3/4*Math.pow( screenWidth,2 ) );
    	var y = this.layer.randomNumber( -distance,distance );
    	var x = Math.sqrt( Math.pow( screenWidth,2 )-Math.pow( y,2 ) );
    	var posX = GameLayer.PLAYER_POS.x-x;
    	var posY = GameLayer.PLAYER_POS.y+y;
    	return new cc.Point( posX,posY );
    },
    genEndPos: function( point ) {
    	var x = GameLayer.PLAYER_POS.x+Math.abs( GameLayer.PLAYER_POS.x-point.x );
    	var y = 2*GameLayer.PLAYER_POS.y-point.y;
    	return new cc.Point( x,y );
    },
    checkEvent: function() {
    	var lengthCheck = GameLayer.UNIT_DIAMETER/2-GameLayer.PLAYER_DIAMETER/2-GameLayer.UNIT_BORDER_SIZE;
    	if( this.enabled && !this.layer.spaceClick )
            this.checkLengthToCrash( lengthCheck );
    },
    checkLengthToCrash: function( lengthCheck ) {
        var pos = this.getPosition();
        var length = this.distance( pos,GameLayer.PLAYER_POS );
        var array = ["perfect","great","cool"];
        for( var i = 0; i<array.length; i++ )
            if( length < lengthCheck*0.3*( 2*i+1 ) ) {
                this.crashPlay( array[i] );
                break;
            }
    },
    crashPlay: function( type ) {
        this.enabled = false;
        this.layer.crashEffectPlay( type );
    },
    distance: function( point1,point2 ) {
    	return Math.sqrt( Math.pow( point1.x-point2.x,2 )+Math.pow( point1.y-point2.y,2 ) );
    }
});

Unit.CRASH_SPEED = 1.4; 
Unit.DONE_SPEED = 1.3;
Unit.HIDE_SPEED = 0.7;
Unit.DETECTION_ANGLE = 22.5;
