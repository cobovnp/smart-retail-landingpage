document.addEventListener('DOMContentLoaded', () => {

    // ============================
    // Mobile Menu Toggle
    // ============================
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');

    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            const spans = mobileMenuBtn.querySelectorAll('span');
            if (mainNav.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close menu when link is clicked
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                const spans = mobileMenuBtn.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }

    // ============================
    // Header Scroll Effect
    // ============================
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ============================
    // Smooth Scroll for anchor links
    // ============================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================
    // Animated Counter
    // ============================
    const counters = document.querySelectorAll('.stat-number[data-count]');
    let countersStarted = false;

    function startCounters() {
        if (countersStarted) return;
        countersStarted = true;

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
        });
    }

    // Start counters when hero section is visible
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounters();
            }
        });
    }, { threshold: 0.3 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) heroObserver.observe(heroStats);

    // ============================
    // Scroll Reveal Animation
    // ============================
    const revealElements = document.querySelectorAll(
        '.feature-card, .product-card, .app-card, .process-step, .contact-item'
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        revealObserver.observe(el);
    });

    // ============================
    // Hero Particles
    // ============================
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.classList.add('hero-particle');
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 8 + 5) + 's';
            particle.style.animationDelay = (Math.random() * 5) + 's';
            particle.style.width = (Math.random() * 4 + 2) + 'px';
            particle.style.height = particle.style.width;
            particlesContainer.appendChild(particle);
        }
    }

    // ============================
    // Form Handler
    // ============================
    const landingForm = document.getElementById('landingForm');
    const formStatus = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');

    if (landingForm) {
        landingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const email = document.getElementById('email') ? document.getElementById('email').value.trim() : '';
            const product = document.getElementById('product').value;
            const quantity = document.getElementById('quantity') ? document.getElementById('quantity').value : '';
            const message = document.getElementById('message').value.trim();

            if (!name || !phone) {
                // Shake animation on button
                submitBtn.style.animation = 'shake 0.4s ease';
                setTimeout(() => { submitBtn.style.animation = ''; }, 400);
                return;
            }

            // Show loading state
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ĐANG GỬI...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';

            // Web3Forms API Call (Using JSON to fix Vietnamese characters encoding issue)
            const payload = {
                access_key: 'f0276997-d75f-4cef-b60c-3091d05a57c5',
                subject: 'Có khách hàng mới đăng ký nhận báo giá!',
                from_name: 'SmartRetail Website',
                'Họ và Tên': name,
                'Số điện thoại': phone,
                'Email': email || 'Không có',
                'Kích thước màn hình': product + ' Inch',
                'Số lượng': quantity || '1',
                'Nhu cầu cụ thể': message || 'Không có'
            };

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            .then(async (response) => {
                if (response.status == 200) {
                    // Success state
                    formStatus.classList.add('show');
                    landingForm.reset();
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> ĐÃ GỬI THÀNH CÔNG';
                    submitBtn.style.background = 'linear-gradient(135deg, #2ea44f, #3fb950)';

                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                        submitBtn.style.opacity = '1';
                        submitBtn.style.background = '';
                        formStatus.classList.remove('show');
                    }, 5000);
                } else {
                    submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> LỖI! VUI LÒNG GỌI HOTLINE';
                    submitBtn.style.background = '#d32f2f';
                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                        submitBtn.style.opacity = '1';
                        submitBtn.style.background = '';
                    }, 3000);
                }
            })
            .catch(error => {
                console.log(error);
                submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> LỖI MẠNG!';
                submitBtn.style.background = '#d32f2f';
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                    submitBtn.style.background = '';
                }, 3000);
            });
        });
    }

    // ============================
    // Active nav link highlight
    // ============================
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 100;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`nav a[href="#${sectionId}"]`);

            if (navLink) {
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    navLink.style.color = '#0a5cdb';
                    navLink.style.background = '#e8f0fe';
                } else {
                    navLink.style.color = '';
                    navLink.style.background = '';
                }
            }
        });
    });
});
