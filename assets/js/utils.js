// utils.js
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

export const loadImage = (src) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
};

export const createImageGrid = async (images, container) => {
    const fragment = document.createDocumentFragment();
    
    for (const [index, src] of images.entries()) {
        const card = document.createElement('div');
        card.className = 'art-card';
        card.setAttribute('data-aos', 'fade-up');
        
        const img = await loadImage(src);
        img.alt = `Artwork ${index + 1}`;
        
        const info = document.createElement('div');
        info.className = 'art-info';
        info.innerHTML = `
            <h3>Artwork ${index + 1}</h3>
            <p>Digital Art, 2024</p>
        `;
        
        card.appendChild(img);
        card.appendChild(info);
        fragment.appendChild(card);
    }
    
    container.appendChild(fragment);
};

export const initializeParallax = () => {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    window.addEventListener('scroll', debounce(() => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.parallax;
            const yPos = -(scrolled * speed);
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    }, 10));
};