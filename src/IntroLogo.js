var IntroLogo = cc.Sprite.extend({
    ctor: function( layer, text ,x,y ) {
        this.layer = layer;
        this._super();
        this.initProperties( text,x,y );
    },
    initProperties: function( text,x,y ) {
        this.initEachIntro( text );
        this.initPosition( x,y );
    },
    initEachIntro: function( text ) {
        this.type = text;
        var src = "images/intro/"+text+".png";
        this.initWithFile( src );
        this.setScale( gameScale );
        this.setOpacity( 0 );
        this.animating = false;
        this.v = 0.5;
    },
    initPosition: function( x,y ) {
        this.cornerX = screenWidth/2-778.5*gameScale;
        this.cornerY = ( screenHeight+300 )/2+227*gameScale;
        this.X = x*gameScale;
        this.Y = y*gameScale;
        this.setPosition( new cc.Point( this.cornerX+this.X,this.cornerY-this.Y ) );
    },
    unscheduleAll: function() {
        this.unschedule(this.updateFull);
        this.unschedule(this.updatePressAnyKey);
        this.unschedule(this.updateO);
        this.unschedule(this.updateSTop);
        this.unschedule(this.updateBTop);
        this.unschedule(this.updateWink);
    },
    hideThis: function() {
        this.unscheduleAll();
        this.schedule( this.updateHide,0,Infinity,0 );
    },
    winkThis: function( speed,min ) {
        this.winkSpeed = speed;
        this.winkMin = min;
        this.unscheduleAll();
        this.schedule( this.updateWink,0,Infinity,0 );
    },
    updateHide: function() {
        this.hideSpike();
        this.hiding();
    },
    hideSpike: function() {
        var pos=this.getPosition();
        if( this.type == "spikeTop" )
            this.setPosition( new cc.Point( pos.x-50,pos.y-50 ) );
        else if( this.type == "spikeBot" )
            this.setPosition( new cc.Point( pos.x+50,pos.y+50 ) );
    },
    hiding: function() {
        if( this.getScaleX() > Math.pow( 10,-3 ) ) {
            this.setOpacity( this.getOpacity()*0.7 );
            this.minimizeToHide();
        }
        else 
            this.layer.removeChild( this );
    },
    minimizeToHide: function() {
        this.setScaleX( this.getScaleX()*0.9 );
        this.setScaleY( this.getScaleY()*0.9 );
    },
    updateWink: function() {
        var opacity = this.getOpacity();
        this.setOpacity( opacity-this.winkSpeed );
        opacity = this.getOpacity();
        if( ( opacity < this.winkMin ) || ( opacity > 255 ) ) {
            this.winkSpeed *= -1;
        }
    },
    updateO: function() {
        if( this.getOpacity() < 255 )
            this.appearO();
        else if( this.getRotation() < 720 )
            this.turnO();
        else
            this.stopO();
    },
    appearO: function() {
        this.setRotation( this.getRotation()+360/51 );
        this.setOpacity( this.getOpacity()+5 );
        this.setScale( this.getScale()/1.05 );
    },
    turnO: function() {
        if( this.getRotation()%180 < 90 )
            this.setScaleY( this.getScaleY()*0.999 );
        else if( this.getRotation()%180 < 180 )
            this.setScaleY( this.getScaleY()*1000/999 );
        else
            this.setScale( gameScale );
        this.setRotation( this.getRotation()+10 );
    },
    stopO: function() {
        this.setScale( gameScale );
        this.winkThis( 17/6,0 );
        this.unschedule( this.updateO );
    },
    appearSpike: function() {
        this.setOpacity(this.getOpacity()+255/87);
        this.setScale(this.getScale()/1.05);
    },
    stopSpike: function() {
        this.setOpacity( 255 );
        this.setScale( gameScale );
        this.winkThis( 17/4,0 );
    },
    updateSTop: function() {
        if( this.getOpacity() < 255 ) {
            var pos = this.getPosition();
            this.appearSpike();
            this.setPosition( new cc.Point( pos.x-10,pos.y-10 ) );
        }
        else {
            this.stopSpike();
            this.unschedule( this.updateSTop );
        }
    },
    updateSBot: function() {
        if ( this.getOpacity() < 255 ) {
            var pos = this.getPosition();
            this.appearSpike();
            this.setPosition( new cc.Point( pos.x+10,pos.y+10 ) );
        }
        else {
            this.stopSpike();
            this.unschedule( this.updateSBot );
        }
    },
    updateFull: function() {
        if( this.getOpacity() < 40 )
            this.setOpacity( this.getOpacity()+this.v );
        else if( this.getOpacity() < 255 ){
            this.v += 17/8;
            this.setOpacity( this.getOpacity()+this.v );
        }
        else {
            this.setOpacity( 255 );
            this.winkThis( 1,155 );
        }
    },
    updatePressAnyKey: function() {
        if( this.getOpacity() < 40 )
            this.setOpacity( this.getOpacity()+this.v );
        else if( this.getOpacity() < 255 ){
            this.v += 17/8;
            this.setOpacity( this.getOpacity()+this.v );
        }
        else {
            this.setOpacity( 255 );
            this.winkThis( 10,105 );
        }
    },
    runAnimationO: function() {
        this.v = 180;
        this.setScale( gameScale*Math.pow( 1.05,51 ) );
        this.schedule( this.updateO,0,Infinity,0 );
    },
    runAnimationSTop: function() {
        var pos = this.getPosition();
        this.setPosition( new cc.Point( pos.x+870,pos.y+870 ) );
        this.setScale( gameScale*Math.pow( 1.05,87 ) );
        this.schedule( this.updateSTop,0,Infinity,0 );
    },
    runAnimationSBot: function() {
        var pos = this.getPosition();
        this.setPosition( new cc.Point( pos.x-870,pos.y-870 ) );
        this.setScale( gameScale*Math.pow( 1.05,87 ) );
        this.schedule( this.updateSBot,0,Infinity,0 );
    },
    runAnimationFull: function() {
        this.v = 0.5;
        this.schedule( this.updateFull,0,Infinity,0 );
    },
    runAnimationPressAnyKey: function() {
        this.v = 0.5;
        this.schedule( this.updatePressAnyKey,0,Infinity,0 );
    }
});