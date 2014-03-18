var IntroLogo = cc.Sprite.extend({
    ctor: function(layer, text ,x,y) {
        this.layer=layer;
        this._super();
        var src = "images/intro/"+text+".png";
        this.initWithFile( src );
        this.cornerX=screenWidth/2-778.5*gameScale;
        this.cornerY=(screenHeight+300)/2+227*gameScale;
        this.X=x*gameScale;
        this.Y=y*gameScale;
        this.setPosition(new cc.Point(this.cornerX+this.X,this.cornerY-this.Y));
        this.setScale(gameScale);
        this.setOpacity(0);
        this.animating=false;
    },
    updateO: function() {
        if(this.getOpacity()<255)
        {
            this.setRotation(this.getRotation()+360/51);
            this.setOpacity(this.getOpacity()+5);
            this.setScale(this.getScale()/1.05);
        }
        else if(this.getRotation()<720) {
            if(this.getRotation()%180 < 90)
                this.setScaleY(this.getScaleY()*0.999);
            else if(this.getRotation()%180 < 180)
                this.setScaleY(this.getScaleY()*1000/999);
            else
                this.setScale(gameScale);
            this.setRotation(this.getRotation()+10);
        }
        else {
            this.setScale(gameScale);
            this.unscheduleUpdate();
        }
    },
    updateSTop: function() {
        if(this.getOpacity()<255)
        {
            var pos=this.getPosition();
            this.setOpacity(this.getOpacity()+255/87);
            this.setScale(this.getScale()/1.05);
            this.setPosition(new cc.Point(pos.x-10,pos.y-10));
        }
        else {
            this.setOpacity(255);
            this.setScale(gameScale);
            this.unscheduleUpdate();
        }
    },
    updateBTop: function() {
        if(this.getOpacity()<255)
        {
            var pos=this.getPosition();
            this.setOpacity(this.getOpacity()+255/87);
            this.setScale(this.getScale()/1.05);
            this.setPosition(new cc.Point(pos.x+10,pos.y+10));
        }
        else {
            this.setOpacity(255);
            this.setScale(gameScale);
            this.unscheduleUpdate();
        }
    },
    updateFull: function() {
        if(this.getOpacity()<40)
        {
            this.setOpacity(this.getOpacity()+0.5);
        }
        else if(this.getOpacity()<255){
            this.setOpacity(this.getOpacity()+17);
        }
    },
    runAnimationO: function() {
        this.setScale(gameScale*Math.pow(1.05,51));
        this.schedule(this.updateO,0,Infinity,0);
    },
    runAnimationSTop: function() {
        var pos=this.getPosition();
        this.setPosition(new cc.Point(pos.x+870,pos.y+870));
        this.setScale(gameScale*Math.pow(1.05,87));
        this.schedule(this.updateSTop,0,Infinity,0);
    },
    runAnimationBTop: function() {
        var pos=this.getPosition();
        this.setPosition(new cc.Point(pos.x-870,pos.y-870));
        this.setScale(gameScale*Math.pow(1.05,87));
        this.schedule(this.updateBTop,0,Infinity,0);
    },
    runAnimationFull: function() {
        this.schedule(this.updateFull,0,Infinity,0);
    }

});