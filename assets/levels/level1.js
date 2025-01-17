const cloudSpacing = 800;

const level1 = new Level(
    [
    ],
    [
        new Cloud('assets/img/5_background/layers/4_clouds/full.png', -1500),
        new Cloud('assets/img/5_background/layers/4_clouds/full.png', -1500 + cloudSpacing),
        new Cloud('assets/img/5_background/layers/4_clouds/full.png', -1500 + cloudSpacing * 2),
        new Cloud('assets/img/5_background/layers/4_clouds/full.png', -1500 + cloudSpacing * 3),
        new Cloud('assets/img/5_background/layers/4_clouds/full.png', -1500 + cloudSpacing * 4),
        new Cloud('assets/img/5_background/layers/4_clouds/full.png', -1500 + cloudSpacing * 5)

    ],
    [
        new BackgroundObject('assets/img/5_background/layers/air.png', -719 * 2),
        new BackgroundObject('assets/img/5_background/layers/3_third_layer/2.png', -719 * 2),
        new BackgroundObject('assets/img/5_background/layers/2_second_layer/2.png', -719 * 2),
        new BackgroundObject('assets/img/5_background/layers/1_first_layer/2.png', -719 * 2),
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
        new BackgroundObject('assets/img/5_background/layers/1_first_layer/2.png', 719 * 2),
        new BackgroundObject('assets/img/5_background/layers/air.png', 719 * 3),
        new BackgroundObject('assets/img/5_background/layers/3_third_layer/1.png', 719 * 3),
        new BackgroundObject('assets/img/5_background/layers/2_second_layer/1.png', 719 * 3),
        new BackgroundObject('assets/img/5_background/layers/1_first_layer/1.png', 719 * 3)
    ],
    [

    ],
    null
);