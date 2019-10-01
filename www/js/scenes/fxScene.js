export default class FxScene extends Phaser.Scene {

    constructor ()
    {
        super("fxScene");
    }

    preload ()
    {
    }

    create ()
    {
        
    }

    update ()
    {
        
        
    }

    render ()
    {
        
    }

    fadeIn ()
    {
        this.cameras.main.fadeIn(this.halfTime || 100);
    }

    fadeOut (duration, func)
    {
        this.halfTime = duration / 2;

        var cam = this.cameras.main;

        cam.once("camerafadeoutcomplete", () =>
        {
            func(cam);
            // cam.fadeIn(500);
        });

        cam.fadeOut(this.halfTime, 0);
    }

    fadeIO (duration, func)
    {
        this.halfTime = duration / 2;

        var cam = this.cameras.main;

        cam.once("camerafadeoutcomplete", () =>
        {
            func(cam);
            cam.fadeIn(500);
        });

        cam.fadeOut(this.halfTime, 0);
    }
}
