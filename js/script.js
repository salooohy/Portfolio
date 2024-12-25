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

document.addEventListener("DOMContentLoaded", function () {
    // Debugging the #typed-name instance
    console.log("Typed.js for name initialized.");
    var typed = new Typed('#typed-name', {
        strings: ["Salih Al-Tak", "A Mechanical Engineer", "Passionate about Automation", "Smart Systems Enthusiast"],
        typeSpeed: 50,
        backSpeed: 30,
        startDelay: 500,
        backDelay: 1000,
        loop: true,
        showCursor: true,
        cursorChar: "|",
        smartBackspace: true
    });

    // Debugging the #typed-skills instance
    if (document.querySelector('#typed-skills')) {
        console.log("Found #typed-skills element.");
        var typedSkills = new Typed('#typed-skills', {
            strings: ["Summary of Skills"],
            typeSpeed: 100,
            backSpeed: 50,
            startDelay: 300,
            loop: false,
            showCursor: true,
            cursorChar: "|",
            smartBackspace: true
        });
    } else {
        console.log("Error: #typed-skills element not found.");
    }
});


function toggleMenu() {
    const dropdown = document.querySelector('.dropdown-nav');
    dropdown.classList.toggle('active');
}

document.addEventListener('click', function (event) {
    const dropdown = document.querySelector('.dropdown-nav');
    const hamburger = document.querySelector('.hamburger-menu');
    
    // Close the menu if clicking outside of it
    if (
        dropdown.classList.contains('active') &&
        !dropdown.contains(event.target) &&
        !hamburger.contains(event.target)
    ) {
        dropdown.classList.remove('active');
    }
});
