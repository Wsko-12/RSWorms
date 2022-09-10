import ThrowableBullet from '../Throwable';

export default abstract class FlightBullet extends ThrowableBullet {
    public updateObjectRotation() {
        const direction = this.physics.velocity.x > 0 ? -1 : 1;
        this.object3D.rotation.z += direction * Math.PI * (this.physics.velocity.getLength() * 0.01);
    }
}
