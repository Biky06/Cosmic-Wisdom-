// Main JavaScript File for Cosmic Wisdom Astrology Website

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initMobileMenu();
    initSmoothScrolling();
    initScrollAnimation();
    initServiceBooking();
    initCourseWishlist();
    initProductFiltering();
    initCartFunctionality();
    initModalWindows();
    initAuthModal();
    initContactForm();
    initNewsletterForm();
    initPaymentMethods();
    initFileUpload();
    initTestimonialSlider();
    initProductModal();
    initStarBackground();
});

// Mobile Menu Toggle
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
        
        // Close menu when clicking on a nav link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }
}

// Smooth Scrolling for Anchor Links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll Animation for Elements
function initScrollAnimation() {
    const animateElements = document.querySelectorAll('.fade-in, .slide-up');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// Service Booking Functionality
function initServiceBooking() {
    const bookButtons = document.querySelectorAll('.book-btn');
    
    bookButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const serviceName = this.getAttribute('data-service');
            const servicePrice = this.getAttribute('data-price');
            
            // Set modal content
            document.getElementById('modal-service-name').textContent = serviceName;
            document.getElementById('modal-service-price').textContent = servicePrice;
            document.getElementById('final-price').textContent = servicePrice;
            document.getElementById('esewa-amount').textContent = servicePrice;
            document.getElementById('bank-amount').textContent = servicePrice;
            document.getElementById('phonepay-amount').textContent = servicePrice;
            
            // Show modal
            document.getElementById('payment-modal').style.display = 'block';
            document.body.classList.add('no-scroll');
        });
    });
}

// Course Wishlist Functionality
function initCourseWishlist() {
    const wishlistButtons = document.querySelectorAll('.wishlist-btn');
    
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            this.classList.toggle('active');
            this.innerHTML = this.classList.contains('active') ? 
                '<i class="fas fa-heart"></i>' : 
                '<i class="far fa-heart"></i>';
            
            // Show notification
            showNotification(
                this.classList.contains('active') ? 
                'Course added to wishlist' : 
                'Course removed from wishlist'
            );
        });
    });
}

// Product Filtering by Category
function initProductFiltering() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            
            // Filter products
            productCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Shopping Cart Functionality
