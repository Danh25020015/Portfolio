/* ============================================================
   CNS Portfolio — AI / Tech Futuristic Theme
   Shared JavaScript — Particles, Animations, Chatbot, Effects
   ============================================================ */

(function () {
  'use strict';

  /* --------------------------------------------------------
     1. PARTICLE NETWORK (Neural Network Canvas)
     -------------------------------------------------------- */
  function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;
    const PARTICLE_COUNT = 80;
    const CONNECTION_DIST = 140;
    const SPEED = 0.4;

    function resize() {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    }

    function createParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * SPEED,
          vy: (Math.random() - 0.5) * SPEED,
          r: Math.random() * 2 + 1,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = 1 - dist / CONNECTION_DIST;
            ctx.strokeStyle = `rgba(2, 132, 199, ${alpha * 0.12})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        ctx.fillStyle = `rgba(2, 132, 199, ${0.3 + Math.random() * 0.3})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();

    window.addEventListener('resize', () => {
      resize();
      createParticles();
    });
  }

  /* --------------------------------------------------------
     2. SCROLL PROGRESS BAR
     -------------------------------------------------------- */
  function initScrollProgress() {
    const bar = document.querySelector('.scroll-progress');
    if (!bar) return;

    function update() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = pct + '%';
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* --------------------------------------------------------
     3. SCROLL ANIMATIONS (IntersectionObserver)
     -------------------------------------------------------- */
  function initScrollAnimations() {
    const els = document.querySelectorAll('.fade-up');
    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    els.forEach((el) => obs.observe(el));
  }

  /* --------------------------------------------------------
     4. NUMBER COUNT-UP
     -------------------------------------------------------- */
  function initCountUp() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target;
            const target = parseInt(el.getAttribute('data-count'), 10);
            const suffix = el.getAttribute('data-suffix') || '';
            let current = 0;
            const step = Math.ceil(target / 40);
            const timer = setInterval(() => {
              current += step;
              if (current >= target) {
                current = target;
                clearInterval(timer);
              }
              el.textContent = current + suffix;
            }, 30);
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((c) => obs.observe(c));
  }

  /* --------------------------------------------------------
     5. TYPING EFFECT (Hero title)
     -------------------------------------------------------- */
  function initTyping() {
    const el = document.getElementById('typing-target');
    if (!el) return;

    const text = el.getAttribute('data-text');
    if (!text) return;

    el.textContent = '';
    el.classList.add('typing-cursor');

    let i = 0;
    function type() {
      if (i < text.length) {
        el.textContent += text[i];
        i++;
        setTimeout(type, 50 + Math.random() * 40);
      } else {
        // Remove cursor after done
        setTimeout(() => el.classList.remove('typing-cursor'), 2000);
      }
    }

    // Start after a short delay
    setTimeout(type, 800);
  }

  /* --------------------------------------------------------
     6. NAV ACTIVE STATE
     -------------------------------------------------------- */
  function initNavActive() {
    let currentPage = window.location.pathname.split('/').pop() || 'index.html';
    if (currentPage.startsWith('project-')) {
      currentPage = 'projects.html';
    }
    document.querySelectorAll('.nav-links a').forEach((a) => {
      const href = a.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        a.classList.add('active');
      }
    });
  }

  /* --------------------------------------------------------
     7. LIGHTBOX
     -------------------------------------------------------- */
  function initLightbox() {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.hidden = true;
    lightbox.innerHTML = '<button type="button" aria-label="Đóng ảnh">✕</button><img alt="">';
    document.body.appendChild(lightbox);

    const lbImg = lightbox.querySelector('img');
    const close = () => {
      lightbox.hidden = true;
      lbImg.removeAttribute('src');
      lbImg.alt = '';
    };

    document.addEventListener('click', (e) => {
      const img = e.target.closest('.media-gallery img, .poster-frame img, .wide-figure img, .evidence-figure img, .tool-shot, .timeline-media img');
      if (img) {
        lbImg.src = img.src;
        lbImg.alt = img.alt;
        lightbox.hidden = false;
      }
    });

    lightbox.querySelector('button').addEventListener('click', close);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  }

  /* --------------------------------------------------------
     8. BACK TO TOP BUTTON
     -------------------------------------------------------- */
  function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* --------------------------------------------------------
     9. AI CHATBOT
     -------------------------------------------------------- */
  function initChatbot() {
    const toggle = document.querySelector('.chatbot-toggle');
    const panel = document.querySelector('.chatbot-panel');
    if (!toggle || !panel) return;

    const messages = panel.querySelector('.chatbot-messages');
    const optionsContainer = panel.querySelector('.chatbot-options');

    const responses = {
      'Bạn là ai?': 'Chào bạn! 👋 Tôi là Ngô Duy Anh, sinh viên lớp K70I - IT1, Trường Đại học Công nghệ, ĐHQGHN. Tôi đam mê công nghệ thông tin và đang phát triển kỹ năng số cùng AI.',
      'Portfolio này về gì?': 'Portfolio này tổng hợp 6 bài tập môn "Nhập môn Công nghệ số và Ứng dụng Trí tuệ nhân tạo" — từ quản lý tệp, tìm kiếm học thuật, viết prompt, hợp tác trực tuyến, sáng tạo nội dung AI đến sử dụng AI có trách nhiệm. 📚',
      'Bài nào hay nhất?': 'Tôi tâm đắc nhất với Bài 5 (Sáng tạo nội dung với AI) — nơi tôi kết hợp ChatGPT, Gemini, DALL-E và Canva AI để tạo infographic quy trình dùng AI tạo sinh có trách nhiệm. AI hỗ trợ ~40-45%, phần cá nhân chiếm 55-60%! 🎨',
      'Web này dùng công nghệ gì?': 'Website này được xây dựng bằng HTML, CSS và JavaScript thuần — không framework! Hiệu ứng particle network, glassmorphism, scroll animations đều viết tay. Deploy trên GitHub Pages. ⚡',
      'Liên hệ bạn?': 'Bạn có thể tìm tôi qua GitHub hoặc qua email trường Đại học Công nghệ - ĐHQGHN. Rất vui được kết nối! 🤝'
    };

    const questions = Object.keys(responses);

    function addMessage(text, type) {
      const div = document.createElement('div');
      div.className = `chat-msg ${type}`;
      messages.appendChild(div);

      if (type === 'bot') {
        // Typing effect
        let i = 0;
        function typeChar() {
          if (i < text.length) {
            div.textContent += text[i];
            i++;
            messages.scrollTop = messages.scrollHeight;
            setTimeout(typeChar, 15 + Math.random() * 15);
          }
        }
        typeChar();
      } else {
        div.textContent = text;
      }

      messages.scrollTop = messages.scrollHeight;
    }

    function renderOptions() {
      optionsContainer.innerHTML = '';
      questions.forEach((q) => {
        const btn = document.createElement('button');
        btn.className = 'chat-option';
        btn.textContent = q;
        btn.addEventListener('click', () => {
          addMessage(q, 'user');
          setTimeout(() => addMessage(responses[q], 'bot'), 500);
        });
        optionsContainer.appendChild(btn);
      });
    }

    toggle.addEventListener('click', () => {
      panel.classList.toggle('open');
      if (panel.classList.contains('open') && messages.children.length === 0) {
        addMessage('Xin chào! 🤖 Tôi là trợ lý AI của Portfolio. Bạn muốn biết điều gì?', 'bot');
        renderOptions();
      }
    });
  }

  /* --------------------------------------------------------
     10. CURSOR GLOW TRAIL (Desktop only)
     -------------------------------------------------------- */
  function initCursorGlow() {
    if (window.innerWidth < 1024 || 'ontouchstart' in window) return;

    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    document.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
  }

  /* --------------------------------------------------------
     11. MATRIX RAIN EASTER EGG (press M)
     -------------------------------------------------------- */
  function initMatrixRain() {
    let matrixCanvas = document.getElementById('matrix-canvas');
    if (!matrixCanvas) {
      matrixCanvas = document.createElement('canvas');
      matrixCanvas.id = 'matrix-canvas';
      document.body.appendChild(matrixCanvas);
    }

    const ctx = matrixCanvas.getContext('2d');
    let running = false;
    let animId;
    let columns, drops;
    const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*(){}[]|/<>~ジシスセソタチツテトナニヌネノハヒフヘホ';

    function setup() {
      matrixCanvas.width = window.innerWidth;
      matrixCanvas.height = window.innerHeight;
      const fontSize = 14;
      columns = Math.floor(matrixCanvas.width / fontSize);
      drops = Array(columns).fill(1);
    }

    function drawMatrix() {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
      ctx.font = '14px Consolas, Cascadia Mono, monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx.fillStyle = Math.random() > 0.95 ? '#0f172a' : `rgba(2, 132, 199, ${0.4 + Math.random() * 0.6})`;
        ctx.fillText(text, i * 14, drops[i] * 14);

        if (drops[i] * 14 > matrixCanvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animId = requestAnimationFrame(drawMatrix);
    }

    function startMatrix() {
      if (running) return;
      running = true;
      setup();
      matrixCanvas.classList.add('active');
      drawMatrix();

      setTimeout(() => {
        cancelAnimationFrame(animId);
        matrixCanvas.classList.remove('active');
        ctx.clearRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        running = false;
      }, 3500);
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'm' || e.key === 'M') startMatrix();
    });

    // Also trigger from logo click
    const logo = document.querySelector('.nav-logo');
    if (logo) logo.addEventListener('click', startMatrix);
  }

  /* --------------------------------------------------------
     12. TIMELINE NODES ACTIVATION
     -------------------------------------------------------- */
  function initTimelineNodes() {
    const nodes = document.querySelectorAll('.timeline-node');
    if (!nodes.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          e.target.classList.toggle('active', e.isIntersecting);
        });
      },
      { threshold: 0.4, rootMargin: '0px 0px -20% 0px' }
    );

    nodes.forEach((n) => obs.observe(n));
  }

  /* --------------------------------------------------------
     13. SKILL BARS ANIMATION
     -------------------------------------------------------- */
  function initSkillBars() {
    const bars = document.querySelectorAll('.skill-fill');
    if (!bars.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const pct = e.target.getAttribute('data-percent');
            e.target.style.width = pct + '%';
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    bars.forEach((b) => obs.observe(b));
  }

  /* --------------------------------------------------------
     14. PROJECT FILTER (Projects page)
     -------------------------------------------------------- */
  function initProjectFilter() {
    const btns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-card[data-tags]');
    if (!btns.length || !cards.length) return;

    btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        btns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        cards.forEach((card) => {
          if (filter === 'all') {
            card.style.display = '';
          } else {
            const tags = card.getAttribute('data-tags').split(',');
            card.style.display = tags.includes(filter) ? '' : 'none';
          }
        });
      });
    });
  }

  /* --------------------------------------------------------
     15. PROJECT ACCORDION EXPAND
     -------------------------------------------------------- */
  // Accordion removed in favor of multi-page structure
  function initProjectAccordion() {
    // No-op
  }

  /* --------------------------------------------------------
     16. ASSIGNMENT COMPLIANCE SUMMARY
     -------------------------------------------------------- */
  function initAssignmentCompliance() {
    const page = window.location.pathname.split('/').pop();
    const data = {
      'project-1.html': {
        requirement: 'Bài tập 1 - Bài 1: Máy tính và thiết bị ngoại vi; thao tác cơ bản với tệp tin và thư mục.',
        implementation: 'Trình bày cấu trúc thư mục, quy tắc đặt tên, thao tác tạo/đổi tên/sao chép/di chuyển/xóa/khôi phục tệp.',
        evidence: '12 ảnh chụp thao tác File Explorer và báo cáo Bai1.pdf.',
      },
      'project-2.html': {
        requirement: 'Bài tập 2 - Bài 2: Khai thác dữ liệu và thông tin; tìm kiếm và đánh giá thông tin học thuật.',
        implementation: 'Dùng toán tử tìm kiếm nâng cao như dấu ngoặc kép, site:, filetype:, OR/intitle: và bảng đánh giá độ tin cậy nguồn.',
        evidence: 'Ảnh minh chứng Google Scholar, bảng nguồn học thuật và báo cáo Bai2.pdf.',
      },
      'project-3.html': {
        requirement: 'Bài tập 2 - Bài 3: Tổng quan về trí tuệ nhân tạo; viết prompt hiệu quả cho tác vụ học tập.',
        implementation: 'So sánh prompt cơ bản, cải tiến, nâng cao; phân tích vai trò, bối cảnh, ràng buộc và chất lượng đầu ra.',
        evidence: '5 ảnh minh chứng thử nghiệm prompt và báo cáo Bai3.pdf.',
      },
      'project-4.html': {
        requirement: 'Bài tập 3 - Bài 4: Giao tiếp và hợp tác trong môi trường số; dùng công cụ hợp tác trực tuyến cho dự án nhóm.',
        implementation: 'Mô tả quy trình phối hợp Trello, Google Drive và Messenger để phân công, lưu trữ và kiểm tra tiến độ.',
        evidence: 'Ảnh Trello, Drive, Messenger và báo cáo Bai4.pdf đã được tạo lại đúng nội dung hợp tác trực tuyến.',
      },
      'project-5.html': {
        requirement: 'Bài tập 2 - Bài 5: Sáng tạo nội dung số; sử dụng AI tạo sinh để hỗ trợ sáng tạo nội dung.',
        implementation: 'Trưng bày infographic hoàn thiện, nêu công cụ AI đã dùng, tỉ lệ đóng góp AI/con người và quy trình chỉnh sửa.',
        evidence: 'Infographic PNG, ảnh tải về và báo cáo Bai5.pdf.',
      },
      'project-6.html': {
        requirement: 'Bài tập 4 - Bài 6: An toàn và liêm chính học thuật trong môi trường số; sử dụng AI có trách nhiệm.',
        implementation: 'Trình bày 7 nguyên tắc cá nhân, bảng rủi ro - giải pháp và cam kết liêm chính học thuật.',
        evidence: 'Infographic nguyên tắc AI có trách nhiệm và báo cáo Bai6.pdf.',
      },
    };

    const item = data[page];
    if (!item) return;

    const tags = document.querySelector('article .project-tags');
    if (!tags || document.querySelector('.assignment-check')) return;

    const block = document.createElement('section');
    block.className = 'assignment-check';
    block.setAttribute('aria-label', 'Đối chiếu yêu cầu bài tập');
    block.innerHTML = `
      <div>
        <span>Yêu cầu trong Word</span>
        <p>${item.requirement}</p>
      </div>
      <div>
        <span>Cách triển khai trên Portfolio</span>
        <p>${item.implementation}</p>
      </div>
      <div>
        <span>Sản phẩm / minh chứng</span>
        <p>${item.evidence}</p>
      </div>
    `;

    tags.insertAdjacentElement('afterend', block);
  }

  /* --------------------------------------------------------
     17. PDF SHOWCASE (stable preview + original PDF actions)
     -------------------------------------------------------- */
  function initPdfShowcase() {
    const pdfLinks = document.querySelectorAll('.link-row a[href$=".pdf"], .link-row a[href*=".pdf"]');
    if (!pdfLinks.length) return;

    const previewMap = {
      'Bai1.pdf': '../assets/images/bai1-11.png',
      'Bai2.pdf': '../assets/images/bai2-search-clipboard.png',
      'Bai3.pdf': '../assets/images/bai3-05.png',
      'Bai4.pdf': '../assets/images/bai4-trello.png',
      'Bai5.pdf': '../assets/images/bai5-01.png',
      'Bai6.pdf': '../assets/images/bai6-01.png',
    };

    pdfLinks.forEach((link) => {
      const row = link.closest('.link-row');
      if (!row || row.previousElementSibling?.classList.contains('pdf-showcase')) return;

      const href = link.getAttribute('href');
      const fileName = decodeURIComponent(href.split('/').pop() || 'BaoCao.pdf');
      const preview = previewMap[fileName] || '../assets/images/bai5-01.png';
      const projectTitle = document.querySelector('article h2')?.textContent?.trim() || 'Báo cáo bài tập';

      const showcase = document.createElement('section');
      showcase.className = 'pdf-showcase fade-up';
      showcase.setAttribute('aria-label', 'Tài liệu PDF đính kèm');
      showcase.innerHTML = `
        <figure class="pdf-preview">
          <img src="${preview}" alt="Bản xem trước của ${fileName}" loading="lazy">
        </figure>
        <div class="pdf-copy">
          <span class="pdf-kicker">Tài liệu PDF gốc</span>
          <h4>${projectTitle}</h4>
          <p>Phần xem trước dùng ảnh minh chứng để giữ bố cục chữ ổn định trên mọi trình duyệt. PDF gốc vẫn được đính kèm để mở trong tab mới hoặc tải về khi cần kiểm tra đầy đủ.</p>
          <div class="pdf-actions">
            <a class="btn btn-primary btn-sm" href="${href}" target="_blank" rel="noopener">Mở PDF</a>
            <a class="btn btn-ghost btn-sm" href="${href}" download>Tải PDF</a>
          </div>
        </div>
      `;

      row.parentNode.insertBefore(showcase, row);
      link.textContent = 'Mở PDF trong tab mới';
    });
  }

  /* --------------------------------------------------------
     18. PAGE TRANSITION EFFECT
     -------------------------------------------------------- */
  function initPageTransitions() {
    const transition = document.querySelector('.page-transition');
    if (!transition) return;

    // Show page after load
    setTimeout(() => transition.classList.remove('active'), 300);

    // Navigate with transition
    document.querySelectorAll('a[href$=".html"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (href.startsWith('http') || href.startsWith('#')) return;
        e.preventDefault();
        transition.classList.add('active');
        setTimeout(() => { window.location.href = href; }, 350);
      });
    });
  }

  /* --------------------------------------------------------
     INIT ALL
     -------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initScrollProgress();
    initAssignmentCompliance();
    initPdfShowcase();
    initScrollAnimations();
    initCountUp();
    initTyping();
    initNavActive();
    initLightbox();
    initBackToTop();
    initChatbot();
    initCursorGlow();
    initMatrixRain();
    initTimelineNodes();
    initSkillBars();
    initProjectFilter();
    initProjectAccordion();
    initPageTransitions();
  });
})();
