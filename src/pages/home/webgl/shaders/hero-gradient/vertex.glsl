varying vec3 vDirection;

void main() {
    // The sphere is centred on the camera and never rotated, so its local
    // position is already the view direction through this fragment.
    vDirection = position;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
