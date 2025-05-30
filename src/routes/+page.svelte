<script>
  import Card from "$lib/client/components/card.svelte";
  import verticalTransition from "$lib/client/transitions/verticalTransition";
  import { fade } from "svelte/transition";
</script>

<svelte:head>
  <title>MerrBio</title>
  <meta name="description" content="Welcome to MerrBio" />
</svelte:head>

<main in:fade out:verticalTransition>
  <section class="hero-section">
    <h1 class="hero-title">Mirë se vini në MerrBio 🌿</h1>
    <p class="hero-description">
      Lidh konsumatorët me fermerët vendas për ushqim të freskët dhe organik.
    </p>
    <a class="main-btn" href="/products">Shfleto Produktet</a>
  </section>

  <section class="about-section">
    <h2 class="about-title">Çfarë është MerrBio?</h2>
    <p class="about-description">
      MerrBio është një platformë që ndihmon fermerët vendas të shesin
      drejtpërdrejt tek konsumatorët që kërkojnë cilësi, freski dhe produkte
      organike. Misioni ynë është të forcojmë ekonominë lokale dhe të promovojmë
      qëndrueshmërinë.
    </p>
  </section>

  <section class="how-it-works-section">
    <h2 class="section-title">Si funksionon?</h2>
    <div class="steps">
      <Card class="step">
        <h3 class="step-title">1. Regjistrohu</h3>
        <p>Krijo një llogari si fermer ose konsumator.</p>
      </Card>
      <Card class="step">
        <h3 class="step-title">2. Publiko ose shfleto</h3>
        <p>Fermerët publikojnë produkte, konsumatorët i shfletojnë.</p>
      </Card>
      <Card class="step">
        <h3 class="step-title">3. Bëj kërkesë</h3>
        <p>Bli direkt nga fermeri – pa ndërmjetës!</p>
      </Card>
    </div>
  </section>

  <section class="cta-section">
    <h2 class="cta-title">Gati për të filluar?</h2>
    <p class="cta-description">
      Bashkohu me qindra përdorues që besojnë tek produktet lokale dhe të
      freskëta.
    </p>
    <a href="/register" class="main-btn">Regjistrohu Tani</a>
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
