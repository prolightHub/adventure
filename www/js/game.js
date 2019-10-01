

var Game = (function() 
{
    /*
        @Class

        This class handles the startup of all game scenes; Maybe?
        It is not a god object, it is stateless, it only defines methods
        that call other methods and sometimes stores a variable in the method scope, until that method is done 
    */

    class Game {
        
        start ()
        {

        }

        pause (that)
        {
            that.scene.get("fxScene").fadeIO(1000, function()
            {
                that.scene.pause();
                that.scene.launch("pause");
            });
        }

        gameOver (that, player, levelHandler)
        {
            levelHandler.levelName = levelHandler.lastSpawnPointLevel || levelHandler.levelName;

            levelHandler.travelType = "spawnPoint";

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


