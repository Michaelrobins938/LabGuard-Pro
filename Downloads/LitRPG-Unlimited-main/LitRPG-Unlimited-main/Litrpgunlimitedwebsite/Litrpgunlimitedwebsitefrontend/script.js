document.addEventListener('DOMContentLoaded', () => {
    const startCreationButton = document.getElementById('startCreation');
    const characterCreationSection = document.getElementById('characterCreation');
    const steps = document.querySelectorAll('.step');
    let currentStep = 0;

    // 3D viewer setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 2 / 500, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth / 2, 500);
    document.getElementById('3d-viewer').appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5).normalize();
    scene.add(light);

    let loader = new THREE.GLTFLoader();
    let currentModel;

    function loadModel(url) {
        if (currentModel) {
            scene.remove(currentModel);
        }
        loader.load(url, (gltf) => {
            currentModel = gltf.scene;
            scene.add(currentModel);
        });
    }

    function updateModelAppearance(features) {
        if (currentModel) {
            currentModel.traverse((child) => {
                if (child.isMesh) {
                    // Update material properties based on features
                    child.material.color.set(features.color || 0xffffff);
                    child.material.wireframe = features.wireframe || false;
                }
            });
        }
    }

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        if (currentModel) {
            currentModel.rotation.x += 0.01;
            currentModel.rotation.y += 0.01;
        }
        renderer.render(scene, camera);
    }
    animate();

    // Event listeners
    startCreationButton.addEventListener('click', () => {
        characterCreationSection.style.display = 'flex';
        steps[currentStep].style.display = 'block';
    });

    document.querySelectorAll('.nextButton').forEach(button => {
        button.addEventListener('click', () => {
            steps[currentStep].style.display = 'none';
            currentStep = Math.min(steps.length - 1, currentStep + 1);
            steps[currentStep].style.display = 'block';
        });
    });

    document.querySelectorAll('.prevButton').forEach(button => {
        button.addEventListener('click', () => {
            steps[currentStep].style.display = 'none';
            currentStep = Math.max(0, currentStep - 1);
            steps[currentStep].style.display = 'block';
        });
    });

    document.getElementById('characterForm').addEventListener('submit', (e) => {
        e.preventDefault();
        // Handle form submission
        alert('Character Created!');
    });

    // Synchronize 3D viewer with form inputs
    document.querySelectorAll('input[name="race"]').forEach(input => {
        input.addEventListener('change', () => {
            const race = input.value.toLowerCase();
            loadModel(`/models/${race}.glb`);
        });
    });

    document.querySelectorAll('input[name="class"]').forEach(input => {
        input.addEventListener('change', () => {
            const charClass = input.value.toLowerCase();
            console.log(`Selected class: ${charClass}`);
        });
    });

    document.querySelectorAll('select[name="facialFeatures"], select[name="hairStyle"], input[name="hairColor"], input[name="eyeColor"], select[name="bodyType"], select[name="clothingStyle"]').forEach(select => {
        select.addEventListener('change', () => {
            const features = {
                color: document.getElementById('hairColor').value,
                wireframe: select.value === 'tattooed' // Example logic
            };
            updateModelAppearance(features);
        });
    });
});
