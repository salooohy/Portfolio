// Smooth scrolling navigation
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        const sectionId = item.getAttribute('data-section');
        document.getElementById(sectionId).scrollIntoView({behavior: 'smooth'});

        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(navItem => navItem.classList.remove('active'));
        item.classList.add('active');
    });
});

// Light/Dark mode toggle
const modeToggle = document.getElementById('mode-toggle');
modeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
});

// Interactive skills
document.querySelectorAll('.skill').forEach(skill => {
    skill.addEventListener('click', () => {
        alert(`You clicked on ${skill.textContent}. Add your custom action here!`);
    });
});

// Highlight active section on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.section');
    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 60) {
            currentSection = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-section') === currentSection);
    });
});

// Initialize Typed.js when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    // Create a new Typed instance and specify the target element and options
    var typed = new Typed('#typed-name', {
        strings: ["Salih Al-Tak", "A Mechanical Engineer", "Passionate about Automation", "Smart Systems Enthusiast"], // Array of strings to be typed
        typeSpeed: 50, // Typing speed in milliseconds
        backSpeed: 30, // Backspacing speed in milliseconds
        startDelay: 500, // Delay before starting the typing effect (milliseconds)
        backDelay: 1000, // Delay before starting to backspace (milliseconds)
        loop: true, // Loop the typing effect
        showCursor: true, // Display the typing cursor
        cursorChar: "|", // Character for the cursor
        smartBackspace: true, // Only backspace what doesn't match the next string in the array
    });
});
