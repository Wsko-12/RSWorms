import { BufferGeometry, Float32BufferAttribute, Object3D, Points, PointsMaterial, Texture } from 'three';
import { ELayersZ, EProportions } from '../../../../../ts/enums';
import { TLoopCallback } from '../../../../../ts/types';
import AssetsManager from '../../assetsManager/AssetsManager';

export default class Wind {
    private direction = 0.1;
    private object3D: Object3D | null = null;
    private height = 0;
    private width = 0;
    private geometry = new BufferGeometry();

    public init(worldSize: number) {
        const worldWidth = worldSize * EProportions.mapWidthToHeight;
        const width = worldSize * EProportions.mapWidthToHeight * 4;
        const height = worldSize * 4;
        this.width = width;
        this.height = height;
        const zMin = ELayersZ.bg;
        const vertices = [];
        for (let i = 0; i < 200; i++) {
            const x = (Math.random() - 0.5) * width;
            const y = Math.random() * (height / 2);
            const z = -zMin + 0.5 + Math.random() * (zMin * 1.5);

            vertices.push(x, y, z);
        }

        this.geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
        const image = AssetsManager.getMapTexture('particle');
        if (!image) {
            throw new Error("[Wind init] can't load particle image");
        }
        const texture = new Texture(image);
        texture.needsUpdate = true;
        const material = new PointsMaterial({
            size: 40,
            map: texture,
            transparent: true,
            opacity: 0.4,
            alphaTest: 0.1,
        });

        this.object3D = new Points(this.geometry, material);
        this.object3D.position.set(worldWidth / 2, 0, 0);
    }

    public change() {
        this.direction = (Math.random() - 0.5) * 2;
    }
    public getCurrentValue() {
        return this.direction;
    }

    public getObject3D() {
        return this.object3D;
    }
    public update: TLoopCallback = (time) => {
        const ySpeed = 2.5;
        const xSpeed = 20;

        const positions = this.geometry.attributes.position;
        const count = positions.count;
        for (let i = 0; i < count; i++) {
            let x = positions.getX(i);
            let y = positions.getY(i);
            const z = positions.getZ(i);

            x += this.direction * xSpeed;
            y -= ySpeed;
            if (y < 0) {
                y = this.height / 2;
            }

            if (x < -this.width / 2 || x > this.width / 2) {
                x *= -1;
            }
            positions.setXYZ(i, x, y, z);
        }
        positions.needsUpdate = true;
    };
}
