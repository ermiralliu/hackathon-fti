<script lang="ts">
    // Definimi i tipit për gjuhën
    interface Language {
        code: string;
        name: string;
        nativeName: string;
    }

    // Objekti me gjuhët e disponueshme me tipizim të saktë
    const languages: Record<string, Language> = {
        en: { code: 'en', name: 'English', nativeName: 'English' },
        sq: { code: 'sq', name: 'Albanian', nativeName: 'Shqip' }
    };

    // Tipi për kodet e gjuhëve të disponueshme
    type LanguageCode = keyof typeof languages;

    let selectedLanguage: LanguageCode = 'en';

    // Kontrollo gjuhën e ruajtur në localStorage
    if (typeof localStorage !== 'undefined') {
        const savedLang = localStorage.getItem('selectedLanguage') as LanguageCode;
        if (savedLang && languages[savedLang]) {
            selectedLanguage = savedLang;
        }
    }

    // Funksioni për ndërrimin e gjuhës me tipizim të saktë
    function changeLanguage(language: LanguageCode): void {
        localStorage.setItem('selectedLanguage', language);
        selectedLanguage = language;
        window.location.reload();
    }
</script>

<select bind:value={selectedLanguage} on:change={() => changeLanguage(selectedLanguage)}>
    {#each Object.values(languages) as lang}
        <option value={lang.code}>{lang.nativeName}</option>
    {/each}
</select>