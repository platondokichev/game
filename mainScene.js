export default class MainScene extends Phaser.Scene {
    constructor() {
        super('mainScene');
        this.ground;
        this.platforms;
        this.cursor;
        this.player;
        this.enemyDirection = 'right';
        this.enemy2Direction = 'left';
        this.enemy3Direction = 'left';
        this.golemDirection = 'right';
        this.playerHealth = 100;
        this.havepoison = false; // Исправлено: теперь это булевый тип
        this.havesword = false;
        this.inventory = [];
        this.inventoryText;

        this.sword;
        this.poison;
    }

    createHealthBar() {
        this.healthBar = this.add.graphics();
        this.playerHealth = 100;
        this.updateHealthBar();
    }

    updateHealthBar() {
        if (this.playerHealth <= 0) {
            this.playerHealth = 0;
        }

        const x = 10;
        const y = 10;
        const width = 200;
        const height = 20;

        this.healthBar.clear();
        this.healthBar.fillStyle(0x177245);
        this.healthBar.fillRect(x, y, width * (this.playerHealth / 100), height);
        this.healthBar.lineStyle(2, 0x000000);
        this.healthBar.strokeRect(x, y, width, height);
    }

    handleCollision() {
        this.playerHealth -= 0.01;
        if (this.playerHealth <= 0) {
            this.restartGame();
        }

        this.updateHealthBar();
    }

    restartGame() {
        this.playerHealth = 100;
        this.scene.restart();
    }

    preload() {
        this.load.image('sky', '../../assets/sky.png');
        this.load.image('ground', '../../assets/ground.png');
        this.load.image('platform', '../../assets/platform.png');
        this.load.spritesheet('player', '../../assets/player/player.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('enemy', '../../assets/enemy/enemy.png', { frameWidth: 32, frameHeight: 34 });
        this.load.spritesheet('enemy2', '../../assets/enemy2/enemy2.png', { frameWidth: 32, frameHeight: 34 });
        this.load.spritesheet('enemy3', '../../assets/enemy3/enemy3.png', { frameWidth: 64, frameHeight: 66 });
        this.load.spritesheet('sword', '../../assets/sword.png', { frameWidth: 20, frameHeight: 40 });
        this.load.spritesheet('house', '../../assets/house.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('poison', '../../assets/poison.png', { frameWidth: 39, frameHeight: 39 });
    }

    attackEnemy(player, enemy) {
        if (this.cursor.space.isDown) {
            enemy.disableBody(true, true);
        }
    }

    create() {
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 7 }),
            frameRate: 1,
            repeat: 0
        });
        this.add.image(400, 300, 'sky');

        // Создание статической группы для земли
        this.ground = this.physics.add.staticGroup();
        this.ground.create(400, 600, 'ground');

        // Создание статической группы для платформ
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(350, 300, 'platform');
        this.platforms.create(210, 200, 'platform');
        this.platforms.create(440, 410, 'platform');
        this.platforms.create(600, 240, 'platform');
        this.platforms.create(900, 150, 'platform');
        this.platforms.create(1030, 120, 'platform');
        this.platforms.create(770, 120, 'platform');
        this.platforms.create(900, 70, 'platform');

        // Создание игрока
        this.player = this.physics.add.sprite(100, 450, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.setBounce(0.2);

        this.house = this.physics.add.staticGroup();
        this.house.create(210, 140, 'house');

        // Создание курсоров для управления
        this.cursor = this.input.keyboard.createCursorKeys();

        this.poison = this.physics.add.sprite(450, 300, 'poison');
        this.physics.add.collider(this.poison, this.ground);

        this.sword = this.physics.add.sprite(145, 100, 'sword');
        this.physics.add.collider(this.sword, this.ground);
        this.physics.add.collider(this.sword, this.platforms);

        
        this.physics.add.collider(this.poison, this.platforms);

        this.physics.add.overlap(this.player, this.poison, this.collectItem, null, this);
        this.physics.add.overlap(this.player, this.sword, this.collectItem, null, this);

        this.inventoryText = this.add.text(10, 50, 'Inventory', {
            font: '16px Arial',
            fill: '#ffffff'
        });

        // Добавление коллизий
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.player, this.ground);
        this.physics.add.collider(this.player, this.house);
        this.anims.create({
            key: 'runEnemy',
            frames: this.anims.generateFrameNumbers('enemy', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'runEnemy2',
            frames: this.anims.generateFrameNumbers('enemy2', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'runEnemy3',
            frames: this.anims.generateFrameNumbers('enemy3', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'attack',
            frames: this.anims.generateFrameNames('player', {
                start: 1,
                end: 3
            }),
            frameRate: 10,
            repeat: 0
        });

        this.enemy = this.physics.add.sprite(100, 40, 'enemy');
        this.enemy2 = this.physics.add.sprite(910, 80, 'enemy2');
        this.enemy3 = this.physics.add.sprite(240, 100, 'enemy3');
        this.enemy.setCollideWorldBounds(true);
        this.enemy.setBounce(0.2);
        this.physics.add.collider(this.enemy, this.platforms);
        this.physics.add.collider(this.enemy, this.ground);
        this.enemy2.setCollideWorldBounds(true);
        this.enemy2.setBounce(0.2);
        this.physics.add.collider(this.enemy2, this.platforms);
        this.physics.add.collider(this.enemy2, this.ground);
        this.enemy3.setCollideWorldBounds(true);
        this.enemy3.setBounce(0.2);
        this.physics.add.collider(this.enemy3, this.platforms);
        this.physics.add.collider(this.enemy3, this.ground);
        this.createHealthBar();

        this.physics.add.overlap(this.player, this.enemy, this.attackEnemy, null, this);
        this.physics.add.overlap(this.player, this.enemy2, this.attackEnemy, null, this);
        this.physics.add.overlap(this.player, this.enemy3, this.attackEnemy, null, this);

        this.sword = this.add.sprite(0, 0, 'sword');
        this.sword.setVisible(false);

        this.player.sword = this.sword;
        this.sword.setOrigin(0.5, 1);
        this.sword.setRotation(Phaser.Math.DegToRad(0));
    }

    collectItem(player, item) {
        item.disableBody(true, true);
        this.inventory.push(item.texture.key);
        console.log(this.inventory)
        if (item.texture.key === 'poison') {
            this.havepoison = true; // Установите флаг при получении яда
        }
        if (item.texture.key === 'sword') {
            this.havesword = true; // Установите флаг при получении яда
        }
        this.updateInventoryDisplay();  
    }
 
    updateInventoryDisplay() {
        this.inventoryText.setText('Inventory');

        this.inventory.forEach((item, index) => {
            if (item === 'poison') {
                const itemImage = this.add.image(100 + index * 40, 60, item);
                itemImage.setScale(1);
            }
            if (item === 'sword') {
                const itemImage = this.add.image(120 + index * 40, 60, item);
                itemImage.setScale(1);
            }
        });
    }

    update() {
        this.physics.add.overlap(this.player, this.enemy, this.handleCollision.bind(this), null, this);
        this.physics.add.overlap(this.player, this.enemy2, this.handleCollision.bind(this), null, this);
        this.physics.add.overlap(this.player, this.enemy3, this.handleCollision.bind(this), null, this);
        

        // Управление движением игрока
        if (this.cursor.left.isDown) {
            this.player.setVelocityX(-160);
            if (this.player.body.touching.down) {
                this.player.anims.play('run', true);
            }
            this.player.flipX = true;
        } else if (this.cursor.right.isDown) {
            this.player.setVelocityX(160);
            if (this.player.body.touching.down) {
                this.player.anims.play('run', true);
            }
            this.player.flipX = false;
        } else {
            this.player.setVelocityX(0);
            this.player.anims.stop('run');
            this.player.setTexture('player', 0);
        }

        if (this.player.flipX === false) {
            this.sword.setPosition(this.player.x + 10, this.player.y + 8);
            this.sword.flipX = false;
        } else {
            this.sword.setPosition(this.player.x - 10, this.player.y + 8);
            this.sword.flipX = true;
        }

        // Прыжок игрока
        if (this.cursor.up.isDown && this.player.body.touching.down) {
            const jumpVelocity = this.havepoison ? -370 : -260; // Увеличьте высоту прыжка, если есть яд
            this.player.setVelocityY(jumpVelocity);
            this.player.anims.play('jump'); // Воспроизведение анимации прыжка
        } else if (this.player.body.touching.down) {
            // Если игрок на земле, останавливаем анимацию прыжка
            if (this.player.anims.currentAnim && this.player.anims.currentAnim.key === 'jump') {
                this.player.anims.stop('jump');
                this.player.setTexture('player', 0); // Сброс текстуры, если нужно
            }
        }

        if (this.enemyDirection === 'right') {
            this.enemy.setVelocityX(80);
            this.enemy.flipX = false;
            this.enemy.anims.play('runEnemy', true); 
        } else if (this.enemyDirection === 'left') {
            this.enemy.setVelocityX(-80);
            this.enemy.flipX = true;
            this.enemy.anims.play('runEnemy', true);
        }

        if (this.enemy.body.blocked.right) {
            this.enemyDirection = 'left';
        } else if (this.enemy.body.blocked.left) {
            this.enemyDirection = 'right';
        }

        if (this.enemy2Direction === 'right') {
            this.enemy2.setVelocityX(80);
            this.enemy2.flipX = false;
            this.enemy2.anims.play('runEnemy2', true); 
        } else if (this.enemy2Direction === 'left') {
            this.enemy2.setVelocityX(-80);
            this.enemy2.flipX = true;
            this.enemy2.anims.play('runEnemy2', true);
        }
        if (this.enemy2.body.touching.down) {
            this.enemy2.setVelocityY(-100);
        }

        if (this.enemy2.body.blocked.right) {
            this.enemy2Direction = 'left';
        } else if (this.enemy2.body.blocked.left) {
            this.enemy2Direction = 'right';
        }

        if (this.enemy3Direction === 'right') {
            this.enemy3.setVelocityX(80);
            this.enemy3.flipX = false;
            this.enemy3.anims.play('runEnemy3', true); 
        } else if (this.enemy3Direction === 'left') {
            this.enemy3.setVelocityX(-80);
            this.enemy3.flipX = true;
            this.enemy3.anims.play('runEnemy3', true);
        }

        if (this.enemy3.body.blocked.right) {
            this.enemy3Direction = 'left';
        } else if (this.enemy3.body.blocked.left) {
            this.enemy3Direction = 'right';
        }

        if (this.cursor.space.isDown) {
            this.player.anims.play('attack', true);
            if (this.havesword){
                this.sword.setVisible(true);
                if (this.sword.flipX == true) {
                    this.sword.setRotation(this.sword.rotation - 0.1);
                    const angle = this.sword.rotation;
                    if (angle > 2) {
                        this.sword.setRotation(Phaser.Math.DegToRad(0));
                    }
                } else {
                    this.sword.setRotation(this.sword.rotation + 0.1);
                    const angle = this.sword.rotation;
                    if (angle > 2) {
                        this.sword.setRotation(Phaser.Math.DegToRad(0));
                    }
                }
            } else {
                this.sword.setVisible(false);
                this.sword.setRotation(Phaser.Math.DegToRad(0));
            }
        }
    }
}
