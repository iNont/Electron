var BattleItems = cc.Sprite.extend({
    ctor: function( layer,key ) {
    	this.layer = layer;
        this._super();
        this.controller(key);
    },
    controller: function( key ) {
        if( key==BattleItems.KEYS.INK )
            this.runInkItem();
        else if( key==BattleItems.KEYS.INVERSE )
            this.runInverseItem();
        else if( key==BattleItems.KEYS.RANDOM_TURN )
            this.runRandomTurnItem();
        else if( key==BattleItems.KEYS.INVISIBILITY )
            this.runInvisibilityItem();
        else if( key==BattleItems.KEYS.MUSIC_ANNOY )
            this.runMusicAnnoyItem();
        else if( key==BattleItems.KEYS.FOUR_COMBO )
            this.runFourComboItem();
        else if( key==BattleItems.KEYS.ILLUSION )
            this.runIllusionItem();
        else if( key==BattleItems.KEYS.FIX_NOTE )
            this.runFixNoteItem();
        else if( key==BattleItems.KEYS.DOUBLE )
            this.runDoubleBoostItem();
    },
    runInkItem: function() {
        var src = "images/BI0.png";
        this.initWithFile( src );
        this.setPosition( new cc.Point( screenWidth/2,screenHeight/2 ) );
        this.setScale( gameScale );
        this.setOpacity( 0 );
        this.inkShown=false;
        this.layer.addChild( this,999 );
        this.schedule( this.updateInk,0,Infinity,0 );
    },
    updateInk: function() {
        var opac=this.getOpacity();
        if( opac<255 && !this.inkShown ) {
            this.setOpacity( opac+BattleItems.INK_OPAC.UP );
        }
        else if( opac>0 ) {
            this.inkShown=true;
            this.setOpacity( opac-BattleItems.INK_OPAC.DOWN );
        }
        else
            this.layer.removeChild( this );
    },
    runDoubleBoostItem: function() {
        this.layer.addChild( this );
        this.changeBoost();
        this.schedule( this.updateBoostTimer,7,0,0 );
    },
    changeBoost: function() {
        this.layer.isBoost=true;
    },
    updateBoostTimer: function() {
        this.layer.isBoost=false;
        this.layer.removeChild( this );
    },
    runIllusionItem: function() {
        this.layer.illusionStack++;
    },
    runFourComboItem: function() {
        this.layer.combo+=4;
    },
    runInverseItem: function() {
        this.layer.addChild( this );
        this.changeInverseControl();
        this.schedule( this.updateInverseTimer,7,0,0 );
    },
    runRandomTurnItem: function() {
        var random=Math.floor( Math.random()*2 );
        var speed=45;
        if( random==0 )
            speed*=-1;
        for( var i=0; i<this.layer.units.length; i++) {
            this.layer.units[i].setRotation( this.layer.units[i].getRotation()-speed );
            if( this.layer.unit[i].fixedNote )
                this.layer.unit[i].fixedNote = false;
        }
    },
    changeInverseControl: function() {
        this.layer.isInverse=!this.layer.isInverse;
    },
    updateInverseTimer: function() {
        this.changeInverseControl();
        this.layer.removeChild( this );
    },
    runFixNoteItem: function() {
        this.layer.addChild( this );
        this.changeFixNote();
        this.schedule( this.updateFixNoteTimer,3,0,0 );
    },
    changeFixNote: function() {
        this.layer.isFixNote = true;
    },
    updateFixNoteTimer: function() {
        this.layer.isFixNote = false;
        this.layer.removeChild( this );
    },
    runInvisibleItem: function() {
        this.layer.addChild( this );
        this.changeInvisibleMode();
        this.schedule( this.updateInvisibleTimer,10,0,0 );
    },
    changeInvisibleMode: function() {
        this.layer.invisibleMode=true;
    },
    updateInvisibleTimer: function() {
        this.layer.invisibleMode=false;
        this.layer.removeChild( this );
    },
    runMusicAnnoyItem: function() {
        this.layer.addChild( this );
        this.layer.musicAnnoy.setMute( false );
        this.layer.music.setMute( true );
        this.schedule( this.updateMusicAnnoyTimer,BattleItems.MUSIC_ANNOY_DURATION,0,0 );
    },
    updateMusicAnnoyTimer: function() {
        this.layer.music.setMute( false );
        this.layer.musicAnnoy.setMute( true );
        this.layer.removeChild( this );
    },

    update: function( dt ) {
    },
});

BattleItems.KEYS = {
    RANDOM_TURN: 1,
    INVERSE: 5,
    INVISIBILITY: 3,
    ILLUSION: 4,
    INK: 0,
    MUSIC_ANNOY: 2,
    FOUR_COMBO: 6,
    FIX_NOTE: 7,
    DOUBLE: 8
};
BattleItems.DETAIL = [
    "make enemy hard to see the notes",
    "turn all enemy's notes one time with the random direction",
    "revert the enemy's music for a few second and then back to current",
    "enemy's notes will appear when the notes is close to blue circle for a few duration",
    "make three fake notes to the enemy for one time",
    "inverse the enemy's control",
    "plus four to your combo",
    "in a few duration the notes will create with no need to turn",
    "in a few duration, the score you get will be double\nif you 'miss' in this duration score will reduce 70% of the score you get"
];
BattleItems.NAME = ["Ink","Random Turn","Music Move","Invisibility","Illusion","Inverse","Four Combo","Fix Note","Double Boost"];
BattleItems.POWER_COST = [900,750,300,900,900,1500,600,1050,1500];
BattleItems.INK_OPAC = {
    UP: 17,
    DOWN: 1
};
BattleItems.MUSIC_ANNOY_DURATION = 6.5;