function initCartFunctionality() {
    const cart = {
        items: [],
        total: 0,
        count: 0
    };
    
    // Cart toggle
    const cartBtn = document.querySelector('.cart-btn');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartClose = document.querySelector('.cart-close');
    
    if (cartBtn && cartSidebar) {
        cartBtn.addEventListener('click', function() {
            cartSidebar.classList.add('active');
            document.body.classList.add('no-scroll');
        });
        
        cartClose.addEventListener('click', function() {
            cartSidebar.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    }
    
    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart, .add-to-cart-lg');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card, .modal-container');
            const productId = productCard.querySelector('.quick-view-btn')?.getAttribute('data-id') || Math.random().toString(36).substr(2, 9);
            const productName = productCard.querySelector('.product-title, .modal-title').textContent;
            const productPrice = parseFloat(productCard.querySelector('.product-price, .modal-price').textContent.replace(/[^0-9.]/g, ''));
            const productImage = productCard.querySelector('.product-image img, .main-image img').src;
            
            // Check if product already exists in cart
            const existingItem = cart.items.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.items.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                });
            }
            
            // Update cart
            updateCart(cart);
            
            // Show notification
            showNotification(`${productName} added to cart`);
            
            // Close modal if adding from quick view
            if (this.classList.contains('add-to-cart-lg')) {
                document.getElementById('product-modal').style.display = 'none';
                document.body.classList.remove('no-scroll');
            }
        });
    });
    
    // Update cart UI
    function updateCart(cartData) {
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartTotalElement = document.querySelector('.cart-total span:last-child');
        const cartCountElement = document.querySelector('.cart-count');
        
        // Calculate total and count
        cartData.total = cartData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartData.count = cartData.items.reduce((count, item) => count + item.quantity, 0);
        
        // Update cart count
        if (cartCountElement) {
            cartCountElement.textContent = cartData.count;
            cartCountElement.style.display = cartData.count > 0 ? 'flex' : 'none';
        }
        
        // Update cart items
        if (cartItemsContainer) {
            if (cartData.items.length === 0) {
                cartItemsContainer.innerHTML = `
                    <div class="empty-cart">
                        <i class="fas fa-shopping-cart"></i>
                        <h4>Your cart is empty</h4>
                        <p>Start shopping to add items to your cart</p>
                        <a href="#shop" class="btn btn-primary">Browse Products</a>
                    </div>
                `;
            } else {
                cartItemsContainer.innerHTML = cartData.items.map(item => `
                    <div class="cart-item" data-id="${item.id}">
                        <div class="item-image">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        <div class="item-details">
                            <h4>${item.name}</h4>
                            <div class="item-price">Rs. ${item.price.toLocaleString()}</div>
                            <div class="item-quantity">
                                <button class="quantity-btn minus">-</button>
                                <span>${item.quantity}</span>
                                <button class="quantity-btn plus">+</button>
                            </div>
                        </div>
                        <button class="item-remove">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `).join('');
                
                // Add event listeners to quantity buttons
                document.querySelectorAll('.item-quantity .quantity-btn').forEach(button => {
                    button.addEventListener('click', function() {
                        const itemElement = this.closest('.cart-item');
                        const itemId = itemElement.getAttribute('data-id');
                        const item = cartData.items.find(i => i.id === itemId);
                        
                        if (this.classList.contains('minus')) {
                            if (item.quantity > 1) {
                                item.quantity -= 1;
                            } else {
                                // Remove item if quantity reaches 0
                                cartData.items = cartData.items.filter(i => i.id !== itemId);
                            }
                        } else if (this.classList.contains('plus')) {
                            item.quantity += 1;
                        }
                        
                        updateCart(cartData);
                    });
                });
                
                // Add event listeners to remove buttons
                document.querySelectorAll('.item-remove').forEach(button => {
                    button.addEventListener('click', function() {
                        const itemElement = this.closest('.cart-item');
                        const itemId = itemElement.getAttribute('data-id');
                        
                        cartData.items = cartData.items.filter(i => i.id !== itemId);
                        updateCart(cartData);
                        
                        // Show notification
                        showNotification('Item removed from cart');
                    });
                });
            }
        }
        
        // Update total
        if (cartTotalElement) {
            cartTotalElement.textContent = `Rs. ${cartData.total.toLocaleString()}`;
        }
    }
    
    // Checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.items.length === 0) {
                showNotification('Your cart is empty', 'error');
            } else {
                // In a real implementation, this would redirect to checkout
                showNotification('Proceeding to checkout', 'success');
                // Here you would typically redirect to a checkout page
                // window.location.href = '/checkout';
            }
        });
    }
}

// Modal Windows Functionality
function initModalWindows() {
    // Payment modal
    const paymentModal = document.getElementById('payment-modal');
    const closeModal = paymentModal.querySelector('.close');
    
    closeModal.addEventListener('click', function() {
        paymentModal.style.display = 'none';
        document.body.classList.remove('no-scroll');
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === paymentModal) {
            paymentModal.style.display = 'none';
            document.body.classList.remove('no-scroll');
        }
    });
    
    // Payment method switching
    const paymentMethods = document.querySelectorAll('.payment-method');
    
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            paymentMethods.forEach(m => m.classList.remove('active'));
            this.classList.add('active');
            
            const methodType = this.getAttribute('data-method');
            
            // Hide all payment forms
            document.querySelectorAll('.payment-form').forEach(form => {
                form.style.display = 'none';
            });
            
            // Show selected payment form
            document.getElementById(`${methodType}-payment`).style.display = 'block';
        });
    });
    
    // Product quick view modal
    const quickViewButtons = document.querySelectorAll('.quick-view-btn');
    const productModal = document.getElementById('product-modal');
    const productModalClose = productModal.querySelector('.modal-close');
    
    quickViewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            
            // Set modal content
            productModal.querySelector('.modal-title').textContent = productCard.querySelector('.product-title').textContent;
            productModal.querySelector('.modal-price').innerHTML = productCard.querySelector('.product-price').innerHTML;
            productModal.querySelector('.modal-category').textContent = productCard.querySelector('.product-category').textContent;
            productModal.querySelector('.modal-rating .stars').innerHTML = productCard.querySelector('.product-rating .stars').innerHTML;
            productModal.querySelector('.rating-count').textContent = productCard.querySelector('.rating-count').textContent;
            
            // Set main image
            const mainImage = productModal.querySelector('#modal-main-image');
            mainImage.src = productCard.querySelector('.product-image img').src;
            mainImage.alt = productCard.querySelector('.product-title').textContent;
            
            // Show modal
            productModal.style.display = 'block';
            document.body.classList.add('no-scroll');
        });
    });
    
    productModalClose.addEventListener('click', function() {
        productModal.style.display = 'none';
        document.body.classList.remove('no-scroll');
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === productModal) {
            productModal.style.display = 'none';
            document.body.classList.remove('no-scroll');
        }
    });
}

