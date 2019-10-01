import Player from "../gameObjects/player.js";
import levelHandler from "../utils/levelUtils.js";
import game from "../game.js";

var buttons = createButtons();

export default class PlayScene extends Phaser.Scene {

    constructor ()
    {
        super("play");
    }

    preload ()
    {
        this.load.tilemapTiledJSON(levelHandler.levelName, "assets/tilemaps/" + levelHandler.levelName + ".json");

        this.load.spritesheet("defaultTiles", "assets/tilesets/defaultTiles.png", 
        { 
            frameWidth: 32, 
            frameHeight: 32 
        });

        this.load.image("player", 'assets/spritesheets/player.png');
        this.load.image("heart1", 'assets/images/heart1.png');        
        this.load.image("heart2", 'assets/images/heart2.png');        
        this.load.image("heart3", 'assets/images/heart3.png');        
        this.load.image("heart4", 'assets/images/heart4.png');        
    }

    create ()
    {
        levelHandler.busy = true;

        // Create level stuff
        levelHandler.level = this.make.tilemap({ key: levelHandler.levelName });
        levelHandler.defaultTiles = levelHandler.level.addTilesetImage("defaultTiles", "defaultTiles");
        levelHandler.blockLayer = levelHandler.level.createDynamicLayer("World", [levelHandler.defaultTiles], 0, 0);
        levelHandler.blockLayer.setCollisionByExclusion([-1, TILES.LAVA, TILES.DOOR1, TILES.DOOR2]);

        // Create player at the spawn point or door then make him collide and finally revive him.

        let spawnPoint = {};

        switch(levelHandler.travelType)
        {
            case "spawnPoint":
                spawnPoint = levelHandler.level.findObject("Objects", obj => obj.name === "Player Spawn Point");
                levelHandler.lastSpawnPointLevel = levelHandler.levelName;
                break;

            case "door":
                levelHandler.level.findObject("Objects", obj => 
                {    
                    // We found a match
                    if(obj.type === "door" && obj.name.replace("Door", "").replace("door", "") === levelHandler.doorSymbol)
                    {
                        spawnPoint.x = obj.x + 16;
                        spawnPoint.y = obj.y + 32 + (obj.height - this.player.sprite.height);
                    }
                });
                break;
        }

        this.player = new Player(this, spawnPoint.x, spawnPoint.y);
        this.player.sprite.body.setCollideWorldBounds(true);
        this.player.reset(levelHandler.travelType);

        // Because I can't think of a better way to do it.
        if(this.lastPlayer && levelHandler.travelType === "door")
        {
            this.lastPlayer.copyOverStats(this.player);
        }

        // Add a collider for the block layer and the player and
        // have the camera start following the player
        this.physics.add.collider(this.player.sprite, levelHandler.blockLayer);
        this.cameras.main.startFollow(this.player.sprite);

        levelHandler.blockLayer.setTileIndexCallback(TILES.LAVA, function(objectA, objectB)
        {
            this.player.onCollide.apply(this.player, [objectB, "lava", this.time.now]);
        }, this);

        levelHandler.level.findObject("Objects", obj => 
        {    
            if(obj.type === "door")
            {
                var object = this.physics.add.sprite(obj.x, obj.y, "door").setOrigin(0, 0).setDepth(-1);
                object.body.moves = false;

                object.setVisible(false);

                object.obj = obj;

                this.physics.add.overlap(this.player.sprite, object, function(objectA, objectB)
                {
                    this.player.onCollide.apply(this.player, [objectB, "door"]);
                }, 
                null, this);
            }
        });

        // Set bounds for objects and camera
        this.physics.world.setBounds(0, 0, levelHandler.level.widthInPixels, levelHandler.level.heightInPixels, true, true, true, false);
        this.cameras.main.setBounds(0, 0, levelHandler.level.widthInPixels, levelHandler.level.heightInPixels);

        this.player.hearts = [];

        for(var i = 0; i < this.player.maxHp / 4; i++)
        {
            this.player.hearts.push(this.add.sprite(30 + i * 40, 30, "heart4").setScrollFactor(0));
        }

        this.input.keyboard.on("keydown-P", function(event)
        {
            game.pause(this);
        }, this);

        if(levelHandler.busy)
        {
            this.scene.get("fxScene").fadeIn();
        }

        levelHandler.busy = false;
    }

    update (time, delta)
    {
        if(levelHandler.busy)
        {
            return;
        }

        this.player.update(time, delta);

        if(this.player.dead)
        {
            this.fadeIO(1000, () =>
            {
                game.gameOver(this, this.player, levelHandler);
            });
        }
        if(this.player.goingThroughDoor)
        {
            this.fadeIO(1000, () =>
            {
                game.nextLevel(this, this.player, levelHandler, this.player.touchedObject);
            });
        }

        // Update hearts based on the player's hp
        var index = this.player.hearts.length - 1;
        var lastHeart = this.player.hearts[index];
        var num = (this.player.hp - index * 4);

        lastHeart.destroy();
        this.player.hearts.pop();

        if(num > 0)
        {
            this.player.hearts.push(this.add.sprite(lastHeart.x, lastHeart.y, "heart" + num).setScrollFactor(0));
        }
    }

    render ()
    {
        
    }

    fadeIO (duration, func)
    {
        this.scene.get("fxScene").fadeOut(duration, func);
        levelHandler.busy = true;
    }
}
