
var buttons = createButtons();
var graphics;

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

            this.cameras.main.once('camerafadeoutcomplete', function (camera) 
            {
                camera.fadeIn(800, 0);

                this.scene.start("play");
                this.cutScening = false;
            }, this);
        
            this.cameras.main.fadeOut(400, 0);
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

        buttons.draw(graphics);

        graphics.fillStyle();
    }

    render ()
    {
        
    }
}