// Authentication Modal Functionality
function initAuthModal() {
    const authModal = document.getElementById('auth-modal');
    const authClose = authModal.querySelector('.auth-close');
    const authTabs = authModal.querySelectorAll('.auth-tab');
    const authForms = authModal.querySelectorAll('.auth-form');
    const switchTabs = authModal.querySelectorAll('.switch-tab');
    
    // User buttons to open modal
    const userButtons = document.querySelectorAll('.user-btn:not(.search-btn):not(.cart-btn)');
    
    userButtons.forEach(button => {
        button.addEventListener('click', function() {
            authModal.style.display = 'flex';
            document.body.classList.add('no-scroll');
        });
    });
    
    // Close modal
    authClose.addEventListener('click', function() {
        authModal.style.display = 'none';
        document.body.classList.remove('no-scroll');
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === authModal) {
            authModal.style.display = 'none';
            document.body.classList.remove('no-scroll');
        }
    });
    
    // Switch between login and signup tabs
    authTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Update active tab
            authTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding form
            authForms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${tabName}-form`) {
                    form.classList.add('active');
                }
            });
        });
    });
    
    // Switch tabs from links
    switchTabs.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tabName = this.getAttribute('data-tab');
            
            // Update active tab
            authTabs.forEach(t => t.classList.remove('active'));
            authTabs.forEach(t => {
                if (t.getAttribute('data-tab') === tabName) {
                    t.classList.add('active');
                }
            });
            
            // Show corresponding form
            authForms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${tabName}-form`) {
                    form.classList.add('active');
                }
            });
        });
    });
    
    // Form submission
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('#login-email').value;
            const password = this.querySelector('#login-password').value;
            
            // In a real implementation, this would validate and send to server
            showNotification('Login successful', 'success');
            authModal.style.display = 'none';
            document.body.classList.remove('no-scroll');
        });
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = this.querySelector('#signup-name').value;
            const email = this.querySelector('#signup-email').value;
            const password = this.querySelector('#signup-password').value;
            const confirm = this.querySelector('#signup-confirm').value;
            
            // Simple validation
            if (password !== confirm) {
                showNotification('Passwords do not match', 'error');
                return;
            }
            
            // In a real implementation, this would validate and send to server
            showNotification('Account created successfully', 'success');
            
            // Switch to login tab
            authTabs.forEach(t => t.classList.remove('active'));
            authTabs[0].classList.add('active');
            
            authForms.forEach(form => form.classList.remove('active'));
            authForms[0].classList.add('active');
        });
    }
}

// Contact Form Submission
function initContactForm() {
    const contactForm = document.getElementById('booking-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const formData = {
                name: this.querySelector('#name').value,
                email: this.querySelector('#email').value,
                phone: this.querySelector('#phone').value,
                service: this.querySelector('#service').value,
                birthdate: this.querySelector('#birthdate').value,
                message: this.querySelector('#message').value
            };
            
            // In a real implementation, this would send to server
            console.log('Form submitted:', formData);
            showNotification('Your consultation request has been submitted! We will contact you soon.', 'success');
            this.reset();
        });
    }
}

// Newsletter Form Submission
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // In a real implementation, this would send to server
            showNotification('Thank you for subscribing to our newsletter!', 'success');
            this.reset();
        });
    }
}

// Payment Methods Functionality
function initPaymentMethods() {
    // In a real implementation, this would integrate with payment gateways
    const submitPayment = document.getElementById('submit-payment');
    
    if (submitPayment) {
        submitPayment.addEventListener('click', function() {
            // Validate files were uploaded
            const uploadedFiles = document.getElementById('uploaded-files').children.length;
            
            if (uploadedFiles === 0) {
                showNotification('Please upload your birth details document', 'error');
                return;
            }
            
            // Process payment
            showNotification('Payment processed successfully! Your consultation has been scheduled.', 'success');
            
            // Close modal
            document.getElementById('payment-modal').style.display = 'none';
            document.body.classList.remove('no-scroll');
        });
    }
}

