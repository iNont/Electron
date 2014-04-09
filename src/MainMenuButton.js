/*/
var gameScale = 0.5;
var screenWidth = 2048*gameScale;
var screenHeight = 1536*gameScale;

var MainMenuButton = cc.Sprite.extend({
    ctor: function( layer,number ) {
        this.layer=layer;
        this._super();
        this.initWithFile( "images/intro/button.png" );
        this.buttonPos=number-1;
        this.setScale( gameScale*Math.pow(MainMenuButton.SCALE_RATIO,Math.abs(this.buttonPos)) );
        this.setOpacity( MainMenuButton.OPACITY_UNSELECTED );
        var initPosX=screenWidth+MainMenuButton.POSITION_INIT;
        var initPosY=screenHeight/2-number*MainMenuButton.GAP*gameScale;
        this.setPosition( this.genNextCirclePos(this.buttonPos) );
        this.scheduleUpdate();
        this.selected=false;
    },
    calculatePointOnCore: function( pos ) {
        var posX=pos-MainMenuButton.CORE_POS.x;
        var posY=Math.sqrt( Math.pow( MainMenuButton.CORE_RADIUS,2 )-Math.pow( posX,2 ));
        if( this.buttonPos<0 )
            posY*=-1;
        return new cc.Point( posX+MainMenuButton.CORE_POS.x,posY+MainMenuButton.CORE_POS.y );
    },
    getAngleFromCoreInRadian: function( point ) {
        var x = MainMenuButton.CORE_POS.x-point.x;
        var y = point.y-MainMenuButton.CORE_POS.y;
        return Math.atan(y/x);
    },
    genNextCirclePos: function( to ) {
        var fromPos;
        if( to==0 )
            return new cc.Point( MainMenuButton.CORE_POS.x-MainMenuButton.CORE_RADIUS,screenHeight/2 );
        else if( to>0 ) {
            fromPos=this.genNextCirclePos( to-1 );
            var baseLength=(1+MainMenuButton.SCALE_RATIO)*Math.pow(MainMenuButton.SCALE_RATIO,Math.abs(to-1))*MainMenuButton.RADIUS;
            var theta = Math.acos((baseLength/2)/MainMenuButton.CORE_RADIUS)-this.getAngleFromCoreInRadian(fromPos);
            var deltaX = Math.cos(theta)*baseLength*gameScale;
            var deltaY = Math.sin(theta)*baseLength*gameScale*to/Math.abs(to);
            return new cc.Point( fromPos.x+deltaX,fromPos.y+deltaY );
        }
        else {
            fromPos=this.genNextCirclePos( to+1 );
            var baseLength=(1+MainMenuButton.SCALE_RATIO)*Math.pow(MainMenuButton.SCALE_RATIO,Math.abs(to+1))*MainMenuButton.RADIUS;
            var theta = Math.acos((baseLength/2)/MainMenuButton.CORE_RADIUS)+this.getAngleFromCoreInRadian(fromPos);
            var deltaX = Math.cos(theta)*baseLength*gameScale;
            var deltaY = Math.sin(theta)*baseLength*gameScale*to/Math.abs(to);
            return new cc.Point( fromPos.x+deltaX,fromPos.y+deltaY );
        }
    },
    update: function( dt ) {
        var pos=this.getPosition();
        if( pos.x>screenWidth )
            this.setPosition( new cc.Point( pos.x-MainMenuButton.SHOW_SPEED,pos.y ) );
    },
    updateHide: function() {
        var pos=this.getPosition();
        this.setOpacity( this.getOpacity()-MainMenuButton.HIDE_SPEED_OPACITY );
        if( pos.x<screenWidth+MainMenuButton.POSITION_HIDE )
            this.setPosition( new cc.Point( pos.x+MainMenuButton.HIDE_SPEED,pos.y ) );
        else
            this.layer.removeChild( this );

    },
    hideThis: function() {
        this.unscheduleUpdate();
        this.schedule( this.updateHide,0,Infinity,0 );
    },
    select: function() {
        this.selected=true;
        this.setScale( gameScale*MainMenuButton.SCALE_SELECTED );
        this.setOpacity( MainMenuButton.OPACITY_SELECTED );
    },
    unselect: function() {
        this.selected=false;
        this.setScale( gameScale*MainMenuButton.SCALE_UNSELECTED );
        this.setOpacity( MainMenuButton.OPACITY_UNSELECTED );
    }
});

MainMenuButton.CORE_POS = new cc.Point( screenWidth,screenHeight/2 );
MainMenuButton.CORE_RADIUS = 1500*gameScale;
MainMenuButton.SCALE_RATIO = Math.pow(0.9,5);
MainMenuButton.RADIUS = 600*gameScale;
MainMenuButton.GAP = 160;
MainMenuButton.SCALE_SELECTED = 1;
MainMenuButton.SCALE_UNSELECTED = 0.75;
MainMenuButton.OPACITY_SELECTED = 200;
MainMenuButton.OPACITY_UNSELECTED = 255/2;
MainMenuButton.POSITION_INIT = 500;
MainMenuButton.POSITION_HIDE = 500;
MainMenuButton.HIDE_SPEED_OPACITY = 5;
MainMenuButton.SHOW_SPEED = 15;
MainMenuButton.HIDE_SPEED = 15;
/**/



