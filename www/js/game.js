
var Game = (function() 
{
    /*
        @Class

        This class handles the startup of all game scenes; Maybe?
        It is not a god object, it is stateless (with a few exceptions), it only defines methods
        that call other methods and sometimes stores a variable in the method scope, until that method is done 
    */

    class Game {
        
        start (that)
        {
            that.scene.stop("main");

            if(this.gameStarted)
            {
                that.scene.resume("play");
            }else{
                that.scene.start("play");
            }

            this.gameStarted = true;
        } 

        restore (that, player, levelHandler)
        {
            if(levelHandler.playerInfo)
            {
                player.hp = levelHandler.playerInfo.hp;
                player.max = levelHandler.playerInfo.max;
            }
        }

        save (that, player, levelHandler, object)
        {
            levelHandler.checkPointInfo = {};

            levelHandler.checkPointInfo.col = object.x;
            levelHandler.checkPointInfo.row = object.y;
            levelHandler.checkPointInfo.levelName = levelHandler.levelName;

            levelHandler.playerInfo = {};

            levelHandler.playerInfo.hp = player.hp;
            levelHandler.playerInfo.maxHp = player.maxHp;

            this.trueSave(that, player, levelHandler);
        }

        trueSave (that, player, levelHandler)
        {
            localforage.setItem("adventure-saveData", JSON.stringify({
                player: levelHandler.playerInfo,
                checkPoint: levelHandler.checkPointInfo
            }));
        }

        trueRestore (that, player, levelHandler)
        {
            // Ugh this slow functions won't let anything in levelHandler be defined immediately.
            localforage.getItem("adventure-saveData", function(err, value)
            { 
                console.log(value);

                value = JSON.parse(value);
                // console.log(object)

                levelHandler.playerInfo = (value.player);
                levelHandler.checkPointInfo = (value.checkPoint);
            });
        }

        pause (that)
        {
            that.scene.get("fxScene").fadeIO(1000, function()
            {
                that.scene.pause("play");
                that.scene.launch("pause");
            });
        }

        gameOver (that, player, levelHandler)
        {
            levelHandler.levelName = levelHandler.lastSpawnPointLevel || levelHandler.levelName;

            if(!levelHandler.checkPointInfo)
            {
                levelHandler.travelType = "spawnPoint";
            }else{
                levelHandler.travelType = "checkPoint";

                levelHandler.levelName = levelHandler.checkPointInfo.levelName;
            }

            player.sprite.destroy();
            that.scene.restart();
        }

        nextLevel (that, player, levelHandler, touchedObject)
        {
            const [ doorLevel, doorSymbol ] = touchedObject.obj.properties;

            levelHandler.levelName = doorLevel.value;
            levelHandler.doorSymbol = doorSymbol.value;

            levelHandler.travelType = "door";

            that.lastPlayer = player;
            that.scene.restart();
        }
    }

    var instance;

    return {
        GetInstance: function() 
        {
            if(!instance) 
            {
                instance = new Game();
            }
            return instance;
        }
    };
})();

export default Game.GetInstance();