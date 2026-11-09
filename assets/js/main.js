/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');

const setNavMenuOpen = (isOpen) => {
   if (!navMenu || !navToggle) return;

   navMenu.classList.toggle('show-menu', isOpen);
   navToggle.setAttribute('aria-expanded', String(isOpen));
};

if (navToggle && navMenu) {
   navToggle.setAttribute('aria-expanded', 'false');
   navToggle.addEventListener('click', () => setNavMenuOpen(true));
}

/*=============== REMOVE MENU MOBILE ===============*/
if (navClose && navMenu) {
   navClose.addEventListener('click', () => setNavMenuOpen(false));
}

document.querySelectorAll('.nav__link').forEach((link) => {
   link.addEventListener('click', () => setNavMenuOpen(false));
});

/*=============== ADD BLUR TO HEADER ===============*/
const header = document.getElementById('header');
const scrollUp = document.getElementById('scroll-up');

const handleScroll = () => {
   if (header) header.classList.toggle('scroll-header', window.scrollY >= 50);
   if (scrollUp) scrollUp.classList.toggle('show-scroll', window.scrollY >= 350);
};

window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll();

/*=============== EMAIL JS ===============*/


/*=============== SHOW SCROLL UP ===============*/ 


/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav__link');

const updateActiveLink = () => {
   const currentPosition = window.scrollY + 120;
   sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      if (currentPosition >= sectionTop && currentPosition < sectionBottom) {
         navLinks.forEach((link) => {
            link.classList.toggle('active-link', link.getAttribute('href') === `#${section.id}`);
         });
      }
   });
};

window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();

/*=============== PROJECT DETAILS ===============*/
const projectDialog = document.getElementById('project-dialog');
const projectCards = document.querySelectorAll('.project-card[aria-haspopup="dialog"]');
const projectDialogClose = projectDialog?.querySelector('.project-dialog__close');
const kpiGallery = projectDialog?.querySelector('#project-dialog-kpi-gallery');
const kpiPreview = projectDialog?.querySelector('#kpi-preview');
const kpiPreviewTitle = kpiPreview?.querySelector('.kpi-preview__title');
const kpiPreviewImage = kpiPreview?.querySelector('img');

const hideKpiPreview = () => {
   if (kpiPreview?.matches(':popover-open')) kpiPreview.hidePopover();
};

const showKpiPreview = (trigger) => {
   if (!kpiPreview || !kpiPreviewTitle || !kpiPreviewImage) return;

   kpiPreviewTitle.textContent = trigger.textContent.trim();
   kpiPreviewImage.src = trigger.dataset.kpiImage;
   kpiPreviewImage.alt = trigger.dataset.kpiAlt;

   if (!kpiPreview.matches(':popover-open')) kpiPreview.showPopover();

   const triggerBounds = trigger.getBoundingClientRect();
   const previewBounds = kpiPreview.getBoundingClientRect();
   const left = Math.max(12, Math.min(
      triggerBounds.left + (triggerBounds.width - previewBounds.width) / 2,
      window.innerWidth - previewBounds.width - 12,
   ));
   const top = triggerBounds.bottom + previewBounds.height + 12 <= window.innerHeight
      ? triggerBounds.bottom + 8
      : Math.max(12, triggerBounds.top - previewBounds.height - 8);

   kpiPreview.style.left = `${left}px`;
   kpiPreview.style.top = `${top}px`;
};

kpiGallery?.querySelectorAll('.kpi-preview-trigger').forEach((trigger) => {
   trigger.setAttribute('aria-haspopup', 'dialog');
   trigger.setAttribute('aria-controls', 'kpi-preview');
   trigger.addEventListener('click', () => {
      if (kpiPreview?.matches(':popover-open') && kpiPreviewTitle?.textContent === trigger.textContent.trim()) {
         hideKpiPreview();
      } else {
         showKpiPreview(trigger);
      }
   });
});

