/**
 * Mova Website - Enterprise Vanilla JavaScript Application
 * Features:
 *  - Safe LocalStorage (sandboxed / private mode resilient)
 *  - Header Scroll Progress Bar & Dynamic Glass Shadow
 *  - Living Ambient Mesh & 3D Perspective Tilt (Parallax)
 *  - Linear-Style Spotlight Border Hover Effect
 *  - Interactive "Choice Engine" Trip & Pricing Simulator
 *  - OSM OpenMapTiles Vector Map with MapLibre GL & Lagos Transit Hubs
 *  - Interactive Flagship Smartphone Showcase with Auto-Advance Demo & Car Glide
 *  - Metric Number Count-Up Animations
 *  - Driver Earnings Calculator & Interactive City Filters
 *  - Single-open Accordion FAQ
 */

(function () {
  'use strict';

  // --- Safe Storage Helpers (Never throws in sandboxed or private browsing) ---
  function safeGetStorage(key) {
    try {
      return window.localStorage ? window.localStorage.getItem(key) : null;
    } catch (e) {
      return null;
    }
  }

  function safeSetStorage(key, val) {
    try {
      if (window.localStorage) {
        window.localStorage.setItem(key, val);
      }
    } catch (e) {}
  }

  // =========================================================================
  // 1. Mobile Navigation Drawer
  // =========================================================================
  const menuOpenBtn = document.getElementById('mobile-menu-open');
  const menuCloseBtn = document.getElementById('mobile-menu-close');
  const mobileMenu = document.getElementById('mobile-menu');

  function openMenu() {
    if (!mobileMenu) return;
    mobileMenu.style.display = 'block';
    menuOpenBtn?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    menuCloseBtn?.focus();
  }

  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.style.display = 'none';
    menuOpenBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    menuOpenBtn?.focus();
  }

  menuOpenBtn?.addEventListener('click', openMenu);
  menuCloseBtn?.addEventListener('click', closeMenu);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.style.display === 'block') {
      closeMenu();
    }
  });

  mobileMenu?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // =========================================================================
  // 2. Header Scroll Progress Bar & Glass Elevation
  // =========================================================================
  const scrollProgressBar = document.getElementById('scroll-progress');
  const siteHeader = document.getElementById('site-header');

  function updateScroll() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollProgressBar && docHeight > 0) {
      const progress = Math.min(1, Math.max(0, scrollY / docHeight));
      scrollProgressBar.style.transform = "scaleX(" + progress + ")";
    }
    if (siteHeader) {
      if (scrollY > 15) {
        siteHeader.classList.add('header-scrolled');
      } else {
        siteHeader.classList.remove('header-scrolled');
      }
    }
  }

  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  // =========================================================================
  // 3. Viewport Stage Observer (Entrance Animations)
  // =========================================================================
  const stages = document.querySelectorAll('.viewport-stage, .enterprise-hero, .category-card, .city-metro-card');
  if ('IntersectionObserver' in window) {
    const stageOwners = new Map();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const owner = stageOwners.get(entry.target) || entry.target;
          owner.classList.add('is-active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });

    stages.forEach((stage) => {
      // display:contents elements have no box, so observe their first child instead
      const watched = (getComputedStyle(stage).display === 'contents' && stage.firstElementChild) ? stage.firstElementChild : stage;
      stageOwners.set(watched, stage);
      observer.observe(watched);
    });
  } else {
    stages.forEach((stage) => stage.classList.add('is-active'));
  }

  // =========================================================================
  // 4. Number Metric Count-Up Animation (All Pages)
  // =========================================================================
  const counterElements = document.querySelectorAll('.counter-num, [data-counter-target], [data-target]');
  if (counterElements.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    counterElements.forEach((el) => counterObserver.observe(el));
  } else {
    counterElements.forEach(animateCounter);
  }

  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-target') || el.getAttribute('data-counter-target') || '0');
    const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    const format = el.getAttribute('data-format');
    const prefix = el.getAttribute('data-counter-prefix') || '';
    const suffix = el.getAttribute('data-counter-suffix') || '';
    const duration = 1400;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      let formatted = current.toFixed(decimals);
      if (format === 'comma' || current >= 1000) {
        formatted = Math.round(current).toLocaleString();
      }
      el.textContent = prefix + formatted + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        const finalFormatted = (format === 'comma' || target >= 1000) ? Math.round(target).toLocaleString() : target.toFixed(decimals);
        el.textContent = prefix + finalFormatted + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  // =========================================================================
  // 5. 3D Perspective Tilt on Floating Hero Cards & Category Cards
  // =========================================================================
  const heroContainer = document.getElementById('hero-visual-container');
  const heroTiltCards = document.querySelectorAll('[data-tilt]');

  if (heroContainer && heroTiltCards.length && window.matchMedia('(pointer: fine)').matches) {
    heroContainer.addEventListener('mousemove', (e) => {
      const rect = heroContainer.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      heroTiltCards.forEach((card) => {
        const rotateX = -y * 14;
        const rotateY = x * 18;
        card.style.transform = "perspective(900px) rotateX(" + rotateX.toFixed(2) + "deg) rotateY(" + rotateY.toFixed(2) + "deg) translateZ(8px)";
      });
    });

    heroContainer.addEventListener('mouseleave', () => {
      heroTiltCards.forEach((card) => {
        card.style.transform = '';
      });
    });
  }

  // Individual card tilt on hover
  const physicalCards = document.querySelectorAll('.category-card, .ride-mode-card, .city-metro-card, .ecosystem-card');
  if (window.matchMedia('(pointer: fine)').matches) {
    physicalCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = "perspective(1000px) rotateX(" + (-y * 8).toFixed(2) + "deg) rotateY(" + (x * 8).toFixed(2) + "deg) translateY(-5px)";
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // =========================================================================
  // 6. Linear-Style Spotlight Border Hover Effect
  // =========================================================================
  const spotlightCards = document.querySelectorAll('.spotlight-card, .category-card, .ride-mode-card, .city-metro-card');
  if (spotlightCards.length && window.matchMedia('(pointer: fine)').matches) {
    spotlightCards.forEach((card) => {
      card.classList.add('spotlight-card');
      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', (e.clientX - rect.left) + "px");
        card.style.setProperty('--mouse-y', (e.clientY - rect.top) + "px");
      });
    });
  }

  // =========================================================================
  // 7. Interactive Choice Engine Trip & Pricing Simulator
  // =========================================================================
  const distSlider = document.getElementById('sim-distance-slider');
  const distValEl = document.getElementById('sim-distance-val');
  const durationValEl = document.getElementById('sim-duration-val');
  const offerSuggestedFareEl = document.getElementById('offer-suggested-fare');
  const offerValueEl = document.getElementById('offer-value');
  const fixedTotalFareEl = document.getElementById('fixed-total-fare');
  const meterDistTimeEl = document.getElementById('meter-dist-time');
  const meterTotalFareEl = document.getElementById('meter-total-fare');
  const distancePills = document.querySelectorAll('.distance-pill');
  const offerDecBtn = document.getElementById('offer-decrease');
  const offerIncBtn = document.getElementById('offer-increase');

  let customOfferAdjustment = 0;

  function calculateFares(km) {
    const distance = Math.max(1, Math.min(60, km));
    const durationMins = Math.round(distance * 2.2 + 4);

    const baseTariff = 1200;
    const ratePerKm = 295;
    const ratePerMin = 45;

    const fixedFare = Math.round((baseTariff + distance * ratePerKm + durationMins * ratePerMin) / 50) * 50;
    const offerMin = Math.round((fixedFare * 0.85) / 50) * 50;
    const offerMax = Math.round((fixedFare * 1.08) / 50) * 50;
    const currentOffer = Math.max(offerMin, Math.min(offerMax, Math.round((fixedFare * 0.94 + customOfferAdjustment) / 50) * 50));
    const meteredFare = Math.round((baseTariff * 0.95 + distance * (ratePerKm * 0.92) + durationMins * (ratePerMin * 0.95)) / 50) * 50;

    function popEl(el, text, html) {
      if (!el) return;
      const next = html !== undefined ? html : text;
      if (el.getAttribute('data-last') === next) return;
      el.setAttribute('data-last', next);
      if (html !== undefined) el.innerHTML = html; else el.textContent = text;
      el.classList.remove('value-pop');
      void el.offsetWidth;
      el.classList.add('value-pop');
    }
    popEl(distValEl, distance.toFixed(1) + " km");
    popEl(durationValEl, "~" + durationMins + " mins");
    popEl(offerSuggestedFareEl, "₦" + offerMin.toLocaleString() + " – ₦" + offerMax.toLocaleString());
    popEl(offerValueEl, "₦" + currentOffer.toLocaleString());
    popEl(fixedTotalFareEl, "₦" + fixedFare.toLocaleString());
    popEl(meterDistTimeEl, undefined, distance.toFixed(1) + " km <em>· " + durationMins + "m</em>");
    popEl(meterTotalFareEl, "₦" + meteredFare.toLocaleString());
    document.querySelectorAll('.choice-engine-box .ride-mode-card').forEach((card) => {
      card.classList.remove('card-recalc');
      void card.offsetWidth;
      card.classList.add('card-recalc');
    });

    distancePills.forEach((pill) => {
      const pillKm = parseFloat(pill.getAttribute('data-km') || '0');
      if (Math.abs(pillKm - distance) < 1.5) {
        pill.classList.add('is-active');
      } else {
        pill.classList.remove('is-active');
      }
    });

    const phoneOfferEl = document.querySelector('[data-phone-mode="offer"] em');
    const phoneFixedEl = document.querySelector('[data-phone-mode="fixed"] em');
    const phoneMeterEl = document.querySelector('[data-phone-mode="metered"] em');
    if (phoneOfferEl) phoneOfferEl.textContent = "₦" + currentOffer.toLocaleString();
    if (phoneFixedEl) phoneFixedEl.textContent = "₦" + fixedFare.toLocaleString();
    if (phoneMeterEl) phoneMeterEl.textContent = "₦" + meteredFare.toLocaleString() + " est.";
    document.dispatchEvent(new Event('mova-fares'));

    if (distSlider) {
      const min = parseFloat(distSlider.min || '3');
      const max = parseFloat(distSlider.max || '45');
      const pct = Math.min(100, Math.max(0, ((distance - min) / (max - min)) * 100));
      distSlider.style.background = "linear-gradient(90deg, #24c93b 0%, #24c93b " + pct + "%, #dce8e0 " + pct + "%, #dce8e0 100%)";
    }
  }

  if (distSlider) {
    distSlider.addEventListener('input', (e) => {
      calculateFares(parseFloat(e.target.value));
    });

    distancePills.forEach((pill) => {
      pill.addEventListener('click', () => {
        const targetKm = parseFloat(pill.getAttribute('data-km') || '12');
        distSlider.value = targetKm.toString();
        calculateFares(targetKm);
      });
    });

    calculateFares(parseFloat(distSlider.value || '12'));
  }

  if (offerDecBtn && offerIncBtn) {
    offerDecBtn.addEventListener('click', () => {
      customOfferAdjustment -= 250;
      if (distSlider) calculateFares(parseFloat(distSlider.value));
    });
    offerIncBtn.addEventListener('click', () => {
      customOfferAdjustment += 250;
      if (distSlider) calculateFares(parseFloat(distSlider.value));
    });
  }

  // =========================================================================
  // 8. Interactive OSM OpenMapTiles Vector Map (Lagos Launch Market)
  // The official style of OpenMapTiles, designed to display all features in vector tiles. Heavily inspired by OSM Carto.
  // =========================================================================
  function initOpenMapTiles() {
    const mapContainer = document.getElementById('mova-interactive-map');
    if (!mapContainer) return;

    if (typeof window.maplibregl === 'undefined') {
      setTimeout(initOpenMapTiles, 150);
      return;
    }

    try {
      mapContainer.innerHTML = '';

      // OSM OpenMapTiles official style (vector tiles inspired by OSM Carto)
      const map = new maplibregl.Map({
        container: 'mova-interactive-map',
        style: 'https://tiles.openfreemap.org/styles/bright',
        center: [3.4246, 6.4550],
        zoom: 11.8,
        minZoom: 8,
        maxZoom: 18,
        attributionControl: false,
        scrollZoom: true,
        doubleClickZoom: true,
        touchZoomRotate: true,
        keyboard: true
      });
      map.addControl(new maplibregl.ScaleControl({ maxWidth: 100, unit: 'metric' }), 'bottom-left');

      map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');

      const hubs = [
        {
          id: 'vi',
          name: 'Victoria Island Hub',
          subtitle: 'Commercial & Financial District',
          desc: 'High driver density across Adeola Odeku, Ahmadu Bello, and commercial waterfront.',
          coords: [3.4219, 6.4281],
          badge: 'High Driver Density'
        },
        {
          id: 'lekki',
          name: 'Lekki Phase 1',
          subtitle: 'Admiralty Way Corridor',
          desc: 'Primary residential and business dispatch. Upfront Fixed Price & Make an Offer active.',
          coords: [3.4731, 6.4474],
          badge: 'Express Couriers'
        },
        {
          id: 'ikeja',
          name: 'Ikeja Central',
          subtitle: 'Mainland Commerce & Government Hub',
          desc: 'Commercial & express route corridor connecting mainland travelers to the Island.',
          coords: [3.3533, 6.5954],
          badge: 'Mainland Gateway'
        },
        {
          id: 'airport',
          name: 'Murtala Muhammed Airport (LOS)',
          subtitle: 'Domestic & International Terminals',
          desc: 'Dedicated airport transfer lanes with flight context and fixed upfront fare certainty.',
          coords: [3.3212, 6.5774],
          badge: 'Airport Terminal Transfers'
        },
        {
          id: 'island',
          name: 'Marina / Lagos Island',
          subtitle: 'Financial Hub & Ferry Terminals',
          desc: 'Financial district hub with express city courier dispatch and metered rides.',
          coords: [3.3888, 6.4549],
          badge: 'Port & Financial'
        }
      ];

      const markerMap = {};
      const sharedPopup = new maplibregl.Popup({ offset: 22, closeButton: true, maxWidth: '280px' });
      let selectToken = 0;
      let ringRaf = null;
      let mapReady = false;
      let pendingRing = null;

      function animateRing(coords) {
        if (ringRaf) cancelAnimationFrame(ringRaf);
        const src = map.getSource('hub-focus');
        if (!src) { pendingRing = coords; return; }
        src.setData({ type: 'Feature', geometry: { type: 'Point', coordinates: coords } });
        const start = performance.now();
        function frame(now) {
          const t = ((now - start) % 1800) / 1800;
          map.setPaintProperty('hub-focus-ring', 'circle-radius', 10 + t * 46);
          map.setPaintProperty('hub-focus-ring', 'circle-stroke-opacity', 0.9 * (1 - t));
          map.setPaintProperty('hub-focus-ring', 'circle-opacity', 0.28 * (1 - t));
          ringRaf = requestAnimationFrame(frame);
        }
        ringRaf = requestAnimationFrame(frame);
      }

      function selectHub(hubId, openPopup) {
        const hubItem = markerMap[hubId];
        if (!hubItem) return;
        const token = ++selectToken;
        document.querySelectorAll('.hub-pill-btn').forEach((b) => {
          const on = b.getAttribute('data-hub') === hubId;
          b.classList.toggle('is-active', on);
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
          if (on && openPopup !== false) b.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        });
        Object.keys(markerMap).forEach((k) => {
          markerMap[k].el.classList.toggle('is-selected', k === hubId);
        });
        sharedPopup.remove();
        animateRing(hubItem.coords);
        map.flyTo({ center: hubItem.coords, zoom: 13.6, speed: 0.9, curve: 1.5, essential: true });
        if (openPopup !== false) {
          map.once('moveend', () => {
            if (token !== selectToken) return;
            sharedPopup.setLngLat(hubItem.coords).setHTML(hubItem.html).addTo(map);
          });
        }
      }

      map.on('load', () => {
        mapReady = true;
        map.addSource('hub-focus', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
        map.addLayer({
          id: 'hub-focus-ring',
          type: 'circle',
          source: 'hub-focus',
          paint: {
            'circle-radius': 10,
            'circle-color': '#24c93b',
            'circle-opacity': 0.25,
            'circle-stroke-color': '#24c93b',
            'circle-stroke-width': 2,
            'circle-stroke-opacity': 0.8,
            'circle-pitch-alignment': 'map'
          }
        });
        if (pendingRing) { animateRing(pendingRing); pendingRing = null; }
        map.addSource('transit-corridor', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [
                [3.4219, 6.4281],
                [3.4731, 6.4474],
                [3.3888, 6.4549],
                [3.3533, 6.5954],
                [3.3212, 6.5774]
              ]
            }
          }
        });

        map.addLayer({
          id: 'transit-corridor-glow',
          type: 'line',
          source: 'transit-corridor',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': '#24c93b',
            'line-width': 6,
            'line-opacity': 0.35,
            'line-blur': 3
          }
        });

        map.addLayer({
          id: 'transit-corridor-line',
          type: 'line',
          source: 'transit-corridor',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': '#007d50',
            'line-width': 3,
            'line-dasharray': [2, 2],
            'line-opacity': 0.95
          }
        });
      });

      hubs.forEach((hub) => {
        const el = document.createElement('div');
        el.className = 'mova-beacon-marker';
        el.innerHTML = '<div class="mova-beacon-pulse"></div><div class="mova-beacon-core"></div>';

        const popupContent = 
          '<div class="mova-popup-card">' +
            '<small>' + hub.badge + '</small>' +
            '<h4>' + hub.name + '</h4>' +
            '<p><strong>' + hub.subtitle + '</strong><br>' + hub.desc + '</p>' +
          '</div>';

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat(hub.coords)
          .addTo(map);

        el.setAttribute('role', 'button');
        el.setAttribute('tabindex', '0');
        el.setAttribute('aria-label', hub.name);
        el.style.cursor = 'pointer';
        el.addEventListener('click', (e) => { e.stopPropagation(); selectHub(hub.id, true); });
        el.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectHub(hub.id, true); }
        });

        markerMap[hub.id] = { marker, el, html: popupContent, coords: hub.coords };
      });

      const hubButtons = document.querySelectorAll('.hub-pill-btn');
      hubButtons.forEach((btn) => {
        btn.addEventListener('click', () => selectHub(btn.getAttribute('data-hub'), true));
      });
      selectHub('vi', false);

    } catch (err) {
      console.warn('OpenMapTiles MapLibre initialization notice:', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOpenMapTiles);
  } else {
    initOpenMapTiles();
  }

  // =========================================================================
  // 9. Flagship Smartphone Interactive Showcase with Auto-Advance & Car Glide
  // =========================================================================
  const appTabButtons = document.querySelectorAll('[data-app-tab]');
  const phonePanes = {
    mode: document.getElementById('pane-mode'),
    journey: document.getElementById('pane-journey'),
    dispatch: document.getElementById('pane-dispatch')
  };

  let activeShowcaseTab = 'mode';
  let showcaseInterval = null;

  function switchPhoneTab(tabKey) {
    activeShowcaseTab = tabKey;
    appTabButtons.forEach((btn) => {
      const isTarget = btn.getAttribute('data-app-tab') === tabKey;
      btn.classList.toggle('is-active', isTarget);
      btn.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });

    Object.keys(phonePanes).forEach((key) => {
      const pane = phonePanes[key];
      if (pane) {
        pane.classList.toggle('is-active', key === tabKey);
      }
    });

    if (tabKey === 'journey') {
      const car = document.getElementById('moving-car');
      if (car) {
        car.style.animation = 'none';
        void car.offsetWidth;
        car.style.animation = 'car-glide 5s cubic-bezier(0.4, 0, 0.2, 1) infinite';
      }
    }
  }

  appTabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-app-tab');
      if (tab) {
        switchPhoneTab(tab);
        pauseShowcaseTimer();
      }
    });
  });

  function startShowcaseTimer() {
    pauseShowcaseTimer();
    showcaseInterval = setInterval(() => {
      const tabs = ['mode', 'journey', 'dispatch'];
      const currentIndex = tabs.indexOf(activeShowcaseTab);
      const nextTab = tabs[(currentIndex + 1) % tabs.length];
      switchPhoneTab(nextTab);
    }, 6500);
  }

  function pauseShowcaseTimer() {
    if (showcaseInterval) {
      clearInterval(showcaseInterval);
      showcaseInterval = null;
    }
  }

  const phoneChassis = document.querySelector('.phone-chassis');
  if (phoneChassis) {
    phoneChassis.addEventListener('mouseenter', pauseShowcaseTimer);
    phoneChassis.addEventListener('mouseleave', () => {
      if (!showcaseInterval) startShowcaseTimer();
    });
    startShowcaseTimer();
  }

  const phoneModeItems = document.querySelectorAll('.phone-mode-item');
  const phoneRequestBtn = document.getElementById('phone-request-btn');
  let phoneMode = 'offer';

  function phoneModePrice(item) {
    const em = item ? item.querySelector('em') : null;
    return em ? em.textContent.trim() : '';
  }

  function updatePhoneRequestLabel() {
    if (!phoneRequestBtn) return;
    const item = document.querySelector('.phone-mode-item[data-phone-mode="' + phoneMode + '"]');
    const price = phoneModePrice(item);
    if (phoneMode === 'offer') phoneRequestBtn.textContent = 'Submit Offer (' + price + ')';
    else if (phoneMode === 'fixed') phoneRequestBtn.textContent = 'Confirm Fixed Price (' + price + ')';
    else phoneRequestBtn.textContent = 'Start Metered Trip';
  }

  phoneModeItems.forEach((item) => {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    function choose() {
      phoneModeItems.forEach((i) => i.classList.remove('is-selected'));
      item.classList.add('is-selected');
      phoneMode = item.getAttribute('data-phone-mode') || 'offer';
      updatePhoneRequestLabel();
      item.classList.remove('value-pop');
      void item.offsetWidth;
      item.classList.add('value-pop');
      pauseShowcaseTimer();
    }
    item.addEventListener('click', choose);
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(); }
    });
  });
  updatePhoneRequestLabel();
  document.addEventListener('mova-fares', updatePhoneRequestLabel);

  let requestBusy = false;
  phoneRequestBtn?.addEventListener('click', () => {
    if (requestBusy) return;
    requestBusy = true;
    pauseShowcaseTimer();
    const original = phoneRequestBtn.textContent;
    phoneRequestBtn.classList.add('is-loading');
    phoneRequestBtn.textContent = 'Matching you with a driver...';
    setTimeout(() => {
      phoneRequestBtn.classList.remove('is-loading');
      updatePhoneRequestLabel();
      requestBusy = false;
      switchPhoneTab('journey');
    }, 1200);
  });

  // Dispatch steps: clickable and auto-advancing
  const dispatchSteps = document.querySelectorAll('.dispatch-step');
  let dispatchStage = 0;
  let dispatchTimer = null;
  function setDispatchStage(n) {
    dispatchStage = n % Math.max(dispatchSteps.length, 1);
    dispatchSteps.forEach((step, idx) => {
      step.classList.toggle('is-complete', idx < dispatchStage);
      step.classList.toggle('is-active', idx === dispatchStage);
      const i = step.querySelector('i');
      if (i) i.textContent = idx < dispatchStage ? '✓' : String(idx + 1);
    });
  }
  if (dispatchSteps.length) {
    dispatchSteps.forEach((step, idx) => {
      step.style.cursor = 'pointer';
      step.addEventListener('click', () => {
        setDispatchStage(idx);
        if (dispatchTimer) { clearInterval(dispatchTimer); dispatchTimer = null; }
      });
    });
    dispatchTimer = setInterval(() => {
      if (activeShowcaseTab === 'dispatch') setDispatchStage(dispatchStage + 1);
    }, 2200);
    setDispatchStage(0);
  }
  document.querySelectorAll('.phone-parcel-code').forEach((code) => {
    code.style.cursor = 'pointer';
    code.addEventListener('click', () => {
      const original = code.getAttribute('data-orig') || code.textContent;
      code.setAttribute('data-orig', original);
      try { if (navigator.clipboard) navigator.clipboard.writeText(original.trim()); } catch (e) {}
      code.textContent = 'Copied ✓';
      setTimeout(() => { code.textContent = original; }, 1400);
    });
  });

  // Arrow-key navigation on the tab list
  appTabButtons.forEach((btn, idx) => {
    btn.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const dir = e.key === 'ArrowRight' ? 1 : -1;
      const nextBtn = appTabButtons[(idx + dir + appTabButtons.length) % appTabButtons.length];
      nextBtn.focus();
      nextBtn.click();
    });
  });

  // =========================================================================
  // 10. Single-open Accordion for FAQ
  // =========================================================================
  const allDetails = document.querySelectorAll('.faq-list details');
  allDetails.forEach((targetDetail) => {
    targetDetail.addEventListener('toggle', () => {
      if (targetDetail.open) {
        allDetails.forEach((detail) => {
          if (detail !== targetDetail && detail.open) {
            detail.removeAttribute('open');
          }
        });
      }
    });
  });

  // =========================================================================
  // 11. Global GeoIP Detection & Locale Selector Modal
  // =========================================================================
  (function initGeoIPAndLocale() {
    const supportedLocales = ['en-ng', 'en-gh', 'en-ke', 'en-za', 'en-gb', 'en'];
    const currentPath = window.location.pathname;
    const pathSegments = currentPath.split('/').filter(Boolean);
    const firstSeg = pathSegments[0]?.toLowerCase();
    const hasLocalePrefix = supportedLocales.includes(firstSeg);

    const headerFlag = document.getElementById('header-region-flag');
    const headerName = document.getElementById('header-region-name');
    const mobileFlag = document.getElementById('mobile-region-flag');
    const mobileName = document.getElementById('mobile-region-name');
    const regionCards = document.querySelectorAll('.region-card');

    const regionData = {
      'en-ng': { flag: '🇳🇬', name: 'Nigeria (EN)' },
      'en-gh': { flag: '🇬🇭', name: 'Ghana (EN)' },
      'en-ke': { flag: '🇰🇪', name: 'Kenya (EN)' },
      'en-za': { flag: '🇿🇦', name: 'South Africa (EN)' },
      'en-gb': { flag: '🇬🇧', name: 'United Kingdom (EN)' },
      'en': { flag: '🌐', name: 'International (EN)' }
    };

    function updateHeaderDisplay(code) {
      const info = regionData[code] || regionData['en-ng'];
      if (headerFlag) headerFlag.textContent = info.flag;
      if (headerName) headerName.textContent = info.name;
      if (mobileFlag) mobileFlag.textContent = info.flag;
      if (mobileName) mobileName.textContent = info.name;

      regionCards.forEach(card => {
        card.classList.toggle('is-active', card.getAttribute('data-region') === code);
      });
    }

    let activeLocale = hasLocalePrefix ? firstSeg : (safeGetStorage('mova_region') || 'en-ng');
    updateHeaderDisplay(activeLocale);

    if (!safeGetStorage('mova_region_manual') && !hasLocalePrefix) {
      fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => {
          const country = data.country_code?.toUpperCase();
          let detected = 'en-ng';
          if (country === 'GH') detected = 'en-gh';
          else if (country === 'KE') detected = 'en-ke';
          else if (country === 'ZA') detected = 'en-za';
          else if (country === 'GB') detected = 'en-gb';
          else if (country !== 'NG') detected = 'en';

          updateHeaderDisplay(detected);
          safeSetStorage('mova_region', detected);
        })
        .catch(() => {
          updateHeaderDisplay('en-ng');
        });
    }

    const regionModal = document.getElementById('region-modal');
    const openBtn = document.getElementById('region-selector-open');
    const mobileOpenBtn = document.getElementById('mobile-region-selector-open');
    const closeBtn = document.getElementById('region-modal-close');
    const searchInput = document.getElementById('region-search-input');

    function openRegionModal() {
      if (regionModal) {
        regionModal.style.display = 'flex';
        searchInput?.focus();
      }
    }
    function closeRegionModal() {
      if (regionModal) {
        regionModal.style.display = 'none';
      }
    }

    openBtn?.addEventListener('click', openRegionModal);
    mobileOpenBtn?.addEventListener('click', () => {
      closeMenu();
      openRegionModal();
    });
    closeBtn?.addEventListener('click', closeRegionModal);
    regionModal?.addEventListener('click', (e) => {
      if (e.target === regionModal) closeRegionModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && regionModal && regionModal.style.display !== 'none') {
        closeRegionModal();
      }
    });

    searchInput?.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      regionCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(q) ? 'grid' : 'none';
      });
    });

    regionCards.forEach(card => {
      card.addEventListener('click', () => {
        const selectedCode = card.getAttribute('data-region');
        safeSetStorage('mova_region', selectedCode);
        safeSetStorage('mova_region_manual', 'true');
        updateHeaderDisplay(selectedCode);
        closeRegionModal();

        const sub = hasLocalePrefix ? (currentPath.substring(firstSeg.length + 1) || '/') : currentPath;
        const cleanSub = sub.startsWith('/') ? sub : '/' + sub;
        if (selectedCode === 'en-ng') {
          window.location.href = '/en-ng' + cleanSub;
        } else if (hasLocalePrefix) {
          window.location.href = cleanSub === '/' ? '/en-ng/' : cleanSub;
        }
      });
    });
  })();

  // =========================================================================
  // 12. Driver Earnings Calculator (Drive Page)
  // =========================================================================
  (function initDriverCalc() {
    const slider = document.getElementById('drive-trips-slider');
    const tripsVal = document.getElementById('drive-trips-val');
    const grossElem = document.getElementById('calc-gross');
    const feeElem = document.getElementById('calc-fee');
    const netElem = document.getElementById('calc-net');
    const savingsElem = document.getElementById('calc-monthly-savings');
    const noteElem = document.getElementById('calc-extra-note');
    const tierBtns = document.querySelectorAll('.category-tier-btn');

    if (!slider) return;

    let avgFare = 4200;

    tierBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tierBtns.forEach(b => {
          b.classList.remove('is-active');
          b.style.borderColor = 'var(--border-subtle)';
          b.style.background = 'white';
        });
        btn.classList.add('is-active');
        btn.style.borderColor = 'var(--mova-green-500)';
        btn.style.background = '#eef9f2';

        const tier = btn.getAttribute('data-tier');
        if (tier === 'economy') avgFare = 4200;
        else if (tier === 'comfort') avgFare = 6500;
        else if (tier === 'xl') avgFare = 9800;
        calculate();
      });
    });

    function formatNaira(num) {
      return '₦' + Math.round(num).toLocaleString('en-US');
    }

    function calculate() {
      const trips = parseInt(slider.value, 10);
      if (tripsVal) tripsVal.textContent = trips + ' trips';
      const gross = trips * avgFare;
      const movaFee = gross * 0.10;
      const movaNet = gross - movaFee;
      const competitorFee = gross * 0.25;
      const competitorNet = gross - competitorFee;
      const weeklyDifference = movaNet - competitorNet;
      const monthlySavings = weeklyDifference * 4;

      if (grossElem) grossElem.textContent = formatNaira(gross);
      if (feeElem) feeElem.textContent = '-' + formatNaira(movaFee);
      if (netElem) netElem.textContent = formatNaira(movaNet);
      if (savingsElem) savingsElem.textContent = '+' + formatNaira(monthlySavings) + ' / month';
      if (noteElem) noteElem.innerHTML = 'You earn <strong>+' + formatNaira(weeklyDifference) + ' more</strong> every week!';
    }

    slider.addEventListener('input', calculate);
    calculate();
  })();

  // =========================================================================
  // 13. City Directory Search & Interactive Filtering (Cities Page)
  // =========================================================================
  (function initCityFilters() {
    const searchInput = document.getElementById('city-search-input');
    const cards = document.querySelectorAll('.city-metro-card');
    const filterBtns = document.querySelectorAll('#city-filter-pills .city-filter-btn');
    const noResults = document.getElementById('no-city-results');
    const voteForm = document.getElementById('city-vote-form');
    const voteSuccess = document.getElementById('city-vote-success');

    if (!cards.length) return;

    let currentFilter = 'all';

    function applyFilter() {
      const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
      let visibleCount = 0;

      cards.forEach(card => {
        const cityData = card.getAttribute('data-city') || '';
        const cardText = card.textContent.toLowerCase();
        const isActive = card.getAttribute('data-active') === 'true';
        const region = card.getAttribute('data-region') || '';

        let matchesTab = true;
        if (currentFilter === 'active') matchesTab = isActive;
        else if (currentFilter === 'nigeria') matchesTab = region === 'nigeria';
        else if (currentFilter === 'international') matchesTab = region === 'international';

        const matchesSearch = !query || cityData.includes(query) || cardText.includes(query);

        if (matchesTab && matchesSearch) {
          card.style.display = 'block';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (noResults) {
        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    }

    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        filterBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        currentFilter = btn.getAttribute('data-city-filter') || 'all';
        applyFilter();
      });
    });

    searchInput?.addEventListener('input', applyFilter);

    voteForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      if (voteSuccess) {
        voteSuccess.style.display = 'block';
        voteForm.reset();
        setTimeout(() => {
          voteSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
    });
  })();

  // =========================================================================
  // 14. Help Center Live Search & Ticketing (Help Page)
  // =========================================================================
  (function initHelpCenter() {
    const searchInput = document.getElementById('help-search-input');
    const categoryBtns = document.querySelectorAll('.help-category-btn');
    const faqDetails = document.querySelectorAll('#help-faq-group details');
    const noResults = document.getElementById('no-faq-results');
    const ticketForm = document.getElementById('support-ticket-form');
    const ticketSuccess = document.getElementById('ticket-success');
    const ticketRefId = document.getElementById('ticket-ref-id');

    if (!faqDetails.length) return;

    let currentCat = 'all';

    function filterFaqs() {
      const q = searchInput ? searchInput.value.toLowerCase().trim() : '';
      let visibleCount = 0;

      faqDetails.forEach(detail => {
        const cat = detail.getAttribute('data-cat');
        const keywords = (detail.getAttribute('data-keywords') || '') + ' ' + detail.textContent.toLowerCase();

        const matchesCat = currentCat === 'all' || cat === currentCat;
        const matchesSearch = !q || keywords.includes(q);

        if (matchesCat && matchesSearch) {
          detail.style.display = 'block';
          visibleCount++;
          if (q) detail.setAttribute('open', '');
        } else {
          detail.style.display = 'none';
          detail.removeAttribute('open');
        }
      });

      if (noResults) {
        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    }

    categoryBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        categoryBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        currentCat = btn.getAttribute('data-help-cat') || 'all';
        filterFaqs();
      });
    });

    searchInput?.addEventListener('input', filterFaqs);

    ticketForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const randomId = '#MOV-' + Math.floor(10000 + Math.random() * 90000);
      const val = (id) => (document.getElementById(id)?.value || '').trim();
      const catEl = document.getElementById('ticket-category');
      const category = catEl && catEl.selectedIndex >= 0 ? catEl.options[catEl.selectedIndex].text : '';
      const subject = 'Mova Support Ticket ' + randomId + ' — ' + category;
      const body = [
        'Mova Support Ticket ' + randomId,
        'Name: ' + val('ticket-name'),
        'Contact: ' + val('ticket-email'),
        'Topic: ' + category,
        'Trip/Order ID: ' + (val('ticket-trip-id') || 'N/A'),
        '',
        val('ticket-message')
      ].join('\r\n');
      const mailtoUrl = 'mailto:info@ridebymova.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      if (ticketRefId) ticketRefId.textContent = randomId;
      if (ticketSuccess) ticketSuccess.style.display = 'block';
      ticketForm.reset();
      window.location.href = mailtoUrl;
    });
  })();

})();
