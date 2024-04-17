import { Mesh, PlaneGeometry, MeshBasicMaterial, DoubleSide } from 'three';

class Perso extends Mesh {
    constructor(texture){
        super()

        this.name = 'perso'

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
        this.material = new MeshBasicMaterial({ 
          map: this.texture,
          color: 'white',
          // side: DoubleSide,
          // depthWrite: false
        });
        this.material.transparent = true

        this.renderOrder = 4
    }
    
    setScale(coef){
        this.scale.x = coef;
        this.scale.y = coef;
        this.scale.z = coef;
    }
}

export { Perso }