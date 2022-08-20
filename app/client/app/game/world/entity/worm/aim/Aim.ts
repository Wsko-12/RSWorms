import { Group, Mesh, MeshBasicMaterial, PlaneBufferGeometry, Texture } from 'three';
import { ELayersZ } from '../../../../../../../ts/enums';
import { IWormMoveStates } from '../../../../../../../ts/interfaces';
import Weapon from '../weapon/Weapon';

export default class Aim {
    private group = new Group();
    protected aimMesh: Mesh;
    private power = 0;
    private angle = 0;
    private deltaPower = 0.1;
    protected shootPowerMesh: Mesh;
    protected shootPowerCanvas = document.createElement('canvas');
    protected shootPowerCtx = this.shootPowerCanvas.getContext('2d');

    constructor() {
        this.aimMesh = new Mesh(new PlaneBufferGeometry(10, 10), new MeshBasicMaterial());
        const shootingPowerTexture = new Texture(this.shootPowerCanvas);
        this.shootPowerMesh = new Mesh(
            new PlaneBufferGeometry(1, 1),
            new MeshBasicMaterial({
                map: shootingPowerTexture,
                alphaTest: 0.5,
            })
        );

        this.shootPowerMesh.position.set(0, 0, ELayersZ.aim);

        this.group.add(this.aimMesh, this.shootPowerMesh);
        this.shootPowerCanvas.width = 256;
        this.shootPowerCanvas.height = 256;
        this.toggle(false);
    }

    public getObject3D() {
        return this.group;
    }

    public changeAngle(direction: number, speed: number) {
        const delta = speed * direction;
        this.angle += delta;
        if (this.angle > 90) this.angle = 90;
        if (this.angle < -45) this.angle = -45;
    }

    public update(wormStates: IWormMoveStates, weapon: Weapon | null, wormRadius: number, wormDirection: number) {
        if (!weapon) {
            this.toggle(false);
            return;
        }
        if (wormStates.isFall || wormStates.isSlide || wormStates.isJump || wormStates.isMove) {
            this.toggle(false);
            return;
        }

        this.aimMesh.visible = true;
        this.shootPowerMesh.visible = true;

        const r = weapon.aimRadius;
        const rad = this.getAngle(wormDirection) * (Math.PI / 180);
        const x = Math.cos(rad) * r;
        const y = Math.sin(rad) * r;
        this.shootPowerMesh.rotation.z = rad;
        this.aimMesh.position.set(x, y, ELayersZ.aim);
        this.shootPowerMesh.scale.set(wormRadius * 2 + r * 1.5, wormRadius * 2 + r * 1.5, 1);
        this.drawShootPower(this.power);
    }

    public drawShootPower(shootPower: number) {
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

    public changePower() {
        // y = x**2
        this.deltaPower += 0.25;
        this.power = this.deltaPower ** 2;
        if (this.power > 100) this.power = 100;
    }

    public toggle(flag: boolean) {
        this.aimMesh.visible = flag;
        this.shootPowerMesh.visible = flag;
    }

    public getShootData(wormDirection: number) {
        return {
            power: this.getPower(),
            angle: this.getAngle(wormDirection),
        };
    }

    private getPower() {
        const power = this.power;
        this.power = 0;
        this.deltaPower = 0.1;
        return power;
    }

    private getAngle(wormDirection: number) {
        return wormDirection === 1 ? this.angle : 180 - this.angle;
    }
}
