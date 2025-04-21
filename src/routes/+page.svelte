<script>

    import { fade } from "svelte/transition";

</script>
<svelte:head>
  <title>MerrBio</title>
  <meta name="description" content="Welcome to MerrBio" />
</svelte:head>

<main transition:fade={{duration:200}}>
  <section class="hero-section">
    <h1 class="hero-title">Mirë se vini në MerrBio 🌿</h1>
    <p class="hero-description">Lidh konsumatorët me fermerët vendas për ushqim të freskët dhe organik.</p>
    <a class="explore-button" href="/products">Shfleto Produktet</a>
  </section>
  
  <section class="about-section">
    <h2 class="about-title">Çfarë është MerrBio?</h2>
    <p class="about-description">
      MerrBio është një platformë që ndihmon fermerët vendas të shesin drejtpërdrejt tek konsumatorët që kërkojnë cilësi, freski dhe produkte organike. Misioni ynë është të forcojmë ekonominë lokale dhe të promovojmë qëndrueshmërinë.
    </p>
  </section>
  
  <section class="how-it-works-section">
    <h2 class="section-title">Si funksionon?</h2>
    <div class="steps">
      <div class="step">
        <h3 class="step-title">1. Regjistrohu</h3>
        <p>Krijo një llogari si fermer ose konsumator.</p>
      </div>
      <div class="step">
        <h3 class="step-title">2. Publiko ose shfleto</h3>
        <p>Fermerët publikojnë produkte, konsumatorët i shfletojnë.</p>
      </div>
      <div class="step">
        <h3 class="step-title">3. Bëj kërkesë</h3>
        <p>Bli direkt nga fermeri – pa ndërmjetës!</p>
      </div>
    </div>
  </section>
  
  <section class="cta-section">
    <h2 class="cta-title">Gati për të filluar?</h2>
    <p class="cta-description">Bashkohu me qindra përdorues që besojnë tek produktet lokale dhe të freskëta.</p>
    <a href="/register" class="cta-button">Regjistrohu Tani</a>
  </section>
</main>

<style>

  section {
    padding: 2.5rem 0;
    margin-bottom: 1.5rem;
  }

  /* Hero Section */
  .hero-section {
    text-align: center;
    background-color: #d1f7e1;
    border-radius: 15px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
  .cta-section{
    margin: auto 1rem;
  }

  .explore-button, .cta-button {
    display: inline-block;
    background-color: #2b6e30;
    color: white;
    padding: 0.9rem 2rem;
    font-size: clamp(1.1rem, 2.5vw, 1.25rem);
    border: none;
    border-radius: 8px;
    text-decoration: none;
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .explore-button:hover, .cta-button:hover {
    background-color: #276f2b;
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
    color: #2b6e30;
    margin-bottom: 1.5rem;
  }

  .about-description {
    font-size: clamp(1rem, 2.5vw, 1.125rem);
    color: #4c4c4c;
    max-width: 800px;
    margin: 0 auto;
    line-height: 1.7;
    text-align: center;
    padding: 0 1rem;
  }

  /* How it Works Section */
  .how-it-works-section {
    padding: 2.5rem 1rem;
    background-color: #d1f7e1;
    border-radius: 15px;
    margin: 2rem 0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .section-title, .cta-title {
    font-size: clamp(1.5rem, 4vw, 2rem);
    font-weight: bold;
    text-align: center;
    margin-bottom: 2rem;
    color: #2b6e30;
  }

  .steps {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 0 1rem;
  }

  .step {
    background-color: white;
    padding: 1.5rem;
    border-radius: 10px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    transition: transform 0.3s ease;
  }

  .step:hover {
    transform: translateY(-5px);
  }

  .step-title {
    font-size: clamp(1.25rem, 3vw, 1.5rem);
    font-weight: bold;
    color: #2b6e30;
    margin-bottom: 0.75rem;
  }

  .step p {
    color: #4c4c4c;
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
    color: #4c4c4c;
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
    }

    .steps {
      flex-direction: row;
      justify-content: space-between;
      gap: 2rem;
      padding: 0;
    }

    .step {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }

    .about-description {
      text-align: center;
    }
  }

  @media (min-width: 1024px) {
    
    .how-it-works-section {
      padding: 3rem 2rem;
    }

    .steps {
      gap: 3rem;
    }

    .step {
      padding: 2rem;
    }
  }
</style>