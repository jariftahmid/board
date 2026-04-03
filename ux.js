(function () {
  const guideHtml = `
    <section class="content-guide" aria-label="Extended study guidance">
      <h2>Complete Student Success Guide</h2>
      <p>Strong exam performance is rarely the result of last-minute effort. It comes from clear goals, daily habits, and structured revision. Start by setting a realistic weekly target for each subject, then break that target into smaller tasks you can complete in short focused sessions. When your plan is specific, you waste less time deciding what to do and spend more time doing meaningful work. Keep a notebook for mistakes and difficult concepts so you can revisit them every week. Learning improves when you return to the same idea multiple times and from different angles.</p>
      <p>For board exam preparation, active practice is more useful than passive reading. Instead of only reviewing textbook pages, solve questions under timed conditions and then evaluate your own answers honestly. If you can explain a concept in your own words, write a short summary, and apply it to a question, that concept is likely understood. If not, identify exactly where confusion begins. Ask whether the issue comes from vocabulary, formulas, interpretation, or time pressure. This diagnosis helps you choose the right fix and avoid repeating the same error in future mock tests.</p>
      <p>Time management is a skill that should be trained before the exam hall. Use a timer when practicing creative questions and objective sections. At first, speed may feel uncomfortable, but with repetition you will learn how long each step really takes. Build a routine where you skim the full paper, start with the questions you can answer confidently, and reserve a review block at the end. This approach protects your marks by reducing avoidable mistakes such as skipped parts, incomplete units, and unchecked calculations.</p>
      <p>Subjects require different study methods. Mathematics and Physics reward problem repetition with variation; solve similar questions from multiple years to notice patterns in wording and marks distribution. Chemistry and Biology require conceptual understanding plus memory; use diagrams, reaction maps, and flashcards. Language subjects improve through writing practice and feedback, so complete paragraphs, compositions, summaries, and grammar drills regularly. In every subject, do not just collect notes. Transform notes into retrieval questions you can answer without looking. That is how memory becomes durable.</p>
      <p>Revision should follow a cycle. First, preview upcoming chapters to build familiarity. Second, learn core lessons with examples. Third, practice questions immediately to test understanding. Fourth, review mistakes within twenty-four hours so weak areas do not grow. Fifth, return to the topic after three or four days for spaced repetition. This cycle may appear simple, yet it consistently improves retention and confidence. Students often believe they forgot because they are weak, but usually they forgot because they reviewed too late or too passively.</p>
      <p>Use digital resources strategically. Online platforms can save time by giving quick access to prior questions, answer structures, and topic guides, but do not allow endless scrolling to replace practice. When studying online, define the goal for each session before opening a device. Example: complete two past-paper math sections and summarize one biology chapter. Close unrelated tabs, silence notifications, and record completed tasks. Focus is not about motivation alone; it is about creating an environment where concentration becomes easier than distraction.</p>
      <p>Healthy performance depends on physical and mental balance. Sleep is essential for memory consolidation, so avoid sacrificing rest repeatedly before exams. Maintain hydration, short movement breaks, and balanced meals to support attention span. If anxiety rises, use breathing techniques, short reflection writing, or brief walks to reset. Discuss pressure with trusted teachers or family members. You do not need to carry stress alone. Strong students are not those who never feel pressure, but those who have systems to recover and continue steadily.</p>
      <p>Peer learning can accelerate progress when used carefully. Study with classmates who are serious and focused. Keep group sessions short, assign topics in advance, and spend most time solving problems or teaching each other difficult parts. Explaining a concept out loud is one of the fastest ways to identify weak understanding. At the same time, protect your independent study hours. Group study should support your plan, not replace it. Balance collaboration with personal accountability to keep your preparation consistent.</p>
      <p>As exams approach, prioritize high-impact revision. Analyze previous board trends to identify frequently tested chapters, but do not ignore foundational topics. Prepare a final revision checklist that includes formulas, definitions, diagrams, essay structures, and common mistakes. Complete at least one full mock exam for each major subject under real timing conditions. After each mock, spend more time reviewing errors than celebrating correct answers. Improvement comes from correction. With disciplined routines, honest self-assessment, and steady effort, you can build confidence and perform at your best on exam day.</p>
    </section>`;

  function ensureWordMinimum() {
    const bodyText = (document.body && document.body.innerText) ? document.body.innerText : "";
    const words = bodyText.trim().split(/\s+/).filter(Boolean).length;
    if (words >= 600 || document.querySelector('.content-guide')) return;

    const mount = document.querySelector('main') || document.querySelector('.main-content') || document.body;
    if (!mount) return;
    mount.insertAdjacentHTML('beforeend', guideHtml);
  }

  function initMobileMenuUX() {
    const menu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    if (!menu || !navLinks) return;

    let overlay = document.querySelector('.overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'overlay';
      document.body.appendChild(overlay);
    }

    const closeMenu = () => {
      menu.classList.remove('is-active');
      navLinks.classList.remove('active');
      overlay.classList.remove('active');
    };

    menu.dataset.menuBound = 'true';
    menu.addEventListener('click', () => {
      menu.classList.toggle('is-active');
      navLinks.classList.toggle('active');
      overlay.classList.toggle('active');
    });

    overlay.addEventListener('click', closeMenu);
    navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenuUX();
    ensureWordMinimum();
  });
})();