kpiPreview?.querySelector('.kpi-preview__close')?.addEventListener('click', hideKpiPreview);

document.addEventListener('click', (event) => {
   if (
      kpiPreview?.matches(':popover-open')
      && !kpiPreview.contains(event.target)
      && !event.target.closest('.kpi-preview-trigger')
   ) {
      hideKpiPreview();
   }
});

document.addEventListener('keydown', (event) => {
   if (event.key === 'Escape') hideKpiPreview();
});

const openProjectDialog = (card) => {
   if (!projectDialog || projectDialog.open) return;

   const title = card.querySelector('h3')?.textContent?.trim();
   if (!title) return;

   const projectImage = projectDialog.querySelector('#project-dialog-image');
   projectImage.src = card.dataset.image;
   projectImage.alt = `${title} project preview`;
   projectDialog.querySelector('#project-dialog-eyebrow').textContent =
      card.dataset.eyebrow || 'Demo content · Replace with your project details';
   projectDialog.querySelector('#project-dialog-title').textContent = title;
   projectDialog.querySelector('#project-dialog-summary').textContent = card.dataset.summary;
   projectDialog.querySelector('#project-dialog-objective-title').textContent =
      card.dataset.objectiveTitle || 'Objective';
   projectDialog.querySelector('#project-dialog-objective').textContent = card.dataset.objective;
   projectDialog.querySelector('#project-dialog-approach-title').textContent =
      card.dataset.approachTitle || 'Sample approach';
   const approach = projectDialog.querySelector('#project-dialog-approach');
   const approachParagraphs = (card.dataset.approach || '').split('\n\n').map((text) => {
      const paragraph = document.createElement('p');
      const labelEnd = text.indexOf(': ');

      if (labelEnd > 0) {
         const label = document.createElement('strong');
         label.textContent = `${text.slice(0, labelEnd)}: `;
         paragraph.append(label, text.slice(labelEnd + 2));
      } else {
         paragraph.textContent = text;
      }

      return paragraph;
   });
   approach.replaceChildren(...approachParagraphs);
   projectDialog.querySelector('#project-dialog-outcome-title').textContent =
      card.dataset.outcomeTitle || 'Demo outcome';
   projectDialog.querySelector('#project-dialog-outcome').textContent = card.dataset.outcome;
   projectDialog.querySelector('#project-dialog-metric').textContent = card.dataset.metric;
   projectDialog.querySelector('#project-dialog-note').textContent =
      card.dataset.note || 'All figures and details in this panel are placeholders for demonstration.';
   projectDialog.querySelector('#project-dialog-references').hidden =
      card.dataset.prepCase !== 'true';
   if (kpiGallery) kpiGallery.hidden = card.dataset.kpiGallery !== 'true';
   hideKpiPreview();
   projectDialog.showModal();
   projectDialog.scrollTop = 0;
   document.documentElement.classList.add('project-dialog-open');
};

projectCards.forEach((card) => {
   card.addEventListener('click', () => openProjectDialog(card));
   card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
         event.preventDefault();
         openProjectDialog(card);
      }
   });
});

projectDialogClose?.addEventListener('click', () => projectDialog.close());

projectDialog?.addEventListener('click', (event) => {
   if (event.target === projectDialog) projectDialog.close();
});

projectDialog?.addEventListener('close', () => {
   hideKpiPreview();
   document.documentElement.classList.remove('project-dialog-open');
});

const currentYear = document.getElementById('current-year');
if (currentYear) currentYear.textContent = new Date().getFullYear();

/*=============== SCROLL REVEAL ANIMATION ===============*/
if (typeof ScrollReveal === 'function') {
   const reveal = ScrollReveal({
      origin: 'bottom',
      distance: '24px',
      duration: 900,
      delay: 100,
      reset: false,
   });

   reveal.reveal('.home__data, .section__subtitle, .section__title');
   reveal.reveal('.home__visual, .about__container, .skills__container, .services__container, .projects__container, .contact__container', { delay: 180 });
}
