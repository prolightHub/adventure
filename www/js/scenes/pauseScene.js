
var buttons = createButtons();
var graphics;

var pauseMenu = {};
var img;

/* TODO: fix the fading in the pause scene to the main scene and the main scene to the play scene */

export default class PauseScene extends Phaser.Scene {

    constructor ()
    {
        super("pause");
    }

    preload ()
    {
        
    }

    create ()
    {
        graphics = this.add.graphics();
        
        img = this.add.sprite(400, 240, "");
        img.visible = false;

        buttons.menu = new Button(this, 400, 240, 120, 40, new Phaser.Display.Color(0, 140, 40), "Menu", 
        {
            fontSize: '20px',
            fill: '#FFFFFF',
            align: 'center',
            fontFamily: '"Press Start 2P"'
        },
        function()
        {
            if(this.cutScening)
            {
                return;
            }

            this.scene.get("fxScene").fadeIO(1000, () =>
            {
                this.scene.stop("pause");
                this.scene.pause("play");
                this.scene.start("main");

                this.scene.sendToBack("play");

                this.cutScening = false;
            });

            this.cutScening = true;
        });

        this.input.keyboard.on("keydown-P", function(event)
        {
            if(!this.cutScening)
            {
                this.scene.get("fxScene").fadeIO(1000, () =>
                {
                    this.scene.stop("pause");
                    this.scene.resume("play");

                    this.cutScening = false;
                });

                this.cutScening = true;
            }
        }, this);

        this.input.on("pointerdown", function(pointer)
        {
            if(!this.cutScening && (pointer.x < 150 || pointer.x > 660))
            {
                this.scene.get("fxScene").fadeIO(1000, () =>
                {
                    this.scene.stop("pause");
                    this.scene.resume("play");

                    this.cutScening = false;
                });

                this.cutScening = true;
            }

            buttons.onpointerdown.apply(this, arguments); 
        }, this);

        pauseMenu.backingColor = new Phaser.Display.Color(0, 0, 0, 100);
    }

    update ()
    {
        if(this.toRender)
        {
            var textureManager = this.textures;

            if(textureManager.exists('area'))
            {
                textureManager.remove('area');
            }

            textureManager.addImage('area', this.toRender);

            img.setTexture("area");
            img.visible = true;
            img.setDepth(-1);

            delete this.toRender;
        }

        graphics.clear();

        graphics.fillStyle(pauseMenu.backingColor.color32, pauseMenu.backingColor.alpha);
        graphics.fillRect(150, 0, 510, 480);

        buttons.draw(graphics);
    }

    render ()
    {
        
    }
}