import { Mesh, MeshBasicMaterial, Object3D, PlaneBufferGeometry } from 'three';
import { ELayersZ, EProportions, ESizes, EWorldSizes } from '../../../../../ts/enums';
import { TLoopCallback } from '../../../../../ts/types';

export default class Water {
    private object3D: Object3D;
    private width: number;
    private height: number;
    private level = 0;

    private uniforms = {
        time: {
            value: 0,
        },
    };
    constructor(size: number) {
        const width = size * EProportions.mapWidthToHeight * 4;
        const height = size;

        this.width = width;
        this.height = height;

        const geometry = new PlaneBufferGeometry(width, height, 100);
        const material = new MeshBasicMaterial({
            color: 0x6cb7bd,
            opacity: 0.5,
            transparent: true,
        });

        material.onBeforeCompile = (shader) => {
            shader.uniforms.uTime = this.uniforms.time;
            shader.vertexShader =
                `uniform float uTime;
            ` + shader.vertexShader;
            shader.vertexShader = shader.vertexShader.replace(
                '#include <project_vertex>',
                `
                transformed.y += sin(transformed.x*10.0 + uTime*5.0)*5.0;
                #include <project_vertex>
                `
            );
        };

        this.object3D = new Mesh(geometry, material);
        this.object3D.position.x = size;
        this.object3D.position.y = -this.height / 2 + this.level;
        this.object3D.position.y = 0;
        this.object3D.position.z = ELayersZ.water;
    }

    public raiseLevel() {
        this.level += 10;
        this.object3D.position.y = -this.height / 2 + this.level;
    }

    public getLevel() {
        return this.level;
    }

    public getObject3D() {
        return this.object3D;
    }

    public update: TLoopCallback = (time) => {
        this.uniforms.time.value = time;
    };
}
