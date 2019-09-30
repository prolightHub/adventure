import levelHandler from "../utils/levelUtils.js";

export default class Player {

    constructor (scene, x, y)
    {
        this.sprite = scene.physics.add.sprite(x, y, "player");

        this.sprite.setDrag(100, 0).setMaxVelocity(250, 600).setDrag(100, 20);
        this.sprite.isPlayer = true;
      
        this.keys = scene.input.keyboard.createCursorKeys();
    }

    update ()
    {   
        if(this.dead || this.goingThroughDoor)
        {
            return;
        }

        const [ keys, sprite ] = [this.keys, this.sprite];
        let speed = 1000;
        let jumpHeight = 490;

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

        if(keys.up.isDown && sprite.body.onFloor()) 
        {
            sprite.body.setVelocityY(-jumpHeight);
        }

        if(sprite.y > levelHandler.blockLayer.height + sprite.height)
        {
            this.kill();
        }
    }

    onCollide (object, type)
    {
        switch(type)
        {
            case "lava":
                this.kill();
                break;

            case "door":
                if(this.keys.down.isDown && this.sprite.body.onFloor())
                {
                    this.goingThroughDoor = true;
                    this.touchedObject = object;

                    this.sprite.body.stop();
                }
                break;
        }
    }

    kill()
    {
        this.sprite.body.stop();
        this.dead = true;
    }

    revive()
    {
        this.dead = false;
    }

    reset()
    {
         /* 
            Reset sum stats...
            Important! calling revive may need to be changed in the
            future due to refilling the player's health when going through a door.
        */
       this.revive();
       this.goingThroughDoor = false;
       delete this.touchedObject;
    }
}