(function () {
    const slider = document.querySelector('#animated_gallery .slider_container');

    if (!slider) {
        console.warn('Galeria animată nu a fost găsită pe pagină.');
        return;
    }

    let current = 0;
    let inTransition = false;
    let intervalId = null;
    let isPaused = false; 

    const slides = slider.querySelectorAll('.slide');

    if (!slides.length) return;

    // if we have CSS animations defined, we want to disable them for JS control
    slides.forEach(s => s.style.animation = 'none');

    // Preparation: 
    //      first slide is visible, rest are hidden 
    //      all slides are stacked on top of each other (translateX(0))
    slides.forEach((s, i) => {
        s.style.opacity = (i === 0) ? '1' : '0';
        s.style.transform = 'translateX(0%)';
    });

    function animated() {
        // not starting if we are already in a transition or if we are paused
        if (inTransition || isPaused) return;  
        inTransition = true;

        const sc = slides[current]; // current slide 
        const next = (current + 1) % slides.length;
        const sn = slides[next]; // next slide

        // Prepare the next slide: make it semi-transparent 
        sn.style.transition = 'opacity 0.3s ease';
        sn.style.opacity = '0.6';
        sn.style.transform = 'translateX(0%)';

        // Phase 1: current slide moves to the right and becomes semi-transparent
        sc.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
        sc.style.transform = 'translateX(25%)';
        sc.style.opacity = '0.8';

        setTimeout( () => {
            // verify if we are paused before continuing to the next phase
            if (isPaused) {
                inTransition = false;
                return;
            }
            
            // Phase 2: current slide moves to the left and becomes more transparent
            sc.style.transform = 'translateX(-40%)';
            sc.style.opacity = '0.4';

            setTimeout( () => {
                // verify if we are paused before continuing to the next phase
                if (isPaused) {
                    inTransition = false;
                    return;
                }
                
                // Phase 3: current slide moves out to the right and becomes invisible
                sc.style.transform = 'translateX(110%)';
                sc.style.opacity = '0';

                // next slide becomes fully visible
                sn.style.transition = 'opacity 0.5s ease';
                sn.style.opacity = '1';

                setTimeout(() => {
                    // reset current slide for the next cycle
                    sc.style.transition = 'none';
                    sc.style.transform = 'translateX(0%)';
                    sc.style.opacity = '0';

                    current = next;
                    inTransition = false;
                }, 500);

            }, 500);
        }, 500);
    }

    slider.addEventListener('mouseenter', () => {
        // activate pause state
        isPaused = true; 
        // stop the interval if it's running
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    });
    
    slider.addEventListener('mouseleave', () => {
        // deactivate pause state
        isPaused = false;  
        if (inTransition) {
            animated();  
        }
        // restart the interval if it's not already running
        if (!intervalId) {
            intervalId = setInterval(animated, 1000);
        }
    })

    intervalId = setInterval(animated, 1000);

})();