var MainMenuButton = cc.Sprite.extend({
    ctor: function( layer,number ) {
        this.layer=layer;
        this._super();
        this.initWithFile( "images/intro/button"+number+".png" );
        this.setScale( gameScale*MainMenuButton.SCALE_UNSELECTED );
        this.setOpacity( MainMenuButton.OPACITY_UNSELECTED );
        var initPosX=screenWidth+MainMenuButton.POSITION_INIT;
        var initPosY=screenHeight/2-number*MainMenuButton.GAP*gameScale;
        this.setPosition( new cc.Point( initPosX,initPosY ) );
        this.scheduleUpdate();
        this.selected=false;
    },
    update: function( dt ) {
        var pos=this.getPosition();
        if( pos.x>screenWidth )
            this.setPosition( new cc.Point( pos.x-MainMenuButton.SHOW_SPEED,pos.y ) );
    },
    updateHide: function() {
        var pos=this.getPosition();
        this.setOpacity( this.getOpacity()-MainMenuButton.HIDE_SPEED_OPACITY );
        if( pos.x<screenWidth+MainMenuButton.POSITION_HIDE )
            this.setPosition( new cc.Point( pos.x+MainMenuButton.HIDE_SPEED,pos.y ) );
        else
            this.layer.removeChild( this );

    },
    hideThis: function() {
        this.unscheduleUpdate();
        this.schedule( this.updateHide,0,Infinity,0 );
    },
    select: function() {
        this.selected=true;
        this.setScale( gameScale*MainMenuButton.SCALE_SELECTED );
        this.setOpacity( MainMenuButton.OPACITY_SELECTED );
    },
    unselect: function() {
        this.selected=false;
        this.setScale( gameScale*MainMenuButton.SCALE_UNSELECTED );
        this.setOpacity( MainMenuButton.OPACITY_UNSELECTED );
    }
});

MainMenuButton.GAP = 160;
MainMenuButton.SCALE_SELECTED = 1;
MainMenuButton.SCALE_UNSELECTED = 0.75;
MainMenuButton.OPACITY_SELECTED = 200;
MainMenuButton.OPACITY_UNSELECTED = 255/2;
MainMenuButton.POSITION_INIT = 500;
MainMenuButton.POSITION_HIDE = 500;
MainMenuButton.HIDE_SPEED_OPACITY = 5;
MainMenuButton.SHOW_SPEED = 15;
MainMenuButton.HIDE_SPEED = 15;