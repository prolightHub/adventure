import Player from "../gameObjects/player.js";

var buttons = createButtons();
var graphics;

var levelInfo = {
    level: "level1",
    allLevels: [
        "level1", "level2"
    ]
};

export default class PlayScene extends Phaser.Scene {

    constructor ()
    {
        super("play");
    }

    preload ()
    {
        this.load.tilemapTiledJSON("level1", 'assets/tilemaps/level1.json');
        this.load.tilemapTiledJSON("level2", 'assets/tilemaps/level2.json');

        this.load.spritesheet("coloredTiles", 'assets/tilesets/coloredTiles.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("newTiles", 'assets/tilesets/newTiles.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image("player", 'assets/spritesheets/player.png');
        this.load.image("door", 'assets/images/door.png');
    }

    create ()
    {
        // Tiled related stuff

        this.level = this.make.tilemap({ key: levelInfo.level });
        this.blockTiles = this.level.addTilesetImage("coloredTiles", "coloredTiles");
        this.newTiles = this.level.addTilesetImage("newTiles", "newTiles");

        this.blockLayer = this.level.createDynamicLayer("World", [this.blockTiles, this.newTiles], 0, 0);
        this.blockLayer.setCollisionByExclusion([-1, TILES.coloredTiles.GOAL, TILES.coloredTiles.DOOR1, TILES.coloredTiles.DOOR2]);

        if(this.player && this.player.travelObject && this.player.travelType === "door")
        {
            var door = this.player.travelObject;
            this.player = new Player(this, door.x, door.y);
        }else{
            const spawnPoint = this.level.findObject("Objects", obj => obj.name === "Player Spawn Point");
            this.player = new Player(this, spawnPoint.x, spawnPoint.y);
        }

        var doors = {};
        this.level.findObject("Objects", obj => {
            
            if(obj.type === "door")
            {
                doors[obj.name] = obj;

                obj.object = this.physics.add.sprite(obj.x, obj.y, "door").setOrigin(0, 0).setDepth(-1);
                obj.object.body.moves = false;

                this.physics.add.collider(obj.object, this.player.sprite, null, function()
                {
                    this.player.onDoor.apply(this.player, arguments);
                }, this);
            }
        });

        this.blockLayer.setTileIndexCallback(TILES.coloredTiles.GOAL, function()
        {
            this.player.onCollide.apply(this.player, arguments);
        }, this);

        this.player.sprite.body.setCollideWorldBounds(true);
        this.physics.add.collider(this.player.sprite, this.blockLayer);
        this.cameras.main.startFollow(this.player.sprite);

        this.physics.world.setBounds(0, 0, this.level.widthInPixels, this.level.heightInPixels, true, true, true, false);
        this.cameras.main.setBounds(0, 0, this.level.widthInPixels, this.level.heightInPixels);

        // Other stuff
        graphics = this.add.graphics();

        buttons.pause = new Button(this, 20, 20, 40, 40, new Phaser.Display.Color(0, 140, 40), "❚❚", 
        {
            fontSize: '20px',
            fill: '#FFFFFF',
            align: 'center'
        }, 
        function()
        {
            this.pause();
        });

        buttons.pause.offsetX = 0.6;
        buttons.pause.offsetY = 0.6;
        
        buttons.pause.text.setScrollFactor(0);
        graphics.setScrollFactor(0);

        this.input.keyboard.on("keydown-P", function(event)
        {
            this.pause();
        }, 
        this);

        this.input.on('pointerdown', function (pointer) 
        {
            buttons.onpointerdown.apply(this, arguments); 
        }, 
        this);
    }

    update ()
    {
        if(this.restarting)
        {
            return;
        }

        graphics.clear();
        buttons.draw(graphics);
        this.player.update(this.blockLayer);

        if(this.player.isDead)
        {
            this.restart();
        }
        else if(this.player.reachedGoal)
        {
            this.nextLevel();
            this.player.reachedGoal = false;
        }
    }
l
    render ()
    {
        
    }

    nextLevel ()
    {
        var cam = this.cameras.main;

        cam.once("camerafadeoutcomplete", () => 
        {
            levelInfo.level = levelInfo.allLevels[Number(levelInfo.level.replace("level", ""))];

            this.scene.restart();
           
            this.restarting = false; 
            this.player.reachedGoal = false;
            this.player.unfreeze();

            cam.fadeIn(500, 0);

            setTimeout(() => {
                this.restarting = false;
            });
        });

        cam.fadeOut(500, 0);
        this.restarting = true; 
    }

    restart ()
    {
        var cam = this.cameras.main;

        cam.once("camerafadeoutcomplete", () => 
        {
            this.player.destroy();
            this.scene.restart();
           
            cam.fadeIn(500, 0);

            this.player.revive();
            this.restarting = false;     
        });

        cam.fadeOut(500, 0);
        this.restarting = true; 
    }

    pause ()
    {
        if(this.cutScening)
        {
            return;
        }

        this.cameras.main.once('camerafadeoutcomplete', function (camera) 
        {
            camera.fadeIn(800, 0);

            this.scene.pause();
            this.scene.launch("pause");

            this.cutScening = false;
        }, this);
    
        var self = this;
        game.renderer.snapshot(function(image)
        {
            self.scene.get("pause").toRender = image;
        });

        this.cameras.main.fadeOut(400, 0);
        this.cutScening = true;
    }
}

var LevelCarrier = function(config)
{
    // I still don't know what to put here.
};

var level1 = new LevelCarrier({


});

