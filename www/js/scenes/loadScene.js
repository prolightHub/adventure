export default class LoadScene extends Phaser.Scene {
    constructor()
    {
        super({
            key: "load",
            pack: {
                files: [{
                    type: 'plugin',
                    key: 'rexwebfontloaderplugin',
                    url: './js/plugins/rexwebfontloaderplugin.min.js',
                    start: true
                }]
            }
        });
    }

    preload()
    {
        this.plugins.get('rexwebfontloaderplugin').addToScene(this);

        var config = {
            google: {
                families: ['Bangers']
            }
        };
        this.load.rexWebFont(config);
    }

    create()
    {
        this.scene.switch("main");
        this.scene.launch("fxScene");

    }

    update()
    {
        
    }

    render()
    {

    }
}