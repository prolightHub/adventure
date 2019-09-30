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
                        spawnPoint.y = obj.y + 32;
                    }
                });
                break;
        }

        this.player = new Player(this, spawnPoint.x, spawnPoint.y);
        this.player.sprite.body.setCollideWorldBounds(true);
        this.player.reset();

        // Add a collider for the block layer and the player and
        // have the camera start following the player
        this.physics.add.collider(this.player.sprite, levelHandler.blockLayer);
        this.cameras.main.startFollow(this.player.sprite);

        levelHandler.blockLayer.setTileIndexCallback(TILES.LAVA, function(objectA, objectB)
        {
            this.player.onCollide.apply(this.player, [objectB, "lava"]);
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

        levelHandler.busy = false;
    }

    update ()
    {
        if(levelHandler.busy)
        {
            return;
        }

        this.player.update();

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
        
    }

    render ()
    {
        
    }

    fadeIO (duration, func)
    {
        var fxScene = this.scene.get("fxScene");

        fxScene.fadeIO(duration, func);

        levelHandler.busy = true;
    }
}
