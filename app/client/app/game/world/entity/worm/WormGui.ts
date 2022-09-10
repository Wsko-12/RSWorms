import { Group, Mesh, MeshBasicMaterial, Object3D, PlaneBufferGeometry, Texture } from 'three';
import { ELayersZ, ESizes, ETeamColors } from '../../../../../../ts/enums';
import MultiplayerGameplayManager from '../../../gameplayManager/MultiplayerGameplayManager';

export default class WormGui {
    private object3D: Object3D;
    private canvas = document.createElement('canvas');
    private ctx = this.canvas.getContext('2d');

    private damage: {
        canvas: HTMLCanvasElement;
        ctx: CanvasRenderingContext2D;
        texture: Texture;
        mesh: Mesh;
        yShift: number;
        maxShift: number;
        shows: boolean;
    };

    private texture = new Texture(this.canvas);
    private wormName: string;
    private teamIndex: number;
    private size: number;
    private canvasSize: number;

    private hp: {
        actual: number;
        prev: number;
    };
    constructor(wormName: string, teamIndex: number, hp: number) {
        this.texture.needsUpdate = true;
        this.object3D = new Group();

        this.wormName = wormName;
        this.teamIndex = teamIndex;
        this.hp = {
            actual: hp,
            prev: hp,
        };

        const size = ESizes.worm * 3;
        const canvasSize = size * 5;
        this.size = size;
        this.canvasSize = canvasSize;
        this.canvas.width = canvasSize;
        this.canvas.height = canvasSize;

        const geometry = new PlaneBufferGeometry(size, size);
        const material = new MeshBasicMaterial({
            map: this.texture,
            alphaTest: 0.5,
        });

        const mesh = new Mesh(geometry, material);
        mesh.position.y = size - size / 4;
        mesh.position.z = ELayersZ.worms + 10;

        const damageCanvas = document.createElement('canvas');
        const damageCtx = damageCanvas.getContext('2d');
        if (!damageCtx) {
            throw new Error(`[WormGui] can't get damageCtx`);
        }

        const damageTexture = new Texture(damageCanvas);
        damageTexture.needsUpdate = true;

        const damageMesh = new Mesh(
            geometry,
            new MeshBasicMaterial({
                map: damageTexture,
                alphaTest: 0.5,
            })
        );

        damageCanvas.width = canvasSize;
        damageCanvas.height = canvasSize;
        this.damage = {
            canvas: damageCanvas,
            ctx: damageCtx,
            texture: damageTexture,
            mesh: damageMesh,
            yShift: 0,
            maxShift: 50,
            shows: false,
        };

        this.object3D.add(mesh, damageMesh);
        setTimeout(() => {
            this.draw();
        }, 500);
    }

    public show(flag: boolean) {
        this.object3D.visible = flag;
    }

    public setActualHp(value: number) {
        this.showDamage(true, value - this.hp.actual);

        this.hp.actual = value;
        if (this.hp.actual === this.hp.prev) {
            this.showDamage(false);
        }
    }

    private moveDamageMesh() {
        this.damage.yShift++;
        if (this.damage.yShift < this.damage.maxShift) {
            this.damage.mesh.position.y += 1;
        }
    }

    public isUpdated(hp: number) {
        return hp === this.hp.prev;
    }

    public isDead() {
        return this.hp.prev === 0;
    }

    private showDamage(flag: boolean, value?: number) {
        if (!this.damage.shows) {
            this.damage.mesh.position.y = this.size;
            this.damage.mesh.position.z = ELayersZ.worms + 15;
            this.damage.mesh.visible = true;
        }

        this.damage.shows = true;

        if (!flag) {
            this.damage.mesh.visible = false;
            this.damage.yShift = 0;
            this.damage.shows = false;
        }

        if (value) {
            const { ctx } = this.damage;
            ctx.textAlign = 'center';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 10;
            ctx.font = `${this.canvasSize / 5}px DynaPuff`;

            ctx.fillStyle = value > 0 ? '#5eff45' : '#ff4545';

            const text = value > 0 ? '+' + value : value + '';
            ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);
            ctx.strokeText(text, this.canvasSize / 2, this.canvasSize / 2 + this.canvasSize / 5, this.canvasSize);
            ctx.fillText(text, this.canvasSize / 2, this.canvasSize / 2 + this.canvasSize / 5, this.canvasSize);
            this.damage.texture.needsUpdate = true;
        }
    }

    private draw() {
        if (!this.ctx) {
            return;
        }
        this.ctx.textAlign = 'center';
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 10;
        this.ctx.font = `${this.canvasSize / 5}px DynaPuff`;
        this.ctx?.clearRect(0, 0, this.canvasSize, this.canvasSize);
        this.drawHp();
        this.drawName();
        this.moveDamageMesh();
        this.texture.needsUpdate = true;
    }

    private drawHp() {
        const { ctx } = this;
        if (!ctx) {
            return;
        }
        const hp = this.hp.prev;

        const r = 255;
        const g = (hp / 50) * 255;
        const b = ((hp - 50) / 50) * 255;
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;

        ctx.strokeText(hp.toString(), this.canvasSize / 2, this.canvasSize / 2 + this.canvasSize / 5, this.canvasSize);

        ctx.fillText(hp.toString(), this.canvasSize / 2, this.canvasSize / 2 + this.canvasSize / 5, this.canvasSize);
    }

    private drawName() {
        const { ctx } = this;
        if (!ctx) {
            return;
        }
        ctx.fillStyle = ETeamColors[this.teamIndex];

        const text = MultiplayerGameplayManager.isOnline
            ? this.wormName.substring(0, this.wormName.length - 1)
            : this.wormName;

        ctx.strokeText(text, this.canvasSize / 2, this.canvasSize / 2, this.canvasSize);

        ctx.fillText(text, this.canvasSize / 2, this.canvasSize / 2, this.canvasSize);
    }

    public getObject3D() {
        return this.object3D;
    }

    public spriteLoop = () => {
        const { actual, prev } = this.hp;
        if (actual != prev) {
            this.hp.prev += actual > prev ? 1 : -1;
            this.draw();
        } else {
            this.showDamage(false);
        }
    };
}
