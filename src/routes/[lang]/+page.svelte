<script>
  import { t } from '$lib/translations';
  import Card from "$lib/client/components/card.svelte";
  import verticalTransition from "$lib/client/transitions/verticalTransition";
  import { fade } from "svelte/transition";

  const BIG_IMAGE="https://images.unsplash.com/photo-1594771804886-a933bb2d609b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGFncmljdWx0dXJlfGVufDB8fDB8fHww";
</script>

<svelte:head>
  <title>{$t('home.title')}</title>
  <meta name="description" content={$t('home.description')} />
  <link rel="preload" as="image" href={BIG_IMAGE}>
</svelte:head>

<main in:fade out:verticalTransition>
  <section class="hero-section">
    <h1 class="hero-title">{$t('home.hero_title')}</h1>
    <p class="hero-description">
      {$t('home.hero_description')}
    </p>
    <a class="main-btn" href="/products">{$t('home.hero_button')}</a>
  </section>

  <section class="about-section">
    <h2 class="about-title">{$t('home.about_title')}</h2>
    <p class="about-description">
      {$t('home.about_description')}
    </p>
  </section>

  <section class="how-it-works-section">
    <h2 class="section-title">{$t('home.how_it_works_title')}</h2>
    <div class="steps">
      <Card class="step">
        <h3 class="step-title">{$t('home.step_1_title')}</h3>
        <p>{$t('home.step_1_description')}</p>
      </Card>
      <Card class="step">
        <h3 class="step-title">{$t('home.step_2_title')}</h3>
        <p>{$t('home.step_2_description')}</p>
      </Card>
      <Card class="step">
        <h3 class="step-title">{$t('home.step_3_title')}</h3>
        <p>{$t('home.step_3_description')}</p>
      </Card>
    </div>
  </section>

  <section class="cta-section">
    <h2 class="cta-title">{$t('home.cta_title')}</h2>
    <p class="cta-description">
      {$t('home.cta_description')}
    </p>
    <a href="/register" class="main-btn">{$t('home.cta_button')}</a>
  </section>
</main>

<style>
  :root {
    --cool-background-url: url("https://images.unsplash.com/photo-1594771804886-a933bb2d609b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGFncmljdWx0dXJlfGVufDB8fDB8fHww");
  }

  section {
    padding: 2.5rem 0;
    margin-bottom: 1.5rem;
  }

  /* Hero Section */
  .hero-section {
    text-align: center;
    background-color: #d1f7e1;
    height: 60vh;
    background-size: cover;

    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    background-image: var(--cool-background-url);
  }

  .hero-title {
    font-size: clamp(1.75rem, 5vw, 2.5rem);
    font-weight: bold;
    color: #2b6e30;
    margin-top: 0.2rem;
    margin-bottom: 1rem;
    line-height: 1.3;
  }

  .hero-description {
    font-size: clamp(1.1rem, 2.5vw, 1.375rem);
    color: #4c4c4c;
    margin: auto;
    margin-bottom: 1.75rem;
    max-width: 800px;
    padding: 0 0.5rem;
  }
  
  .cta-section {
    margin: auto 1rem;
  }

  .main-btn {
    display: inline-block;
    background-color: var(--button-primary-bg);
    color: var(--button-text-color);
    padding: 0.9rem 2rem;
    font-size: clamp(1.1rem, 2.5vw, 1.25rem);
    border-radius: 8px;
    text-decoration: none;
  }

  .main-btn:hover {
    background-color: var(--button-primary-hover-bg);
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  /* About Section */
  .about-section {
    text-align: center;
    padding: 2.5rem 0;
  }

  .about-title {
    font-size: clamp(1.5rem, 4vw, 2rem);
    font-weight: bold;
    margin-bottom: 1.5rem;
  }

  .about-description {
    font-size: clamp(1rem, 2.5vw, 1.125rem);
    max-width: 800px;
    margin: 0 auto;
    line-height: 1.7;
    text-align: center;
    padding: 0 1rem;
  }

  /* How it Works Section */
  .how-it-works-section {
    padding: 2.5rem 1rem;
    background-color: var(--color-bg-active);
    border-radius: 15px;
    margin: 2rem 0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .section-title,
  .cta-title {
    font-size: clamp(1.5rem, 4vw, 2rem);
    font-weight: bold;
    text-align: center;
    margin-bottom: 2rem;
    /* color: #2b6e30; */
  }

  .steps {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 0 1rem;
  }

  :global(.step){
    padding: 20px 15px;
  }

  :global(.step) h3{
    margin-top: 0;
    
    font-size: clamp(1.25rem, 3vw, 1.5rem);
    margin-bottom: 0.5rem;
  }

  :global(.step) p {
    color: var(--color-text-secondary);
    margin: 0;
    font-size: clamp(1rem, 2.5vw, 1.1rem);
    line-height: 1.6;
  }

  /* CTA Section */
  .cta-section {
    text-align: center;
    padding: 3rem 0;
  }

  .cta-description {
    font-size: clamp(1rem, 2.5vw, 1.25rem);
    margin-bottom: 2rem;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.7;
  }

  /* Responsive Adjustments */
  @media (min-width: 768px) {
    section {
      padding: 3.5rem 0;
    }

    .hero-section {
      padding: 4rem 2rem;
      height: 75vh;
    }

    .steps {
      flex-direction: row;
      justify-content: space-between;
    }

    :global(.step) {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .about-description {
      text-align: center;
    }
  }

  @media (min-width: 1024px) {
    .how-it-works-section {
      padding: 3rem 2rem;
    }

    :global(.step) {
      padding: 2rem;
    }
  }
  @media (min-width: 1280px) {
    .hero-section {
      height: 93vh;
    }
  }
</style>
