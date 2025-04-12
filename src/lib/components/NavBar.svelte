<script lang="ts">
    import LanguageSwitcher from './LanguageSwitcher.svelte';
    
    // Përkthimet për navbar me tipizim të saktë
    const translations = {
        en: {
            home: "Home",
            browseProducts: "Browse Products",
            bookmarks: "Bookmarks",
            panel: "Panel"
        },
        sq: {
            home: "Kryefaqja",
            browseProducts: "Shfletoni Produktet",
            bookmarks: "Faqerojtësit",
            panel: "Paneli"
        }
    };

    // Tipi për gjuhët e disponueshme
    type LanguageCode = keyof typeof translations;

    // Merr gjuhën aktuale me kontroll të tipit
    let currentLang: LanguageCode = 'en';
    if (typeof localStorage !== 'undefined') {
        const savedLang = localStorage.getItem('selectedLanguage') as LanguageCode;
        if (savedLang && translations[savedLang]) {
            currentLang = savedLang;
        }
    }

    // Krijo tabs dinamikisht bazuar në gjuhën aktuale
    let tabs = [
        { name: translations[currentLang].home, link: "/" },
        { name: translations[currentLang].browseProducts, link: "/products" },
        { name: translations[currentLang].bookmarks, link: "/bookmarks" },
        { name: translations[currentLang].panel, link: "/panel" }
    ];

    // Përditëso tabs kur ndryshon gjuha
    $: {
        const lang = (typeof localStorage !== 'undefined' 
            ? localStorage.getItem('selectedLanguage') 
            : 'en') as LanguageCode || 'en';
        
        tabs = [
            { name: translations[lang].home, link: "/" },
            { name: translations[lang].browseProducts, link: "/products" },
            { name: translations[lang].bookmarks, link: "/bookmarks" },
            { name: translations[lang].panel, link: "/panel" }
        ];
    }
</script>
<nav>
    <ul>
        {#each tabs as tab}
            <li><a href={tab.link}>{tab.name}</a></li>
        {/each}
    </ul>
    
    <div class="language-switcher">
        <LanguageSwitcher />
    </div>
</nav>
<style>
    nav {
        background-color: #213555;
        padding: 1rem;
        position: fixed; 
        top: 0; 
        width: 100%;
        z-index: 1000;
        
    }

    ul {
        display: flex;
        list-style-type: none;
        margin: 0;
        padding: 0;
    }

    li {
        margin: 0 1rem;
    }

    a {
        color: white;
        text-decoration: none;
        font-weight: bold;
    }

    a:hover {
        text-decoration: underline;
    }
    
</style>

