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

    fadeIO (duration, func)
    {
        var halfTime = duration / 2;

        var cam = this.cameras.main;

        cam.once("camerafadeoutcomplete", () =>
        {
            func(cam);
            cam.fadeIn(500);
        });

        cam.fadeOut(halfTime, 0);
    }
}
