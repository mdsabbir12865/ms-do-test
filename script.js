document.addEventListener('DOMContentLoaded', () => {
    // --- BASIC UI ELEMENTS ---
    const header = document.querySelector('.header');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    menuBtn.addEventListener('click', () => {
        if (navLinks.style.display === 'flex') {
            navLinks.style.display = 'none';
        } else {
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = '#fffaf5';
            navLinks.style.padding = '2rem';
            navLinks.style.boxShadow = '0 10px 10px rgba(0,0,0,0.05)';
        }
    });

    // --- PRODUCT FILTERING ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const products = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            products.forEach(product => {
                const category = product.getAttribute('data-category');
                if (filter === 'all' || filter === category) {
                    product.style.display = 'block';
                    setTimeout(() => product.style.opacity = '1', 10);
                } else {
                    product.style.opacity = '0';
                    setTimeout(() => product.style.display = 'none', 300);
                }
            });
        });
    });

    // --- CART & ORDER SYSTEM ---
    const cartToggle = document.querySelector('.cart-toggle');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartClose = document.querySelector('.cart-close');
    const overlay = document.querySelector('.overlay');
    const cartCount = document.querySelector('.cart-count');
    const cartItemsContainer = document.querySelector('.cart-items');
    const totalAmountSpan = document.querySelector('.total-amount');

    const cartView = document.querySelector('.cart-view');
    const checkoutView = document.querySelector('.checkout-view');
    const successView = document.querySelector('.success-view');

    const checkoutInitBtn = document.querySelector('.checkout-init-btn');
    const backToCartBtn = document.querySelector('.back-to-cart');
    const checkoutForm = document.getElementById('checkout-form');
    const closeAfterSuccessBtn = document.querySelector('.close-after-success');
    const orderIdDisplay = document.getElementById('order-id-display');
    
    let cart = [];

    const switchView = (viewName) => {
        [cartView, checkoutView, successView].forEach(view => view.classList.remove('active'));
        if(viewName === 'cart') cartView.classList.add('active');
        if(viewName === 'checkout') checkoutView.classList.add('active');
        if(viewName === 'success') successView.classList.add('active');
    };

    const toggleCart = () => {
        cartSidebar.classList.toggle('open');
        overlay.classList.toggle('active');
        if(!cartSidebar.classList.contains('open')) {
             setTimeout(() => switchView('cart'), 400);
        }
    };

    cartToggle.addEventListener('click', toggleCart);
    cartClose.addEventListener('click', toggleCart);
    overlay.addEventListener('click', toggleCart);

    checkoutInitBtn.addEventListener('click', () => {
        if(cart.length > 0) switchView('checkout');
    });

    backToCartBtn.addEventListener('click', () => switchView('cart'));

    closeAfterSuccessBtn.addEventListener('click', () => {
        toggleCart();
        cart = [];
        updateCartUI();
    });

    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const orderId = Math.floor(1000 + Math.random() * 9000);
        orderIdDisplay.textContent = orderId;
        switchView('success');
    });

    const updateCartUI = () => {
        const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-msg">Your basket is empty.</p>';
            totalAmountSpan.textContent = '$0.00';
            checkoutInitBtn.style.display = 'none';
            return;
        }

        checkoutInitBtn.style.display = 'block';
        let totalValue = 0;

        cart.forEach((item, index) => {
            totalValue += item.price * item.quantity;
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="item-price">$${item.price.toFixed(2)} x ${item.quantity}</p>
                    <button class="cart-item-remove" data-index="${index}">Remove</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        totalAmountSpan.textContent = `$${totalValue.toFixed(2)}`;

        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.dataset.index);
                cart.splice(idx, 1);
                updateCartUI();
            });
        });
    };

    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.product-card');
            const name = card.querySelector('h3').textContent;
            const priceStr = card.querySelector('.price').textContent;
            const price = parseFloat(priceStr.replace('$', ''));
            const image = card.querySelector('img').src;

            const existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ name, price, image, quantity: 1 });
            }

            updateCartUI();
            
            const originalIcon = btn.innerHTML;
            btn.innerHTML = '✓';
            setTimeout(() => btn.innerHTML = originalIcon, 1000);
        });
    });

    // --- MAIN CONTACT FORM HANDLER ---
    const contactForm = document.getElementById('contact-form-element');
    const contactSuccessMsg = document.getElementById('contact-success-msg');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            contactForm.style.display = 'none';
            contactSuccessMsg.style.display = 'block';
            
            // Optional: reset after some time
            setTimeout(() => {
                contactForm.reset();
                contactForm.style.display = 'flex';
                contactSuccessMsg.style.display = 'none';
            }, 5000);
        });
    }

    // --- SMOOTH SCROLL ---
    document.querySelectorAll('.nav-link, .footer-links a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const id = link.getAttribute('href');
            if(id.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(id);
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // --- ANIMATIONS ---
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.product-card, .about-content, .hero-content, .info-card, .contact-form-panel');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });

    updateCartUI();
});