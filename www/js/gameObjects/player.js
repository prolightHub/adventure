import levelHandler from "../utils/levelUtils.js";

export default class Player {

    constructor (scene, x, y)
    {
        this.sprite = scene.physics.add.sprite(x, y, "player");

        this.sprite.setDrag(100, 0).setMaxVelocity(250, 600).setDrag(100, 20);
        this.sprite.isPlayer = true;
      
        this.keys = scene.input.keyboard.createCursorKeys();

        // Hp, must be in multiples of 4
        this.maxHp = 12;
        this.hp = 12;

        this.lastHurtTime = 0;
        this.hurtInterval = 1000;

        this.lastBlinkTime = 0;
        this.blinkInterval = 50;
    }

    update (time, delta)
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

        if(sprite.y > levelHandler.blockLayer.height + sprite.height ||
            this.hp <= 0)
        {
            this.kill();
        }

        if(time - this.lastHurtTime < this.hurtInterval)
        {
            if(time - this.lastBlinkTime >= this.blinkInterval)
            {
                this.sprite.setVisible(!this.sprite._visible);

                this.lastBlinkTime = time;
            }
        }else{
            this.sprite.setVisible(true);
        }
    }

    onCollide (object, type, time)
    {
        switch(type)
        {
            case "lava":
                // this.kill();

                if(time - this.lastHurtTime >= this.hurtInterval)
                {
                    this.hp--;

                    this.lastHurtTime = time;
                }
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

    kill ()
    {
        this.sprite.body.stop();
        this.dead = true;
    }

    revive ()
    {
        this.dead = false;
        this.hp = this.maxHp;
    }

    reset (travelType)
    {
        /* 
            Reset sum stats...
            Important! calling revive may need to be changed in the
            future due to refilling the player's health when going through a door.
        */

        if(travelType === "spawnPoint")
        {
            this.revive();
        }

        this.goingThroughDoor = false;
        delete this.touchedObject;
    }

    copyOverStats (newPlayer)
    {
        // Copy over anything that matters.
        newPlayer.hp = this.hp;
        newPlayer.dead = this.dead;
    }
}