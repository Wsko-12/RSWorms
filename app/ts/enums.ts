export enum EMapPacksNames {
    moon = 'moon',
    candy = 'candy',
}

export enum EMapPacksDecorItems {
    moon = 13,
    candy = 13,
}

export enum EWorldSizes {
    small = 512,
    medium = 1024,
    big = 2048,
}

export const enum EProportions {
    mapWidthToHeight = 2,
}

export const enum EConstants {
    bgScale = 4,
    cameraFov = 45,

    throwableExplosionDelay = 5000,
}

export const enum ELayersZ {
    bg = 100,
    map = 0,
    worms = 1,
    aim = 25,
    weapons = 10,
    bullets = 10,
    water = 50,
}

export const enum ESizes {
    worm = 20,
}

export enum EWeapons {
    bazooka = 'bazooka',
    grenade = 'grenade',
    dynamite = 'dynamite',
    mine = 'mine',
}

export enum ETeamColors {
    '#eb3b3b',
    '#3b55eb',
    '#6beb54',
    '#eb54c8',
}

export const enum ELang {
    rus = 'russian',
    eng = 'english',
}

export const enum ESoundsBG {
    menu = 'menu-loop',
    outerspace = 'outerspace',
}

export const enum ESoundsBullet {
    blowtorch = 'BlowTorch',
    drill = 'DRILL',
    explosionBazooka = 'Explosion1',
    explosionGrenade = 'Explosion2',
    explosion = 'Explosion3',
    freeze = 'Freeze',
    girder = 'GIRDERIMPACT',
    grenadeCollision = 'GRENADEIMPACT',
    holyGrenadeCollision = 'HOLYGRENADEIMPACT',
    jetpack = 'JetPackLoop2',
    mineArm = 'MineArm',
    mineCollision = 'MINEIMPACT',
    ninjaRopeCollision = 'NinjaRopeImpact',
    shotgun = 'ShotGunFire',
    teleport = 'Teleport',
    axe = 'VikingAxeImpact',
}

export const enum ESoundsFX {
    cursorSelect = 'cursorSelect',
    startRound = 'StartRound',
    teamDrop = 'TeamDrop',
    timerHurry = 'TIMERTICK',
}

export const enum ESoundsWeapon {
    airstrike = 'Airstrike',
    holyGrenade = 'HOLYGRENADE',
    jetpack = 'JetPackStart',
    NinjaRope = 'NinjaRopeFire',
    powerUp = 'ROCKETPOWERUP',
    rocketRelease = 'ROCKETRELEASE',
    scalesOfJustice = 'ScalesOfJustice',
    sheep = 'SHEEPBAA',
    shotgunReload = 'SHOTGUNRELOAD',
    throwRelease = 'THROWRELEASE',
}

export const enum ESoundsWormAction {
    splash = 'splash',
    drown = 'UnderWaterLoop',
    walk = 'Walk-Expand',
    landing = 'WormLanding',
    backflip = 'WORMSPRING',
    cought1 = 'cought1',
    cought2 = 'cought2',
}

export const enum ESoundsWormSpeech {
    boring = 'boring',
    notGood = 'bummer',
    bye = 'byebye',
    collect = 'collect',
    hurry = 'comeonthen',
    coward = 'coward',
    dragonPunch = 'dragonpunch',
    drop = 'drop',
    fatality = 'fatality',
    fire = 'fire',
    firstblood = 'firstblood',
    grenade = 'grenade',
    hello = 'hello',
    hurryTimer = 'hurry',
    illGetYou = 'illgetyou',
    airstrike = 'imcoming',
    jump1 = 'jump1',
    jump2 = 'jump2',
    justYouWait = 'justYouWait',
    mineArm = 'laugh',
    missed = 'missed',
    no = 'nooo',
    ohSlide = 'ohdeer',
    crazy = 'oinutter',
    oof1 = 'oof1',
    oof2 = 'oof2',
    oof3 = 'oof3',
    oof4 = 'ouch',
    oof5 = 'ow1',
    oof6 = 'ow2',
    oof7 = 'ow3',
    oops = 'oops',
    airstrike2 = 'orders',
    perfect = 'perfect',
    revenge = 'revenge',
    dinamyteArm = 'runaway',
    stupid = 'stupid',
    traitor = 'traitor',
    victory = 'victory',
    bulletRelease = 'watchthis',
    whatThe = 'whatthe',
    startRound = 'yessir',
    youllRegret = 'youllregretthat',
}

export const enum ECustomEvents {
    click = 'custom-click',
}

export enum EFallenObjects {
    aidkit,
    barrel,
}
