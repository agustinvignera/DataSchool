document.addEventListener('DOMContentLoaded', () => {
  
  /* ==========================================================================
     1. TEMA CLARO / OSCURO (THEME SWITCHER)
     ========================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const htmlElement = document.documentElement;
  
  // Obtener tema preferido guardado o del sistema
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  htmlElement.setAttribute('data-theme', initialTheme);
  
  // Cambiar tema al hacer click
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      htmlElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      
      // Si la cabecera está reducida mediante JS, actualizar su fondo inmediatamente
      const scrollY = window.scrollY;
      if (!supportsScrollDrivenAnimations && scrollY > 10) {
        header.style.backgroundColor = newTheme === 'dark' 
          ? 'rgba(17, 24, 39, 0.95)' 
          : 'rgba(255, 255, 255, 0.95)';
      }
    });
  }

  /* ==========================================================================
     2. FALLBACK PARA ENCOGIMIENTO DE CABECERA (SHRINKING HEADER FALLBACK)
     ========================================================================== */
  const header = document.getElementById('main-header');
  
  // Detectar si el navegador NO soporta animaciones basadas en scroll en CSS
  const supportsScrollDrivenAnimations = CSS.supports('(animation-timeline: scroll()) and (animation-range: 0% 100%)');
  
  if (header && !supportsScrollDrivenAnimations) {
    const initialHeight = 88;
    const finalHeight = 64;
    const scrollDistance = 150;
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrollPercent = Math.min(1, scrollY / scrollDistance);
      
      const currentTheme = htmlElement.getAttribute('data-theme');
      
      // Interpolación de altura
      const currentHeight = initialHeight - (initialHeight - finalHeight) * scrollPercent;
      header.style.height = `${currentHeight}px`;
      
      // Añadir estilo flotante y sombra cuando se hace scroll
      if (scrollY > 10) {
        header.style.top = '16px';
        header.style.left = '1.5rem';
        header.style.right = '1.5rem';
        header.style.width = 'auto';
        header.style.borderRadius = '100px'; /* Pill shape fallback */
        header.style.boxShadow = '0 10px 30px -10px rgba(0, 0, 0, 0.08)';
        header.style.border = '1px solid var(--border)';
        header.style.padding = '0 1.5rem';
        header.style.backgroundColor = currentTheme === 'dark' 
          ? 'rgba(17, 24, 39, 0.95)' 
          : 'rgba(255, 255, 255, 0.95)';
      } else {
        header.style.top = '0px';
        header.style.left = '0px';
        header.style.right = '0px';
        header.style.width = '100%';
        header.style.borderRadius = '0px';
        header.style.boxShadow = 'none';
        header.style.border = 'none';
        header.style.borderBottom = '1px solid var(--border)';
        header.style.padding = '0px';
        header.style.backgroundColor = currentTheme === 'dark' 
          ? 'rgba(9, 13, 22, 0.8)' 
          : 'rgba(255, 255, 255, 0.8)';
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
  }

  /* ==========================================================================
     3. EFECTO SPOTLIGHT DINÁMICO (MOUSE GLOW ON CARDS)
     ========================================================================== */
  const cards = document.querySelectorAll('.feature-card, .corporate-card, .testimonial-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // Coordenada X relativa
      const y = e.clientY - rect.top;  // Coordenada Y relativa
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  /* ==========================================================================
     4. FALLBACK PARA ANIMACIONES SCROLL-REVEAL (INTERSECTION OBSERVER)
     ========================================================================== */
  const supportsViewTimeline = CSS.supports('(animation-timeline: view()) and (animation-range: entry)');
  
  if (!supportsViewTimeline) {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -30px 0px'
    });
    
    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  }

  /* ==========================================================================
     5. FORMULARIO DE CONSULTA E INTEGRACIÓN CON WHATSAPP
     ========================================================================== */
  const signupForm = document.getElementById('signup-form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const referenceInput = document.getElementById('reference');
  const courseInput = document.getElementById('interest-course');
  const messageInput = document.getElementById('message');
  const submitBtn = document.getElementById('submit-btn');
  
  // Elementos de validación
  const nameValidationMsg = document.getElementById('name-validation-msg');
  const emailValidationMsg = document.getElementById('email-validation-msg');
  const phoneValidationMsg = document.getElementById('phone-validation-msg');
  const referenceValidationMsg = document.getElementById('reference-validation-msg');
  const courseValidationMsg = document.getElementById('course-validation-msg');
  
  // Paneles de respuesta
  const successFeedback = document.getElementById('success-feedback');
  const whatsappDirectLink = document.getElementById('whatsapp-direct-link');
  const resetFormBtn = document.getElementById('reset-form-btn');

  // Regex para validación de email
  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isFormValid = true;
      
      // Limpiar mensajes y bordes
      const inputs = [nameInput, emailInput, phoneInput, referenceInput, courseInput];
      const msgs = [nameValidationMsg, emailValidationMsg, phoneValidationMsg, referenceValidationMsg, courseValidationMsg];
      
      inputs.forEach(input => {
        if (input) input.style.borderColor = 'rgba(15, 23, 42, 0.12)';
      });
      msgs.forEach(msg => {
        if (msg) msg.textContent = '';
      });
      
      // 1. Validar Nombre
      const nameVal = nameInput ? nameInput.value.trim() : '';
      if (!nameVal) {
        if (nameValidationMsg) nameValidationMsg.textContent = 'Por favor, ingresá tu nombre completo.';
        if (nameInput) nameInput.style.borderColor = 'var(--destructive)';
        isFormValid = false;
      } else {
        if (nameInput) nameInput.style.borderColor = 'var(--success)';
      }

      // 2. Validar Email
      const emailVal = emailInput ? emailInput.value.trim() : '';
      if (!emailVal) {
        if (emailValidationMsg) emailValidationMsg.textContent = 'El correo electrónico es requerido.';
        if (emailInput) emailInput.style.borderColor = 'var(--destructive)';
        isFormValid = false;
      } else if (!validateEmail(emailVal)) {
        if (emailValidationMsg) emailValidationMsg.textContent = 'Por favor, ingresá un correo válido.';
        if (emailInput) emailInput.style.borderColor = 'var(--destructive)';
        isFormValid = false;
      } else {
        if (emailInput) emailInput.style.borderColor = 'var(--success)';
      }

      // 3. Validar Celular
      const phoneVal = phoneInput ? phoneInput.value.trim() : '';
      if (!phoneVal) {
        if (phoneValidationMsg) phoneValidationMsg.textContent = 'El número de celular es requerido.';
        if (phoneInput) phoneInput.style.borderColor = 'var(--destructive)';
        isFormValid = false;
      } else if (phoneVal.replace(/\D/g, '').length < 8) {
        if (phoneValidationMsg) phoneValidationMsg.textContent = 'Por favor, ingresá un número de contacto válido (mín. 8 dígitos).';
        if (phoneInput) phoneInput.style.borderColor = 'var(--destructive)';
        isFormValid = false;
      } else {
        if (phoneInput) phoneInput.style.borderColor = 'var(--success)';
      }

      // 4. Validar Cómo nos conociste
      const referenceVal = referenceInput ? referenceInput.value : '';
      if (!referenceVal) {
        if (referenceValidationMsg) referenceValidationMsg.textContent = 'Seleccioná cómo nos conociste.';
        if (referenceInput) referenceInput.style.borderColor = 'var(--destructive)';
        isFormValid = false;
      } else {
        if (referenceInput) referenceInput.style.borderColor = 'var(--success)';
      }

      // 5. Validar Curso de Interés
      const courseVal = courseInput ? courseInput.value : '';
      if (!courseVal) {
        if (courseValidationMsg) courseValidationMsg.textContent = 'Seleccioná el curso que te interesa.';
        if (courseInput) courseInput.style.borderColor = 'var(--destructive)';
        isFormValid = false;
      } else {
        if (courseInput) courseInput.style.borderColor = 'var(--success)';
      }

      // Si es válido, procesar envío real a Formspree
      if (isFormValid) {
        // Estado de carga
        const btnText = submitBtn.querySelector('.btn-text');
        const spinner = submitBtn.querySelector('.loading-spinner');
        
        submitBtn.disabled = true;
        if (btnText) btnText.classList.add('hidden');
        if (spinner) spinner.classList.remove('hidden');
        
        // Enviar datos a Formspree
        fetch('https://formspree.io/f/xlgkqjzo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: nameVal,
            email: emailVal,
            phone: phoneVal,
            reference: referenceVal,
            course: courseVal,
            message: messageInput ? messageInput.value.trim() : ''
          })
        })
        .then(response => {
          if (response.ok) {
            // Ocultar formulario
            if (signupForm) signupForm.classList.add('hidden');
            
            // Generar mensaje personalizado de WhatsApp
            const coordName = "Agustín";
            const additionalMessage = (messageInput && messageInput.value.trim()) ? ` Consulta adicional: ${messageInput.value.trim()}` : '';
            const messageText = `Hola ${coordName}, mi nombre es ${nameVal}. Me interesa recibir información e inscribirme en el curso de "${courseVal}" de DataSchool. Mi correo de contacto es ${emailVal} y mi celular es ${phoneVal}.${additionalMessage}`;
                                
            const encodedText = encodeURIComponent(messageText);
            const waLink = `https://wa.me/5491140034604?text=${encodedText}`;
            
            // Asignar link de WhatsApp
            if (whatsappDirectLink) whatsappDirectLink.setAttribute('href', waLink);
            
            // Mostrar feedback de éxito
            if (successFeedback) successFeedback.classList.remove('hidden');
          } else {
            alert('Hubo un problema al procesar tu consulta. Por favor, intentá nuevamente en unos instantes.');
          }
        })
        .catch(error => {
          console.error('Error al enviar formulario:', error);
          alert('Error de red. Por favor, verificá tu conexión a internet e intentá nuevamente.');
        })
        .finally(() => {
          // Restaurar estado del botón
          submitBtn.disabled = false;
          if (btnText) btnText.classList.remove('hidden');
          if (spinner) spinner.classList.add('hidden');
        });
      }
    });
  }

  // Volver al formulario de registro (Reset)
  if (resetFormBtn) {
    resetFormBtn.addEventListener('click', () => {
      if (signupForm) {
        signupForm.reset();
        const inputs = [nameInput, emailInput, phoneInput, referenceInput, courseInput];
        inputs.forEach(input => {
          if (input) input.style.borderColor = 'rgba(15, 23, 42, 0.12)';
        });
      }
      
      const msgs = [nameValidationMsg, emailValidationMsg, phoneValidationMsg, referenceValidationMsg, courseValidationMsg];
      msgs.forEach(msg => {
        if (msg) msg.textContent = '';
      });
      
      if (successFeedback) successFeedback.classList.add('hidden');
      if (signupForm) signupForm.classList.remove('hidden');
    });
  }

  /* ==========================================================================
     6. SECUENCIA DE SCROLL "DATA EVOLUTION" CON FÍSICA DE RESORTE Y FALLBACK
     ========================================================================== */
  const canvas = document.getElementById('data-evolution-canvas');
  if (canvas) {
    const TOTAL_FRAMES = 240;
    const loaderElement = document.getElementById('sequence-loader');
    const loaderText = document.getElementById('sequence-loader-text');
    const loaderBar = document.getElementById('sequence-loading-bar');
    
    const baseUri = window.themeUri ? window.themeUri + '/' : '';
    const images = [];
    let loadedCount = 0;
    let fallbackMode = false;
    
    // spring variables
    let targetProgress = 0;
    let currentProgress = 0;
    let velocity = 0;
    const stiffness = 100;
    const damping = 30;

    // preload images
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(5, '0');
      img.src = `${baseUri}sequence/${frameNum}.jpg`;
      img.onload = () => {
        loadedCount++;
        updateLoader();
        if (loadedCount === TOTAL_FRAMES) {
          hideLoader();
        }
      };
      img.onerror = () => {
        // Si no se encuentran las imágenes en la carpeta sequence
        if (!fallbackMode) {
          fallbackMode = true;
          console.warn("No se encontraron las imágenes en /sequence/. Usando fallback generativo plexus.");
          hideLoader();
        }
      };
      images[i] = img;
    }

    function updateLoader() {
      const percent = Math.round((loadedCount / TOTAL_FRAMES) * 100);
      if (loaderText) loaderText.textContent = `${percent}%`;
      if (loaderBar) loaderBar.style.width = `${percent}%`;
    }

    function hideLoader() {
      if (loaderElement) {
        loaderElement.classList.add('fade-out');
      }
    }

    // Scroll listener mapping
    const handleScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      targetProgress = docHeight > 0 ? scrollTop / docHeight : 0;
    };
    window.addEventListener('scroll', handleScrollProgress);
    handleScrollProgress(); // init

    // Spring solver equation
    function getParticlePos(i, p, width, height, time) {
      const rx = Math.sin(i * 123.456 + 1.2) * 0.5 + 0.5;
      const ry = Math.cos(i * 987.654 + 3.4) * 0.5 + 0.5;
      
      const x0 = width * (0.15 + 0.7 * rx) + Math.sin(time * 0.0005 + i) * 20;
      const y0 = height * (0.15 + 0.7 * ry) + Math.cos(time * 0.0005 + i) * 20;
      
      const x1 = width * (0.1 + 0.8 * (i / 75)) + Math.sin(time * 0.001 + i) * 10;
      const y1 = height * 0.5 + Math.sin((i / 75) * Math.PI * 5 + time * 0.001) * 120 + Math.cos(time * 0.0008 + i) * 15;
      
      let x2, y2;
      if (i < 32) {
        const cardIdx = Math.floor(i / 16);
        const ptIdx = i % 16;
        const left = cardIdx === 0 ? width * 0.15 : width * 0.55;
        const right = cardIdx === 0 ? width * 0.45 : width * 0.85;
        const top = height * 0.25;
        const bottom = height * 0.75;
        
        if (ptIdx < 4) {
          x2 = left + (right - left) * (ptIdx / 3);
          y2 = top;
        } else if (ptIdx < 8) {
          x2 = right;
          y2 = top + (bottom - top) * ((ptIdx - 4) / 3);
        } else if (ptIdx < 12) {
          x2 = right - (right - left) * ((ptIdx - 8) / 3);
          y2 = bottom;
        } else {
          x2 = left;
          y2 = bottom - (bottom - top) * ((ptIdx - 12) / 3);
        }
      } else if (i < 55) {
        const barIdx = (i - 32) % 4;
        const stepIdx = Math.floor((i - 32) / 4);
        const barWidth = width * 0.04;
        const barSpacing = width * 0.07;
        const barLeft = width * 0.18 + barIdx * barSpacing;
        const barHeight = height * (0.15 + barIdx * 0.1);
        
        x2 = barLeft + (stepIdx === 0 ? 0 : barWidth * (stepIdx / 4));
        y2 = height * 0.7 - barHeight * (Math.sin(time * 0.0002 + i) * 0.05 + 0.95);
      } else {
        const lineIdx = i - 55;
        const numPoints = 20;
        const left = width * 0.58;
        const right = width * 0.82;
        const step = (right - left) / (numPoints - 1);
        
        x2 = left + lineIdx * step;
        y2 = height * 0.5 + Math.sin(lineIdx * 0.5) * 60 + Math.cos(time * 0.0005 + i) * 5;
      }
      
      let x, y;
      if (p < 0.5) {
        const t = p / 0.5;
        const ease = t * t * (3 - 2 * t);
        x = x0 + (x1 - x0) * ease;
        y = y0 + (y1 - y0) * ease;
      } else {
        const t = (p - 0.5) / 0.5;
        const ease = t * t * (3 - 2 * t);
        x = x1 + (x2 - x1) * ease;
        y = y1 + (y2 - y1) * ease;
      }
      
      return { x, y };
    }

    function drawGenerativePlexus(progress) {
      const context = canvas.getContext('2d');
      if (!context) return;
      
      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      
      const width = canvas.width;
      const height = canvas.height;
      context.clearRect(0, 0, width, height);
      
      const numParticles = 75;
      const time = performance.now();
      const particles = [];
      
      for (let i = 0; i < numParticles; i++) {
        particles.push(getParticlePos(i, progress, width, height, time));
      }
      
      const themeMode = document.documentElement.getAttribute('data-theme');
      
      // Conexiones plexus
      const maxDist = width * 0.15;
      for (let i = 0; i < numParticles; i++) {
        for (let j = i + 1; j < numParticles; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.4;
            context.strokeStyle = themeMode === 'dark' 
              ? `rgba(255, 255, 255, ${alpha * 0.15})` 
              : `rgba(15, 23, 42, ${alpha * 0.12})`;
            context.lineWidth = 1;
            context.beginPath();
            context.moveTo(particles[i].x, particles[i].y);
            context.lineTo(particles[j].x, particles[j].y);
            context.stroke();
          }
        }
      }
      
      // Nodos
      const nodeColor = themeMode === 'dark' ? 'rgba(245, 197, 24, 0.5)' : 'rgba(245, 197, 24, 0.6)';
      for (let i = 0; i < numParticles; i++) {
        context.fillStyle = nodeColor;
        context.beginPath();
        context.arc(particles[i].x, particles[i].y, 3, 0, Math.PI * 2);
        context.fill();
        
        if (progress > 0.8 && i % 5 === 0) {
          context.strokeStyle = themeMode === 'dark' ? 'rgba(245, 197, 24, 0.2)' : 'rgba(245, 197, 24, 0.3)';
          context.beginPath();
          context.arc(particles[i].x, particles[i].y, 8 + Math.sin(time * 0.003 + i) * 2, 0, Math.PI * 2);
          context.stroke();
        }
      }
    }

    function drawFrame(progress) {
      const context = canvas.getContext('2d');
      if (!context || images.length === 0) return;
      
      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      
      const frameIndex = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(progress * (TOTAL_FRAMES - 1)) + 1));
      const img = images[frameIndex];
      
      if (img && img.complete) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        const imgRatio = img.width / img.height;
        const canvasRatio = canvas.width / canvas.height;
        let drawW = canvas.width;
        let drawH = canvas.height;
        let drawX = 0;
        let drawY = 0;
        
        if (imgRatio > canvasRatio) {
          drawW = canvas.height * imgRatio;
          drawX = (canvas.width - drawW) / 2;
        } else {
          drawH = canvas.width / imgRatio;
          drawY = (canvas.height - drawH) / 2;
        }
        
        context.drawImage(img, drawX, drawY, drawW, drawH);
      }
    }

    let lastTime = performance.now();
    const renderLoop = (time) => {
      let deltaTime = (time - lastTime) / 1000;
      if (deltaTime > 0.1) deltaTime = 0.1;
      lastTime = time;

      // Spring calculation
      const springForce = -stiffness * (currentProgress - targetProgress);
      const dampingForce = -damping * velocity;
      const acceleration = springForce + dampingForce;

      velocity += acceleration * deltaTime;
      currentProgress += velocity * deltaTime;

      if (currentProgress < 0) currentProgress = 0;
      if (currentProgress > 1) currentProgress = 1;

      // Check render style
      if (fallbackMode) {
        drawGenerativePlexus(currentProgress);
      } else {
        drawFrame(currentProgress);
      }

      requestAnimationFrame(renderLoop);
    };
    requestAnimationFrame(renderLoop);
  }
});
