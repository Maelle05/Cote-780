import { Mesh, PlaneGeometry, MeshBasicMaterial, BoxGeometry, DoubleSide } from 'three';

class Plane extends Mesh {
    constructor(name, texture){
        super()

        this.name = name

        // TEXTURE
        this.texture = texture
        // Get the size of the texture
        this.textureSize = {
            width: texture.image.width,
            height: texture.image.height
        };
        // Get the aspect ratio of the texture
        this.aspectRatio = this.textureSize.width / this.textureSize.height;

        // GEOMETRY
        this.geometry = new PlaneGeometry(1, 1 / this.aspectRatio);

        // Create a MeshBasicMaterial with the texture
        this.material = new MeshBasicMaterial({ map: this.texture, color: 'white', side: DoubleSide });
        this.material.transparent = true
    }
    
    setScale(coef){
        this.scale.x = coef;
        this.scale.y = coef;
        this.scale.z = coef;
    }
}

export { Plane }