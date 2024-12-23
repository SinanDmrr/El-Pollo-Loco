const level1 = new Level(
    [
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Endboss()
    ],
    [
        new Cloud('assets/img/5_background/layers/4_clouds/full.png')
    ],
    [
        new BackgroundObject('assets/img/5_background/layers/air.png', -719),
        new BackgroundObject('assets/img/5_background/layers/3_third_layer/1.png', -719),
        new BackgroundObject('assets/img/5_background/layers/2_second_layer/1.png', -719),
        new BackgroundObject('assets/img/5_background/layers/1_first_layer/1.png', -719),
        new BackgroundObject('assets/img/5_background/layers/air.png'),
        new BackgroundObject('assets/img/5_background/layers/3_third_layer/2.png'),
        new BackgroundObject('assets/img/5_background/layers/2_second_layer/2.png'),
        new BackgroundObject('assets/img/5_background/layers/1_first_layer/2.png'),
        new BackgroundObject('assets/img/5_background/layers/air.png', 719),
        new BackgroundObject('assets/img/5_background/layers/3_third_layer/1.png', 719),
        new BackgroundObject('assets/img/5_background/layers/2_second_layer/1.png', 719),
        new BackgroundObject('assets/img/5_background/layers/1_first_layer/1.png', 719),
        new BackgroundObject('assets/img/5_background/layers/air.png', 719 * 2),
        new BackgroundObject('assets/img/5_background/layers/3_third_layer/2.png', 719 * 2),
        new BackgroundObject('assets/img/5_background/layers/2_second_layer/2.png', 719 * 2),
        new BackgroundObject('assets/img/5_background/layers/1_first_layer/2.png', 719 * 2)
    ]
);