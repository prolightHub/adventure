
var buttons = createButtons();
var graphics;

import game from "../game.js";

export default class MainScene extends Phaser.Scene {

    constructor ()
    {
        super("main");
    }

    preload ()
    {
        
    }

    create ()
    {
        graphics = this.add.graphics();

        this.add.text(400, 120, "Adventure", 
        {
            fill: '#FFFFFF',
            align: 'center',
            fontSize: '40px',
            fontFamily: '"Press Start 2P"'
        })
        .setOrigin(0.5, 0.5);

        buttons.play = new Button(this, 400, 240, 120, 40, new Phaser.Display.Color(0, 140, 40), "Play", 
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
                game.start(this);

                this.cutScening = false;
            });
            
            this.cutScening = true;
        });

        this.input.on('pointerdown', function (pointer) 
        {
            buttons.onpointerdown.apply(this, arguments); 
        }, 
        this);
    }

    update ()
    {
        graphics.clear();

        graphics.fillStyle(0x36B0C1);
        graphics.fillRect(0, 0, window.config.width, window.config.height);

        buttons.draw(graphics);

        graphics.fillStyle();
    }

    render ()
    {
        
    }
}