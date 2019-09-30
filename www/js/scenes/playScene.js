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

        // Create player at the spawn point then make him collide and finally revive him.
        const spawnPoint = levelHandler.level.findObject("Objects", obj => obj.name === "Player Spawn Point");
        this.player = new Player(this, spawnPoint.x, spawnPoint.y);
        this.player.sprite.body.setCollideWorldBounds(true);
        this.player.revive();



        // Add a collider for the block layer and the player and
        // have the camera start following the player
        this.physics.add.collider(this.player.sprite, levelHandler.blockLayer);
        this.cameras.main.startFollow(this.player.sprite);

        levelHandler.blockLayer.setTileIndexCallback(TILES.LAVA, function(objectA, objectB)
        {
            this.player.onCollide.apply(this.player, [objectB, "lava"]);
        }, this);

        var doors = {};
        levelHandler.level.findObject("Objects", obj => 
        {    
            if(obj.type === "door")
            {
                doors[obj.name] = obj;

                obj.object = this.physics.add.sprite(obj.x, obj.y, "door").setOrigin(0, 0).setDepth(-1);
                obj.object.body.moves = false;

                this.physics.add.overlap(this.player.sprite, obj.object, function(objectA, objectB)
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
    }

    fadeIO (duration, func)
    {
        var halfTime = duration / 2;

        var cam = this.cameras.main;

        cam.once("camerafadeoutcomplete", () =>
        {
            cam.fadeIn(halfTime, 0);

            func(cam);

            levelHandler.busy = false;
        });

        cam.fadeOut(halfTime, 0);

        levelHandler.busy = true;
    }

    render ()
    {
        
    }
}
