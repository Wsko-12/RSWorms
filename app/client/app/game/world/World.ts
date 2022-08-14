import { BoxBufferGeometry, DirectionalLight, Mesh, MeshPhongMaterial, Scene } from 'three';

export default class World {
    private mainScene = new Scene();
    public createTestScene() {
        const box = new Mesh(new BoxBufferGeometry(1, 1, 1), new MeshPhongMaterial());
        const light = new DirectionalLight();
        light.position.set(5, 5, 5);
        this.mainScene.add(box, light);
    }
    public getMainScene() {
        return this.mainScene;
    }
}
