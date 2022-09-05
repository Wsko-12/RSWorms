import { Group, Mesh, MeshBasicMaterial, NearestFilter, PlaneBufferGeometry, Texture } from 'three';
import { ELayersZ, ESizes } from '../../../../../../../../../ts/enums';
import AssetsManager from '../../../../../../assetsManager/AssetsManager';
import Weapon from '../Weapon';

export default class Aim {
    private object3D = new Group();
    private aimMesh: Mesh;

    private power = 0;
    private angle = 0;
    private deltaPower = 0.1;

    protected shootPowerMesh: Mesh;
    protected shootPowerCanvas = document.createElement('canvas');
    protected shootPowerCtx = this.shootPowerCanvas.getContext('2d');

    constructor() {
        const aimSprite = AssetsManager.getWormTexture('aim');
        if (!aimSprite) {
            throw new Error("[Weapon Aim] can't load aim sprite");
        }
        const aimTexture = new Texture(aimSprite);
        aimTexture.magFilter = NearestFilter;
        aimTexture.needsUpdate = true;
        this.aimMesh = new Mesh(
            new PlaneBufferGeometry(25, 25),
            new MeshBasicMaterial({
                map: aimTexture,
                alphaTest: 0.5,
            })
        );

        const shootingPowerTexture = new Texture(this.shootPowerCanvas);
        this.shootPowerMesh = new Mesh(
            new PlaneBufferGeometry(1, 1),
            new MeshBasicMaterial({
                map: shootingPowerTexture,
                alphaTest: 0.5,
            })
        );

        this.shootPowerMesh.position.set(0, 0, ELayersZ.aim);

        this.object3D.add(this.aimMesh, this.shootPowerMesh);
        this.shootPowerCanvas.width = 256;
        this.shootPowerCanvas.height = 256;
    }

    public hide(power: boolean, aim?: boolean) {
        if (power) {
            this.shootPowerMesh.visible = false;
        }
        if (aim) {
            this.aimMesh.visible = false;
        }
    }

    public update(wormDirection: 1 | -1) {
        const r = ESizes.worm * 5;
        const angle = this.getAngle(wormDirection);
        const rad = angle * (Math.PI / 180);
        const x = Math.cos(rad) * r;
        const y = Math.sin(rad) * r;
        this.aimMesh.position.set(x, y, ELayersZ.aim);

        this.shootPowerMesh.rotation.z = rad;
        this.aimMesh.rotation.z = rad;
        this.shootPowerMesh.scale.set(ESizes.worm * 2 + r * 1.5, ESizes.worm * 2 + r * 1.5, 1);
        this.drawShootPower(this.power);
    }

    public getRawAngle() {
        return this.angle;
    }

    private getPower() {
        const power = this.power;
        this.power = 0;
        this.deltaPower = 0.1;
        return power;
    }

    private drawShootPower(shootPower: number) {
        const ctx = this.shootPowerCtx;
        if (ctx) {
            if (shootPower) {
                for (let i = 0; i < shootPower; i += 5) {
                    let green = 255;
                    let red = 0;
                    if (i < 50) {
                        red += 255 * (i / 50);
                    } else {
                        red = 255;
                        green -= 255 * ((i - 50) / 50);
                    }
                    ctx.fillStyle = `rgb(${red},${green},0)`;
                    const radius = 128 * (i * 0.0015);
                    ctx.beginPath();
                    ctx.arc(128 + (128 * (i / 100) - radius), 128, radius, 0, Math.PI * 2);
                    ctx.fill();
                }
            } else {
                ctx.clearRect(0, 0, 256, 256);
            }
        }

        if (this.shootPowerMesh.material instanceof MeshBasicMaterial) {
            const texture = this.shootPowerMesh.material.map;
            if (texture) {
                texture.needsUpdate = true;
            }
        }
    }

    public getAngle(wormDirection: 1 | -1) {
        return wormDirection === 1 ? this.angle : 180 - this.angle;
    }

    public changeAngle(direction: 1 | -1 | 0, speed: number) {
        const delta = speed * direction;
        this.angle += delta;
        if (this.angle > 90) this.angle = 90;
        if (this.angle < -45) this.angle = -45;
    }

    public getShootDirection(wormDirection: 1 | -1) {
        return {
            power: this.getPower(),
            angle: this.getAngle(wormDirection),
        };
    }

    public changePower() {
        // y = x**2
        this.deltaPower += 0.25;
        this.power = this.deltaPower ** 2;
        if (this.power > 100) this.power = 100;
    }

    public setAim(angle: number, power: number) {
        this.angle = angle;
        this.power = power;
    }

    public getRawData() {
        return { angle: this.angle, power: this.power };
    }

    public getObject3D() {
        return this.object3D;
    }
}
