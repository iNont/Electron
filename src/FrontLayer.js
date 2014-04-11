var FrontLayer = cc.LayerColor.extend({
    ctor: function( gameLayer ) {
        this._super();
        this.layer=gameLayer;
    },
    startIntro:function() {
        this.introArr=[];
        this.addIntroLogo();
    },
    addIntroLogo: function() {
        this.introLogoO=new IntroLogo( this,"o",1150,256 );
        this.addChild( this.introLogoO );
        this.introLogoO.runAnimationO();
        this.introArr.push( this.introLogoO );

        this.introLogoSTop=new IntroLogo( this,"spikeTop",1269,121 );
        this.addChild( this.introLogoSTop );
        this.introLogoSTop.runAnimationSTop();
        this.introArr.push( this.introLogoSTop );

        this.introLogoSBot=new IntroLogo( this,"spikeBot",1060,359 );
        this.addChild( this.introLogoSBot );
        this.introLogoSBot.runAnimationSBot();
        this.introArr.push( this.introLogoSBot );

        this.introLogoFull=new IntroLogo( this,"logo",778.5,227 );
        this.addChild( this.introLogoFull );
        this.introLogoFull.runAnimationFull();
        this.introArr.push( this.introLogoFull );

        this.introMessage=new IntroLogo( this,"pressAnyKey",0,0 );
        this.introMessage.setPosition( new cc.Point( screenWidth*3/4,screenHeight/2 ) );
        this.addChild( this.introMessage );
        this.introMessage.runAnimationPressAnyKey();
        this.introArr.push( this.introMessage );
    },
    hideIntro: function() {
        for( var i=0; i<this.introArr.length; i++ )
            this.introArr[i].hideThis();
    },
    onKeyDown: function( e ) {
        this.layer.mainMenuLayer.startMainMenu();
    }
});