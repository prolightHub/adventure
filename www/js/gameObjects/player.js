export default class Player {

    constructor (scene, x, y)
    {
        this.scene = scene;

        this.sprite = scene.physics.add.sprite(x, y, "player");

        this.sprite.setDrag(100, 0).setMaxVelocity(250, 600).setDrag(100, 20);
      
        this.keys = scene.input.keyboard.createCursorKeys();
    }

    update (blockLayer)
    {   
        if(!this.sprite || !this.sprite.body || this.reachedGoal || this.isDead)
        {
            return;
        }

        const keys = this.keys;
        const sprite = this.sprite;
        const speed = 1000;
        const jumpHeight = 490;

        // Horizontal movement
        if(keys.left.isDown) 
        {
            sprite.body.setAccelerationX(-speed).setDrag(230, 20);
            sprite.setFlipX(true);
        }
        else if(keys.right.isDown) 
        {
            sprite.body.setAccelerationX(speed).setDrag(230, 20);
            sprite.setFlipX(false);
        }else{
            sprite.setAccelerationX(0).setDrag(600, 20);
        }

        // Vertical movement
        if(keys.up.isDown && sprite.body.onFloor()) 
        {
            sprite.body.setVelocityY(-jumpHeight);
        }

        this.onFloor = sprite.body.onFloor();

        // If the sprite falls off the level freeze the player.
        if(sprite.y > blockLayer.height + sprite.height)
        {
            this.kill();
        }
    }

    onCollide (sprite, tile)
    {
        switch(tile.index)
        {
            case TILES.coloredTiles.GOAL:
                this.finish();
                break;

            case TILES.coloredTiles.LAVA:
                this.kill();
                break;
        }
    }

    finish ()
    {
        this.reachedGoal = true;
        this.freeze();
    }

    freeze ()
    {
        this.sprite.body.moves = false;
    }

    unfreeze ()
    {
        this.sprite.body.moves = true;
    }

    destroy ()
    {
        this.sprite.destroy();
    }

    kill ()
    {
        this.freeze();
        this.isDead = true;
    }

    revive ()
    {
        this.isDead = false;
    }
}