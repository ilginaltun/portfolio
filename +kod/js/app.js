// Strings
    const STRINGS = {
      en: {
        term1: "> hi i'm ılgın!",
        term2: "> wanna start? (yes/no): "
      },
      tr: {
        term1: "> merhaba ben ılgın!",
        term2: "> başlamak ister misin? (evet/hayır): "
      }
    };

    let currentLang = 'en';

    function setLanguage(lang) {
      currentLang = lang;
      document.body.className = `lang-${lang}`;
      document.getElementById('btn-en').classList.toggle('active', lang === 'en');
      document.getElementById('btn-tr').classList.toggle('active', lang === 'tr');

      if (phase === 1 && termDone) {
        document.getElementById('term-line1').innerHTML = STRINGS[lang].term1;
        if (typeof terminalState !== 'undefined' && terminalState === 'try_again') {
          document.getElementById('term-prompt').innerText = lang === 'en' ? '> try again? (yes/no): ' : '> tekrar dene? (evet/hayır): ';
        } else {
          document.getElementById('term-prompt').innerText = STRINGS[lang].term2;
        }
      }
    }

    // Phase 1: Intro
    let phase = 1;
    let termDone = false;

    const FILE_ICONS = [
      `<img src="file_icon.png" alt="file">`,
      `<img src="file_pink.png" alt="file">`,
      `<img src="file_orange.png" alt="file">`,
      `<img src="file_icon_1.png" alt="file">`,
      `<img src="file_icon_2.png" alt="file">`,
      `<img src="file_icon_3.png" alt="file">`
    ];

    const scatterFiles = [
      'index.html', 'style.css', 'app.js', 'main.py', 'database.db', 'model.keras', 'notes.md', 'logo.png', 'config.json', 'utils.js',
      'server.py', 'docker-compose.yml', 'Dockerfile', 'package.json', 'README.md', 'test.py', 'data.csv', 'backup.sql', 'archive.zip', 'image.jpg',
      'video.mp4', 'audio.wav', 'script.sh', 'deploy.yaml', 'auth.js', 'api.py', 'routes.js', 'styles.scss', 'index.tsx', 'app.tsx',
      'Component.jsx', 'hooks.js', 'store.js', 'reducers.js', 'actions.js', 'types.ts', 'interfaces.ts', 'tsconfig.json', 'webpack.config.js', 'babel.config.json',
      'jest.config.js', 'setupTests.js', 'eslint.config.js', 'prettierrc.json', '.gitignore', '.env', 'logs.txt', 'error.log', 'access.log', 'yarn.lock',
      'npm-debug.log', 'Pipfile', 'requirements.txt', 'manage.py', 'settings.py', 'urls.py', 'wsgi.py', 'asgi.py', 'models.py', 'views.py',
      'admin.py', 'forms.py', 'tests.py', 'serializers.py', 'permissions.py', 'decorators.py', 'middleware.py', 'signals.py', 'apps.py', 'tasks.py',
      'celery.py', 'worker.js', 'service-worker.js', 'manifest.json', 'robots.txt', 'sitemap.xml', 'favicon.ico', 'apple-touch-icon.png', 'browserconfig.xml', 'site.webmanifest',
      'mixins.scss', 'variables.scss', 'functions.scss', 'reset.css', 'normalize.css', 'typography.css', 'grid.css', 'layout.css', 'components.css', 'utilities.css',
      'Button.tsx', 'Input.tsx', 'Modal.tsx', 'Dropdown.tsx', 'Tooltip.tsx', 'Card.tsx', 'Avatar.tsx', 'Badge.tsx', 'Spinner.tsx', 'Toast.tsx',
      'useFetch.js', 'useAuth.js', 'useTheme.js', 'useLocalStorage.js', 'useWindowSize.js', 'useDebounce.js', 'useThrottle.js', 'usePrevious.js', 'useClickOutside.js', 'useInterval.js',
      'Home.jsx', 'About.jsx', 'Contact.jsx', 'Login.jsx', 'Register.jsx', 'Dashboard.jsx', 'Profile.jsx', 'Settings.jsx', 'NotFound.jsx', 'Error.jsx'
    ];
    const scatterContainer = document.getElementById('scatter-container');

    scatterFiles.forEach((name, i) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'scatter-wrapper';

      const targetX = 2 + Math.random() * 92;
      const targetY = 5 + Math.random() * 90;
      wrapper.style.left = targetX + 'vw';
      wrapper.style.top = targetY + 'vh';

      const startX = (Math.random() > 0.5 ? 100 : -100) + 'vw';
      const startY = (Math.random() > 0.5 ? 100 : -100) + 'vh';
      wrapper.style.setProperty('--start-x', startX);
      wrapper.style.setProperty('--start-y', startY);

      const delay = Math.random() * 1.2;
      const duration = 0.8 + Math.random() * 1.0;
      wrapper.style.animation = `flyIn ${duration}s ${delay}s cubic-bezier(0.2, 0.8, 0.2, 1) forwards`;

      const icon = document.createElement('div');
      icon.className = 'scatter-icon';
      const rot = (Math.random() - 0.5) * 60;
      icon.dataset.rot = rot;
      icon.style.transform = `rotate(${rot}deg)`;
      const randomIcon = FILE_ICONS[Math.floor(Math.random() * FILE_ICONS.length)];
      icon.innerHTML = `${randomIcon}<div class="icon-label">${name}</div>`;

      wrapper.appendChild(icon);
      scatterContainer.appendChild(wrapper);
    });

    function setupInteractions() {
      const wrappers = document.querySelectorAll('.scatter-wrapper');

      document.addEventListener('mousemove', (e) => {
        if (isDraggingPopup) return;
        if (phase === 2 && scatterFilesGathered) return;

        wrappers.forEach(wrapper => {
          const icon = wrapper.querySelector('.scatter-icon');
          if (!icon) return;

          const rect = wrapper.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          const dx = centerX - e.clientX;
          const dy = centerY - e.clientY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            const pushFactor = (150 - dist) / 150;
            const pushDist = pushFactor * 100;
            const dirX = dist === 0 ? 0 : dx / dist;
            const dirY = dist === 0 ? 0 : dy / dist;
            icon.style.transform = `translate(${dirX * pushDist}px, ${dirY * pushDist}px) rotate(${icon.dataset.rot}deg)`;
            icon.style.transition = 'transform 0.1s linear';
          } else {
            icon.style.transform = `translate(0px, 0px) rotate(${icon.dataset.rot}deg)`;
            icon.style.transition = 'transform 0.8s ease-out';
          }
        });
      });
    }

    setupInteractions();

    async function typeWriter(text, element, speed = 50) {
      element.innerHTML = '';
      for (let i = 0; i < text.length; i++) {
        element.innerHTML += text.charAt(i);
        await new Promise(r => setTimeout(r, speed));
      }
    }

    async function typeWriterHTML(htmlStr, element, speed = 20) {
      element.innerHTML = '';
      let i = 0;
      while (i < htmlStr.length) {
        if (htmlStr.charAt(i) === '<') {
          let tag = '';
          while (htmlStr.charAt(i) !== '>' && i < htmlStr.length) {
            tag += htmlStr.charAt(i);
            i++;
          }
          tag += '>';
          element.innerHTML += tag;
        } else {
          element.innerHTML += htmlStr.charAt(i);
          await new Promise(r => setTimeout(r, speed));
        }
        i++;
      }
    }

    // Start typewriter without waiting for files to settle
    setTimeout(async () => {
      await typeWriter(STRINGS[currentLang].term1, document.getElementById('term-line1'), 40);
      await new Promise(r => setTimeout(r, 300));
      document.getElementById('term-line2').style.display = 'block';
      await typeWriter(STRINGS[currentLang].term2, document.getElementById('term-prompt'), 40);
      document.getElementById('term-input').focus();
      termDone = true;
    }, 500);

    let terminalState = 'start';
    let rainInterval = null;

    document.getElementById('term-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = e.target.value.trim().toLowerCase();
        
        if (terminalState === 'start') {
          if (val === 'no' || val === 'hayır' || val === 'hayir') {
            terminalState = 'try_again';
            handleNo();
          } else {
            startPhase2();
          }
        } else if (terminalState === 'try_again') {
          if (val === 'yes' || val === 'evet') {
            resetToStart();
          } else if (val === 'no' || val === 'hayır' || val === 'hayir') {
            e.target.value = '';
          } else {
            resetToStart(); // fallback treat as yes
          }
        }
      }
    });

    function resetToStart() {
      terminalState = 'start';
      if (rainInterval) clearInterval(rainInterval);
      const rainContainer = document.getElementById('rain-container');
      if (rainContainer) rainContainer.remove();
      
      const overlay = document.getElementById('dark-overlay');
      overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.65)';
      overlay.style.zIndex = '5';
      
      document.querySelectorAll('.term-history').forEach(el => el.remove());
      
      const termPrompt = document.getElementById('term-prompt');
      termPrompt.innerText = STRINGS[currentLang].term2;
      const input = document.getElementById('term-input');
      input.value = '';
      input.focus();
    }

    function handleNo() {
      const overlay = document.getElementById('dark-overlay');
      overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.92)';
      overlay.style.zIndex = '20';
      
      const input = document.getElementById('term-input');
      const termPrompt = document.getElementById('term-prompt');
      input.disabled = true;

      const emojis = ['🥲'];
      const rainContainer = document.createElement('div');
      rainContainer.id = 'rain-container';
      rainContainer.style.position = 'absolute';
      rainContainer.style.top = '0';
      rainContainer.style.left = '0';
      rainContainer.style.width = '100%';
      rainContainer.style.height = '100%';
      rainContainer.style.pointerEvents = 'none';
      rainContainer.style.zIndex = '60';
      rainContainer.style.overflow = 'hidden';
      document.body.appendChild(rainContainer);

      let count = 0;
      rainInterval = setInterval(() => {
        if (count > 40) clearInterval(rainInterval);
        count++;

        const emoji = document.createElement('div');
        emoji.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.position = 'absolute';
        emoji.style.left = Math.random() * 100 + 'vw';
        emoji.style.top = '-50px';
        emoji.style.fontSize = (Math.random() * 24 + 20) + 'px';
        emoji.style.opacity = Math.random() * 0.5 + 0.5;
        emoji.style.transition = 'top 4s linear, opacity 4s ease-in';
        
        rainContainer.appendChild(emoji);

        setTimeout(() => {
          emoji.style.top = '110vh';
          emoji.style.opacity = '0';
        }, 50);

        setTimeout(() => {
          emoji.remove();
        }, 4050);
      }, 150);
      
      setTimeout(async () => {
        const history = document.createElement('div');
        history.className = 'term-history';
        history.innerHTML = `${termPrompt.innerHTML}${input.value}<br><br>> :(<br><br>`;
        termPrompt.parentNode.insertBefore(history, termPrompt);
        
        termPrompt.innerText = currentLang === 'en' ? '> try again? (yes/no): ' : '> tekrar dene? (evet/hayır): ';
        input.value = '';
        input.disabled = false;
        input.focus();
      }, 1000);
    }

    // Phase 2
    const mainFolders = [
      { id: 'how', en: 'how?', tr: 'nasıl?', img: 'blue_folder.png' },
      { id: 'who', en: 'who?', tr: 'kim?', img: 'blue_folder.png' },
      { id: 'what', en: 'what?', tr: 'ne?', img: 'blue_folder.png' },
      { id: 'sources', en: 'sources', tr: 'kaynaklar', img: 'blue_folder.png' },
      { id: 'contact', en: 'contact!', tr: 'iletişim!', img: 'yellow_folder.png', extraClass: 'folder-yellow' }
    ];

    const desktopContainer = document.getElementById('desktop-folders');

    const fallbackSVGBlue = "data:image/svg+xml;utf8,<svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'><path d='M5,20 Q5,10 15,10 L35,10 Q40,10 42,15 L48,25 Q50,30 55,30 L85,30 Q95,30 95,40 L95,85 Q95,95 85,95 L15,95 Q5,95 5,85 Z' fill='%234ea5ff'/><path d='M5,35 Q5,30 15,30 L85,30 Q95,30 95,40 L95,85 Q95,95 85,95 L15,95 Q5,95 5,85 Z' fill='%237abaff'/></svg>";
    const fallbackSVGYellow = "data:image/svg+xml;utf8,<svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'><path d='M5,20 Q5,10 15,10 L35,10 Q40,10 42,15 L48,25 Q50,30 55,30 L85,30 Q95,30 95,40 L95,85 Q95,95 85,95 L15,95 Q5,95 5,85 Z' fill='%23e6a800'/><path d='M5,35 Q5,30 15,30 L85,30 Q95,30 95,40 L95,85 Q95,95 85,95 L15,95 Q5,95 5,85 Z' fill='%23ffc824'/></svg>";

    mainFolders.forEach(f => {
      const wrapper = document.createElement('div');
      wrapper.className = 'folder-wrapper';
      wrapper.dataset.popup = f.id;

      const fallback = f.id === 'contact' ? fallbackSVGYellow : fallbackSVGBlue;

      wrapper.innerHTML = `
    <div class="folder-icon ${f.extraClass || ''}">
      <img src="${f.img}" alt="folder" class="folder-img" onerror="this.onerror=null; this.src='${fallback}'">
      <div class="folder-label"><span class="en">${f.en}</span><span class="tr">${f.tr}</span></div>
    </div>
  `;
      desktopContainer.appendChild(wrapper);
    });

    let scatterFilesGathered = false;

    function startPhase2() {
      if (phase === 2) return;
      phase = 2;

      document.getElementById('mac-dock').style.display = 'flex';
      document.getElementById('widgets-container').style.display = 'flex';
      initWidgets();
      checkWidgetsResponsive();

      // Fade out the dark overlay
      document.getElementById('dark-overlay').style.opacity = '0';

      document.getElementById('intro-terminal').classList.add('hide');
      desktopContainer.style.display = 'flex';

      document.querySelectorAll('.folder-wrapper').forEach((wrapper, i) => {
        wrapper.style.animation = `settleIn 0.5s ${i * 0.15}s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards`;
      });

      setTimeout(() => {
        const whatFolder = document.querySelector('.folder-wrapper[data-popup="what"]');
        if (!whatFolder) return;

        const whatRect = whatFolder.getBoundingClientRect();
        const destX = whatRect.left + whatRect.width / 2 - 32;
        const destY = whatRect.top + whatRect.height / 2 - 35;

        document.querySelectorAll('.scatter-wrapper').forEach((wrapper, i) => {
          const icon = wrapper.querySelector('.scatter-icon');

          icon.style.transform = `translate(0px, 0px) rotate(${icon.dataset.rot}deg)`;
          icon.style.transition = 'transform 0.5s';

          const currentRect = wrapper.getBoundingClientRect();
          wrapper.style.left = currentRect.left + 'px';
          wrapper.style.top = currentRect.top + 'px';
          wrapper.style.opacity = '1';
          wrapper.style.animation = 'none';

          void wrapper.offsetWidth;

          wrapper.style.transition = `all 1.0s cubic-bezier(0.5, 0, 0.2, 1) ${Math.random() * 0.6}s`;
          wrapper.style.left = destX + 'px';
          wrapper.style.top = destY + 'px';
          wrapper.style.transform = 'scale(0.1) rotate(360deg)';
        });

        setTimeout(() => {
          document.getElementById('scatter-container').innerHTML = '';
          scatterFilesGathered = true;
        }, 2500);

      }, 500);
    } // End of startPhase2()

    // --- Widgets Logic ---
    function initWidgets() {
      // Analog Clock
      const clockFace = document.getElementById('clock-face');
      clockFace.innerHTML = '';
      for (let i = 0; i < 60; i++) {
        const tick = document.createElement('div');
        tick.className = 'tick' + (i % 5 === 0 ? ' thick' : '');
        tick.style.transform = `rotate(${i * 6}deg)`;
        clockFace.appendChild(tick);
      }
      for (let i = 1; i <= 12; i++) {
        const num = document.createElement('div');
        num.className = 'clock-number';
        num.innerText = i;
        const angle = i * 30 * (Math.PI / 180);
        const radius = 46;
        const x = Math.sin(angle) * radius;
        const y = -Math.cos(angle) * radius;
        num.style.transform = `translate(${x}px, ${y}px)`;
        clockFace.appendChild(num);
      }

      function updateClock() {
        const d = new Date();
        const sec = d.getSeconds();
        const min = d.getMinutes();
        const hr = d.getHours();
        
        const secDeg = sec * 6;
        const minDeg = min * 6 + sec * 0.1;
        const hrDeg = (hr % 12) * 30 + min * 0.5;
        
        document.getElementById('second-hand').style.transform = `rotate(${secDeg}deg)`;
        document.getElementById('min-hand').style.transform = `rotate(${minDeg}deg)`;
        document.getElementById('hour-hand').style.transform = `rotate(${hrDeg}deg)`;
      }
      setInterval(updateClock, 1000);
      updateClock();

      // Calendar
      const initialD = new Date();
      const months = ['OCAK','ŞUBAT','MART','NİSAN','MAYIS','HAZİRAN','TEMMUZ','AĞUSTOS','EYLÜL','EKİM','KASIM','ARALIK'];
      document.getElementById('cal-month').innerText = months[initialD.getMonth()];
      const firstDay = new Date(initialD.getFullYear(), initialD.getMonth(), 1).getDay();
      const daysInMonth = new Date(initialD.getFullYear(), initialD.getMonth() + 1, 0).getDate();
      const grid = document.getElementById('cal-grid');
      let startOffset = firstDay === 0 ? 6 : firstDay - 1;
      
      // Clear old days (keep the day names)
      grid.innerHTML = '<div class="day-name">P</div><div class="day-name">S</div><div class="day-name">Ç</div><div class="day-name">P</div><div class="day-name">C</div><div class="day-name">C</div><div class="day-name">P</div>';
      
      for(let i=0; i<startOffset; i++) {
        grid.innerHTML += '<div></div>';
      }
      for(let i=1; i<=daysInMonth; i++) {
        grid.innerHTML += `<div class="day ${i === initialD.getDate() ? 'today' : ''}">${i}</div>`;
      }

      // Weather
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          try {
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=auto`);
            const data = await res.json();
            document.getElementById('weather-loc').innerHTML = 'Konumunuz 📍';
            document.getElementById('weather-temp').innerText = Math.round(data.current_weather.temperature) + '°';
            document.getElementById('weather-highlow').innerText = `Y:${Math.round(data.daily.temperature_2m_max[0])}° D:${Math.round(data.daily.temperature_2m_min[0])}°`;
            document.getElementById('weather-desc').innerText = getWeatherDesc(data.current_weather.weathercode);
          } catch (e) {
            document.getElementById('weather-desc').innerText = 'Hata';
          }
        }, () => {
          document.getElementById('weather-desc').innerText = 'İzin yok';
        });
      }
    }

    function getWeatherDesc(code) {
      if (code === 0) return 'Açık';
      if (code <= 3) return 'Parçalı Bulutlu';
      if (code <= 48) return 'Sisli';
      if (code <= 57) return 'Çisenti';
      if (code <= 67) return 'Yağmurlu';
      if (code <= 77) return 'Kar';
      if (code <= 82) return 'Sağanak';
      return 'Fırtınalı';
    }

    let isMusicPlaying = false;
    function toggleMusic() {
      const audio = document.getElementById('widget-audio');
      const icon = document.getElementById('play-icon');
      if (isMusicPlaying) {
        audio.pause();
        icon.setAttribute('d', 'M8 5v14l11-7z');
      } else {
        audio.play();
        icon.setAttribute('d', 'M6 19h4V5H6v14zm8-14v14h4V5h-4z');
      }
      isMusicPlaying = !isMusicPlaying;
    }
    const trackList = ['deneme1.mp3', 'deneme2.mp3'];
    let currentTrackIdx = 0;
    function prevMusic() {
      currentTrackIdx = (currentTrackIdx - 1 + trackList.length) % trackList.length;
      changeTrack();
    }
    function nextMusic() {
      currentTrackIdx = (currentTrackIdx + 1) % trackList.length;
      changeTrack();
    }
    function changeTrack() {
      const audio = document.getElementById('widget-audio');
      audio.src = 'sources/' + trackList[currentTrackIdx];
      document.getElementById('music-title').innerText = trackList[currentTrackIdx];
      if (isMusicPlaying) audio.play();
    }

    const popupMap = {
        'how': [{ id: 'popup-how', left: '580px', top: '230px' }],
        'who': [
          { id: 'popup-about', left: '290px', top: '680px' },
          { id: 'popup-photo', left: '65vw', top: '75vh' }
        ],
        'what': [{ id: 'popup-what', left: '77vw', top: '28vh' }],
        'contact': [{ id: 'popup-contact', left: '85vw', top: '85vh' }],
        'sources': [{ id: 'popup-sources', left: '85vw', top: '60vh' }]
      };

      document.querySelectorAll('.folder-wrapper').forEach(folder => {
        folder.addEventListener('click', (e) => {
          const items = popupMap[folder.dataset.popup];
          items.forEach(item => {
            openPopup(item.id, item.left, item.top, e);
          });
        });
      });

    let widgetsDocked = false;
    let widgetsCentered = false;

    window.addEventListener('resize', () => {
      if (phase !== 2) return;
      checkWidgetsResponsive();
    });

    function checkWidgetsResponsive() {
      const container = document.getElementById('widgets-container');
      const dockGear = document.getElementById('dock-widgets');
      
      if (window.innerWidth < 768 && !widgetsDocked && !widgetsCentered) {
        widgetsDocked = true;
        // Move to dock
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight - 40;
        const startX = 40 + container.offsetWidth / 2;
        const startY = 40 + container.offsetHeight / 2;
        container.style.transform = `translate(${cx - startX}px, ${cy - startY}px) scale(0.1)`;
        container.style.opacity = '0';
        container.style.pointerEvents = 'none';
        
        setTimeout(() => { dockGear.style.display = 'flex'; }, 400);
      } else if (window.innerWidth >= 768 && widgetsDocked) {
        widgetsDocked = false;
        widgetsCentered = false;
        dockGear.style.display = 'none';
        container.style.transform = 'translate(0px, 0px) scale(1)';
        container.style.opacity = '1';
        container.style.pointerEvents = 'auto';
      }
    }

    function toggleWidgetsCentered() {
      const container = document.getElementById('widgets-container');
      if (widgetsCentered) {
        // Dock again
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight - 40;
        const startX = 40 + container.offsetWidth / 2;
        const startY = 40 + container.offsetHeight / 2;
        container.style.transform = `translate(${cx - startX}px, ${cy - startY}px) scale(0.1)`;
        container.style.opacity = '0';
        container.style.pointerEvents = 'none';
        widgetsCentered = false;
      } else {
        // Pop to center
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const startX = 40 + container.offsetWidth / 2;
        const startY = 40 + container.offsetHeight / 2;
        container.style.transform = `translate(${cx - startX}px, ${cy - startY}px) scale(1)`;
        container.style.opacity = '1';
        container.style.pointerEvents = 'auto';
        widgetsCentered = true;
      }
    }

    // Popups
    let zIndexCounter = 100;
    let isDraggingPopup = false;

    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('dot') && e.target.classList.contains('yellow')) {
        const popup = e.target.closest('.popup') || e.target.closest('#intro-terminal');
        // Do not minimize the intro-terminal because dock is hidden in Phase 1
        if (popup && popup.id !== 'intro-terminal') {
          popup.style.display = 'none';
          
          const dock = document.getElementById('mac-dock');
          const dockItem = document.createElement('div');
          dockItem.className = 'dock-item';
          
          let iconSrc = 'blue_folder.png';
          if (popup.id.includes('terminal') || popup.id.includes('proj4') || popup.id.includes('proj5') || popup.id.includes('contact') || popup.id.includes('readme')) {
            iconSrc = 'yellow_folder.png';
          }
          
          dockItem.innerHTML = `<img src="${iconSrc}" alt="minimized">`;
          
          dockItem.onclick = () => {
            popup.style.display = 'flex';
            if (popup.classList.contains('browser-chrome')) {
              popup.style.flexDirection = 'column';
            }
            dockItem.remove();
          };
          
          dock.appendChild(dockItem);
        }
      }
    });

    function showKeepGoing() {
      const bubble = document.getElementById('keep-going-bubble');
      bubble.classList.add('show-bubble');
      setTimeout(() => bubble.classList.remove('show-bubble'), 2000);
    }

    function openProject(projIndex, e) {
      if (projIndex >= 4) {
        // Terminal popups are narrower, open side-by-side
        openPopup('popup-proj' + projIndex, '35%', '50%', e);
        setTimeout(() => openPopup('readme-proj' + projIndex, '65%', '50%', e), 100);
      } else {
        // Browser popups are wide, stack them slightly
        openPopup('popup-proj' + projIndex, '50%', '50%', e);
        setTimeout(() => openPopup('readme-proj' + projIndex, '75%', '50%', e), 100);
      }
    }

    function launchTryDemo(targetId, nameEn, nameTr, e) {
      document.getElementById('td-name-en').innerText = nameEn;
      document.getElementById('td-name-tr').innerText = nameTr;
      document.getElementById('td-btn').onclick = (btnEvent) => {
        openPopup(targetId, '50%', '50%', btnEvent);
        closePopup('popup-try-project');
      };
      openPopup('popup-try-project', '50%', '50%', e);
    }

    let currentSimulationTarget = null;

    function openSourcesPopup(target, e) {
      currentSimulationTarget = target;
      openPopup('popup-sources', '50%', '50%', e);
    }

    async function useSourceFile(filename) {
      closePopup('popup-sources');
      const targetId = currentSimulationTarget;
      
      // If opened from desktop instead of terminal, we don't have a target
      if (!targetId) {
        alert("Lütfen dosyayı test etmek için önce 'sound_map' veya 'sound_detection' klasörünü açın ve 'Select from sources/' butonuna tıklayın!");
        return;
      }

      const log = document.getElementById(`sim-log-${targetId}`);
      const out = document.getElementById(`sim-output-${targetId}`);
      out.style.display = 'block';
      document.getElementById(`upload-box-${targetId}`).style.display = 'none';
      log.innerHTML = `> Downloading ${filename} from sources/ to terminal...<br>`;

      try {
        const response = await fetch(`sources/${filename}`);
        if (!response.ok) throw new Error('File not found in sources folder. Make sure you added it!');
        const blob = await response.blob();
        const file = new File([blob], filename, { type: 'audio/mpeg' });
        runSimulation(targetId, file);
      } catch (err) {
        log.innerHTML += `<br><span style="color: #ff5f56;">> Error: ${err.message}</span>`;
        document.getElementById(`upload-box-${targetId}`).style.display = 'block';
      }
    }

    function openPopup(id, defaultLeft = '50%', defaultTop = '50%', sourceEvent = null) {
      const popup = document.getElementById(id);
      if (!popup) return;

      if (popup.style.display !== 'flex') {
        popup.style.display = 'flex';

        if (popup.classList.contains('browser-chrome')) {
          popup.style.flexDirection = 'column';
        }

        if (!popup.dataset.initialized) {
          popup.dataset.initialized = 'true';
          if (window.innerWidth < 768) {
            popup.style.left = '50%';
            popup.style.top = '50%';
          } else {
            popup.style.left = defaultLeft;
            popup.style.top = defaultTop;
          }
        }

        // Apply exact MacOS Scale effect from the source icon position
        let endTransform = popup.dataset.dragged ? 'none' : 'translate(-50%, -50%) scale(1)';
        let startTransform = popup.dataset.dragged ? 'scale(0.8)' : 'translate(-50%, -50%) scale(0.4)';

        if (sourceEvent && sourceEvent.currentTarget) {
          const rect = sourceEvent.currentTarget.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          let anchorX, anchorY;
          if (popup.dataset.dragged) {
            // Find current center of dragged popup
            anchorX = popup.offsetLeft + popup.offsetWidth / 2;
            anchorY = popup.offsetTop + popup.offsetHeight / 2;
            const deltaX = centerX - anchorX;
            const deltaY = centerY - anchorY;
            startTransform = `translate(${deltaX}px, ${deltaY}px) scale(0.1)`;
            endTransform = `translate(0px, 0px) scale(1)`;
          } else {
            // offsetLeft and offsetTop naturally give the exact pixel coordinate of left/top
            anchorX = popup.offsetLeft;
            anchorY = popup.offsetTop;
            const deltaX = centerX - anchorX;
            const deltaY = centerY - anchorY;
            startTransform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px)) scale(0.05)`;
          }
        }

        popup.style.transform = popup.dataset.dragged ? 'none' : 'translate(-50%, -50%) scale(1)';
        popup.animate([
          { transform: startTransform, opacity: 0 },
          { transform: endTransform, opacity: 1 }
        ], {
          duration: 350,
          easing: 'cubic-bezier(0.2, 0.9, 0.3, 1.1)' // Snappy spring feel
        });
      }

      popup.style.zIndex = ++zIndexCounter;
    }

    function closePopup(id) {
      document.getElementById(id).style.display = 'none';
    }

    document.querySelectorAll('.popup').forEach(popup => {
      popup.addEventListener('mousedown', () => {
        popup.style.zIndex = ++zIndexCounter;
      });
    });

    // Drag Logic
    document.querySelectorAll('.window-header').forEach(header => {
      const popup = header.parentElement;

      header.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('dot')) return;

        isDraggingPopup = true;
        popup.style.zIndex = ++zIndexCounter;

        if (!popup.dataset.dragged) {
          const rect = popup.getBoundingClientRect();
          popup.style.left = rect.left + 'px';
          popup.style.top = rect.top + 'px';
          popup.style.transform = 'none';
          popup.dataset.dragged = "true";
        }

        let startX = e.clientX;
        let startY = e.clientY;
        let initialLeft = parseInt(popup.style.left || 0);
        let initialTop = parseInt(popup.style.top || 0);

        function onMouseMove(me) {
          popup.style.left = (initialLeft + me.clientX - startX) + 'px';
          popup.style.top = (initialTop + me.clientY - startY) + 'px';
        }

        function onMouseUp() {
          isDraggingPopup = false;
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });
    });

    // Terminal Simulator Logic
    async function runSimulation(projId, fileObj) {
      if (!fileObj) return;
      const filename = fileObj.name;

      document.getElementById('upload-box-' + projId).style.display = 'none';
      const outDiv = document.getElementById('sim-output-' + projId);
      const logDiv = document.getElementById('sim-log-' + projId);
      outDiv.style.display = 'block';
      logDiv.innerHTML = '';

      if (projId === 4) {
        await typeWriter("> Uploading " + filename + " to CRNN model...", logDiv, 5);

        const formData = new FormData();
        formData.append('file', fileObj);

        const BACKEND_URL = 'https://ilgonikoli-portfolio-backend.hf.space';

        try {
          const response = await fetch(BACKEND_URL + '/api/predict', {
            method: 'POST',
            body: formData
          });
          const data = await response.json();

          if (data.error) {
            logDiv.innerHTML += `<br><br>> <strong style="color:red;">Error: ${data.error}</strong>`;
            return;
          }

          logDiv.innerHTML += '<br><br>> Audio processed. Extracting predictions...';
          await new Promise(r => setTimeout(r, 100));

          let predHtml = '<br><br>> Predictions:<br>';
          data.predictions.forEach((p, idx) => {
            predHtml += `&nbsp;&nbsp;${idx + 1}. <strong style="color:#fff;">${p.class} (${(p.confidence * 100).toFixed(2)}%)</strong><br>`;
          });

          logDiv.innerHTML += predHtml;
        } catch (e) {
          logDiv.innerHTML += `<br><br>> <strong style="color:red;">Sunucuya bağlanılamadı (Flask çalışıyor mu?)</strong>`;
        }

      } else if (projId === 5) {
        await typeWriter("> Uploading " + filename + " to Whisper model...", logDiv, 5);
        logDiv.innerHTML += '<br><br>> <span style="color:#ffbd2e;">Lütfen bekleyin... Ses dosyasının uzunluğuna göre bu işlem birkaç dakika sürebilir (PyTorch aktif).</span>';

        const formData = new FormData();
        formData.append('file', fileObj);

        const BACKEND_URL = 'https://ilgonikoli-portfolio-backend.hf.space';
        try {
          const response = await fetch(BACKEND_URL + '/api/transcribe', {
            method: 'POST',
            body: formData
          });
          const data = await response.json();

          if (data.error) {
            logDiv.innerHTML += `<br><br>> <strong style="color:red;">Error: ${data.error}</strong>`;
            return;
          }

          logDiv.innerHTML += '<br><br>> Model: <span style="color:#ffbd2e;">large-v3</span> | Language: <span style="color:#ffbd2e;">tr</span><br>> Starting speaker diarization...<br>';

          for (const lineText of data.lines) {
            const lineEl = document.createElement('div');
            lineEl.style.marginTop = '12px';
            logDiv.appendChild(lineEl);

            let coloredText = lineText;
            if (lineText.includes('Konuşmacı 1')) coloredText = lineText.replace('Konuşmacı 1', '<span style="color:#ffbd2e;">Konuşmacı 1</span>');
            else if (lineText.includes('Konuşmacı 2')) coloredText = lineText.replace('Konuşmacı 2', '<span style="color:#27c93f;">Konuşmacı 2</span>');
            else coloredText = lineText.replace('KONUŞMACI', '<span style="color:#00e5ff;">KONUŞMACI</span>');

            await typeWriterHTML(`<strong>${coloredText}</strong>`, lineEl, 2);
            await new Promise(r => setTimeout(r, 30));
          }

          logDiv.innerHTML += '<br><br>> <strong style="color:#fff;">✓ Transkripsiyon bitti.</strong>';
        } catch (e) {
          logDiv.innerHTML += `<br><br>> <strong style="color:red;">Sunucuya bağlanılamadı (Flask çalışıyor mu?)</strong>`;
        }
      }
    }