// File Upload Functionality
function initFileUpload() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const uploadedFilesContainer = document.getElementById('uploaded-files');
    
    if (uploadArea && fileInput) {
        // Click event
        uploadArea.addEventListener('click', function() {
            fileInput.click();
        });
        
        // Drag and drop events
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', function() {
            this.classList.remove('dragover');
        });
        
        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            
            if (e.dataTransfer.files.length) {
                handleFiles(e.dataTransfer.files);
            }
        });
        
        // File input change
        fileInput.addEventListener('change', function() {
            if (this.files.length) {
                handleFiles(this.files);
            }
        });
        
        // Handle uploaded files
        function handleFiles(files) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                
                // Check file type (in a real app, you'd validate this server-side)
                if (!file.type.match('image.*|application/pdf')) {
                    showNotification('Only images and PDFs are allowed', 'error');
                    continue;
                }
                
                // Check file size (5MB max)
                if (file.size > 5 * 1024 * 1024) {
                    showNotification('File size must be less than 5MB', 'error');
                    continue;
                }
                
                // Create preview
                const fileElement = document.createElement('div');
                fileElement.className = 'uploaded-file';
                
                // Add file info
                fileElement.innerHTML = `
                    <div class="file-info">
                        <i class="fas ${file.type.match('image.*') ? 'fa-image' : 'fa-file-pdf'}"></i>
                        <span>${file.name}</span>
                        <span>${formatFileSize(file.size)}</span>
                    </div>
                    <button class="file-remove">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                
                // Add remove button event
                fileElement.querySelector('.file-remove').addEventListener('click', function() {
                    fileElement.remove();
                });
                
                uploadedFilesContainer.appendChild(fileElement);
            }
        }
        
        // Format file size
        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }
    }
}

// Testimonial Slider
function initTestimonialSlider() {
    const testimonialGrid = document.querySelector('.testimonial-grid');
    
    if (testimonialGrid) {
        // In a real implementation, this would be a proper slider
        // For now, we'll just animate the testimonials
        let currentIndex = 0;
        const testimonials = testimonialGrid.querySelectorAll('.testimonial-card');
        
        function showTestimonial(index) {
            testimonials.forEach((testimonial, i) => {
                if (i === index) {
                    testimonial.style.display = 'block';
                } else {
                    testimonial.style.display = 'none';
                }
            });
        }
        
        // Initial display
        showTestimonial(currentIndex);
        
        // Auto-rotate testimonials
        setInterval(() => {
            currentIndex = (currentIndex + 1) % testimonials.length;
            showTestimonial(currentIndex);
        }, 5000);
    }
}

// Product Modal Gallery
function initProductModal() {
    const productModal = document.getElementById('product-modal');
    
    if (productModal) {
        const thumbnails = productModal.querySelectorAll('.thumbnail');
        const mainImage = productModal.querySelector('#modal-main-image');
        
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                // Update active thumbnail
                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Update main image
                const newImage = this.querySelector('img').src;
                mainImage.src = newImage;
            });
        });
        
        // Quantity selector
        const quantityInput = productModal.querySelector('.quantity-input');
        const minusBtn = productModal.querySelector('.quantity-btn.minus');
        const plusBtn = productModal.querySelector('.quantity-btn.plus');
        
        minusBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            if (value > 1) {
                quantityInput.value = value - 1;
            }
        });
        
        plusBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            quantityInput.value = value + 1;
        });
    }
}

// Star Background Animation
function initStarBackground() {
    const starsContainer = document.querySelector('.stars');
    
    if (starsContainer) {
        // Create additional stars
        for (let i = 0; i < 20; i++) {
            const star = document.createElement('span');
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.width = `${Math.random() * 3 + 1}px`;
            star.style.height = star.style.width;
            star.style.animationDelay = `${Math.random() * 5}s`;
            starsContainer.appendChild(star);
        }
    }
}

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        
        // Remove after animation
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add some basic styling for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
.notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 15px 25px;
    border-radius: 5px;
    color: white;
    background-color: #333;
    transform: translateY(100px);
    opacity: 0;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.notification.show {
    transform: translateY(0);
    opacity: 1;
}

.notification.success {
    background-color: #4CAF50;
}

.notification.error {
    background-color: #F44336;
}
`;
document.head.appendChild(notificationStyles);
