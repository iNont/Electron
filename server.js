var io = require('socket.io').listen(8080, {
    log: 0,
});
var colors = require('colors');

var clients = [];
var waiting = null;
var string = {
    info:'   info    - '.bold.green,
    message:'   message - '.bold.blue,
    update:'   update  - '.bold.cyan,
}
var datetime = new Date().toISOString();

console.log('Date: '.underline.bold.red+datetime.bold.yellow);
console.log('>>>>>>>>>>|| ELECTRON ||<<<<<<<<<<'.bold.yellow);

io.sockets.on('connection', function(socket) {
    socket.on('regis', function( name ) {
        console.log(string.info+'Player Connected : '.red.bold+name+" ("+this.id+")");
        socket.name = name;
        clients.push(this.id);
    });
    socket.on('findMatch', function() {
        console.log(string.message+'Player finding match'.bold);
        console.log(string.info+'Player : '.bold+socket.name+" ("+this.id+")");
    	if( waiting == null )
    		waiting = this.id;
    	else {
            var enemy = io.sockets.socket(waiting);
            console.log(string.message+'Match start'.bold);
            console.log(string.info+'Player One : '.bold+enemy.name+" ("+waiting+")");
            console.log(string.info+'Player Two : '.bold+socket.name+" ("+this.id+")");
	    	socket.emit('startGame' , waiting,enemy.name );
	    	enemy.emit('startGame' , this.id,socket.name );
            waiting = null;
    	}
    });
    socket.on('stopFinding', function() {
        if( waiting == this.id ) {
            console.log(string.message+'Player stop finding match'.bold);
            console.log(string.info+'Player : '.bold+socket.name+" ("+this.id+")");
            waiting = null;
        }
    });
    socket.on('sendBattleItem', function( itemKey,enemy ) {
        var enemy = io.sockets.socket(enemy);
        console.log(string.message+'Player use item Key : '.bold+itemKey);
        console.log(string.info+'Player : '.bold+socket.name+" ("+this.id+")");
        enemy.emit('effectBattleItem' , itemKey);
    });
    socket.on('sendLog', function( message,enemy ) {
        console.log(string.update+message);
        var enemy = io.sockets.socket(enemy);
        socket.emit('logMessage' , message);
        enemy.emit('logMessage' , message);
    });
    socket.on('endGame', function( enemyID,name,score,maxCombo,perfect,great,cool,miss ) {
        socket.endStatus = ['showEnemyScore', name,score,maxCombo,perfect,great,cool,miss];
        var enemy = io.sockets.socket(enemyID);
        if( enemy.endStatus != null ) {
            console.log(string.message+'Match end'.bold);
            console.log(string.info+'Player One : '.bold+enemy.name+" ("+enemyID+")");
            console.log(string.info+'Player Two : '.bold+socket.name+" ("+this.id+")");

            socket.emit.apply(socket, enemy.endStatus);
            enemy.emit.apply(enemy, socket.endStatus);
            enemy.endStatus = null;
            socket.endStatus = null;
        }
    });
    socket.on('disconnect', function() {
        if( waiting == this.id )
            waiting = null;
        console.log(string.info+"Player Disconnected : ".bold.red+socket.name+" ("+this.id+")");
        for( var i=0;i<clients.length;i++){
        	if(clients[i] == this.id) {
    			clients.splice(i, 1);
    			break;
    		}
        }
    });
});  