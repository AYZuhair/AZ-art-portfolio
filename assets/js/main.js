// Import utilities

// Main initialization
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeGallery();
    initializeContactForm();
    handleScrollEffects();
    initializeScrollArrow();
    initializeThemeToggle();
});

function updateThemeIcon(theme) {
    const icon = document.querySelector('.theme-toggle i');
    icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}

function initializeThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const htmlElement = document.documentElement;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);
    document.body.classList.toggle('light-theme', savedTheme === 'light');
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        document.body.classList.toggle('light-theme', newTheme === 'light');
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

// Scroll arrow functionality
function initializeScrollArrow() {
    const scrollArrow = document.getElementById('gallery-scroll');
    if (scrollArrow) {
        scrollArrow.addEventListener('click', () => {
            document.getElementById('gallery').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    }
}

// // Navigation functionality
// function initializeNavigation() {
//     const navbar = document.querySelector('.navbar');
//     const navLinks = document.querySelectorAll('.nav-links a');
//     const themeToggle = document.querySelector('.theme-toggle');

//     // Smooth scrolling
//     navLinks.forEach(link => {
//         link.addEventListener('click', (e) => {
//             e.preventDefault();
//             const targetId = link.getAttribute('href');
//             const targetSection = document.querySelector(targetId);
//             targetSection.scrollIntoView({ behavior: 'smooth' });
//         });
//     });

//     // Navbar scroll effect
//     window.addEventListener('scroll', debounce(() => {
//         if (window.scrollY > 50) {
//             navbar.classList.add('scrolled');
//         } else {
//             navbar.classList.remove('scrolled');
//         }
//     }, 10));

//     // Theme toggle
//     themeToggle.addEventListener('click', () => {
//         document.body.classList.toggle('light-theme');
//         const icon = themeToggle.querySelector('i');
//         icon.classList.toggle('fa-moon');
//         icon.classList.toggle('fa-sun');
        
//         // Save theme preference
//         const isDark = document.body.classList.contains('light-theme');
//         localStorage.setItem('theme', isDark ? 'light' : 'dark');
//     });
// }

// Image modal functionality
function createImageModal(imageSrc) {
    // Remove any existing modals
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) {
        existingModal.remove();
    }

    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    
    // Create modal content
    modal.innerHTML = `
        <div class="modal-content">
            <img src="${imageSrc}" alt="Enlarged artwork" class="modal-image">
            <div class="modal-controls">
                <button class="download-btn">
                    <i class="fas fa-download"></i>
                    Download
                </button>
                <button class="close-modal-btn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Trigger animation
    requestAnimationFrame(() => {
        modal.classList.add('active');
    });

    // Setup download functionality
    const downloadBtn = modal.querySelector('.download-btn');
    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.href = imageSrc;
        link.download = imageSrc.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // Setup close functionality
    const closeModal = () => {
        modal.classList.remove('active');
        setTimeout(() => {
            document.body.removeChild(modal);
            document.body.style.overflow = '';
        }, 300);
    };

    modal.querySelector('.close-modal-btn').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Prevent scroll when modal is open
    document.body.style.overflow = 'hidden';
}

// Three.js initialization and setup
function initializeThreeJS() {
    const modelContainer = document.getElementById('model-container');
    if (!modelContainer) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75,
        modelContainer.clientWidth / modelContainer.clientHeight,
        0.1,
        1000
    );
    const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true 
    });

    renderer.setSize(modelContainer.clientWidth, modelContainer.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    modelContainer.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Camera position
    camera.position.z = 5;

    // Model loading
    const loader = new THREE.GLTFLoader();
    let model;

    loader.load(
        'assets/models/your3dmodel.glb',
        (gltf) => {
            model = gltf.scene;
            scene.add(model);
            
            // Center model
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center);
        },
        (progress) => {
            console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
        },
        (error) => {
            console.error('Error loading model:', error);
        }
    );

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        if (model) {
            model.rotation.y += 0.005;
        }
        
        renderer.render(scene, camera);
    }
    animate();

    // Handle window resize
    window.addEventListener('resize', debounce(() => {
        camera.aspect = modelContainer.clientWidth / modelContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(modelContainer.clientWidth, modelContainer.clientHeight);
    }, 100));
}

// Animation initialization
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    document.querySelectorAll('.fade-in, .slide-up, .slide-in').forEach(element => {
        observer.observe(element);
    });
}

// // Gallery initialization
// async function initializeGallery() {
//     const galleryGrid = document.querySelector('.gallery-grid');
//     if (!galleryGrid) return;

//     const artworks = [
//         'assets/images/artwork1.jpg',
//         'assets/images/artwork2.jpg',
//         'assets/images/artwork3.jpg',
//         'assets/images/artwork4.jpg',
//         'assets/images/artwork5.jpg',
//         'assets/images/artwork6.jpg'
//     ];

//     await createImageGrid(artworks, galleryGrid);

//     // Add click handlers for modal view
//     galleryGrid.querySelectorAll('.art-card').forEach(card => {
//         card.addEventListener('click', () => {
//             openModal(card.querySelector('img').src);
//         });
//     });
// }

// Gallery initialization
function initializeGallery() {
    const gallery = document.querySelector('.gallery-grid');
    if (!gallery) return;

    gallery.addEventListener('click', (e) => {
        const artCard = e.target.closest('.art-card');
        if (artCard) {
            const img = artCard.querySelector('img');
            if (img) {
                createImageModal(img.src);
            }
        }
    });
}

function initializeNavigation() {
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
}

// Modal functionality
function openModal(imageSrc) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <img src="${imageSrc}" alt="Enlarged artwork">
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    modal.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
        document.body.style.overflow = '';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
            document.body.style.overflow = '';
        }
    });
}

// Contact form handling
function initializeContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            // Replace with your actual API endpoint
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                showNotification('Message sent successfully!', 'success');
                form.reset();
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            showNotification('Failed to send message. Please try again.', 'error');
            console.error('Form submission error:', error);
        }
    });
}

// Scroll effects
function handleScrollEffects() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    window.addEventListener('scroll', () => {
        // Hide scroll indicator after scrolling
        if (window.scrollY > 100 && scrollIndicator) {
            scrollIndicator.style.opacity = '0';
        }

        // Parallax effects for hero section
        const hero = document.querySelector('.hero');
        if (hero) {
            const scroll = window.pageYOffset;
            hero.style.backgroundPositionY = `${scroll * 0.5}px`;
        }
    });
}

// Utility function for notifications
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Initialize on load
window.addEventListener('load', () => {
    // Apply saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        document.querySelector('.theme-toggle i').classList.replace('fa-moon', 'fa-sun');
    }
});

function showImageModal(imageSrc) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    
    // Create modal content
    modal.innerHTML = `
        <div class="modal-content">
            <img src="${imageSrc}" alt="Enlarged artwork" class="modal-image">
            <div class="modal-controls">
                <button class="download-btn">
                    <i class="fas fa-download"></i>
                    Download
                </button>
                <button class="close-modal-btn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Trigger animation
    requestAnimationFrame(() => {
        modal.classList.add('active');
    });

    // Setup download functionality
    const downloadBtn = modal.querySelector('.download-btn');
    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.href = imageSrc;
        link.download = imageSrc.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // Setup close functionality
    const closeModal = () => {
        modal.classList.remove('active');
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    };

    modal.querySelector('.close-modal-btn').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Prevent scroll when modal is open
    document.body.style.overflow = 'hidden';
    modal.addEventListener('closed', () => {
        document.body.style.overflow = '';
    });
}
window.addEventListener('load', () => {
    // Apply saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.body.classList.toggle('light-theme', savedTheme === 'light');
    updateThemeIcon(savedTheme);
});