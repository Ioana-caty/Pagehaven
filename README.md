<div align="center">
  <h1>📖 Pagehaven - O Bibliotecă Virtuală Modernă</h1>
  <p>O aplicație web full-stack, construită pentru a oferi o experiență interactivă de explorare a unei colecții de cărți.</p>

  <div>
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js"/>
    <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
    <img src="https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white" alt="Sass"/>
    <img src="https://img.shields.io/badge/EJS-B4CA65?style=for-the-badge&logo=ejs&logoColor=white" alt="EJS"/>
    <img src="https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white" alt="Bootstrap"/>
  </div>
</div>

---

## 📜 Cuprins

* [Despre Proiect](#despre-proiect)
* [Funcționalități Cheie](#funcționalități-cheie)
* [Tehnologii Folosite](#tehnologii-folosite)
* [Ghid de Instalare](#ghid-de-instalare)
* [Arhitectura Proiectului](#arhitectura-proiectului)

---

## 🎯 Despre Proiect

**Pagehaven** este o aplicație web dinamică ce simulează o bibliotecă virtuală. Proiectul demonstrează o arhitectură solidă, cu un backend în **Node.js** care servește pagini randate pe server cu **EJS** și un frontend reactiv, scris în **JavaScript pur**, care oferă o experiență de utilizare fluidă, fără a necesita un framework complex precum React sau Angular.

---

## ✨ Funcționalități Cheie

*   **� Filtrare și Sortare Client-Side:** O interfață de filtrare avansată, implementată în JavaScript pur, care permite utilizatorilor să rafineze căutarea în timp real, fără a reîncărca pagina. Include:
    *   Filtre textuale cu validare live.
    *   Slider pentru interval numeric (număr de pagini).
    *   Butoane radio, checkbox-uri și selecții multiple pentru categorii.
*   **⚙️ Automatizări la Nivel de Server:**
    *   **Compilare SASS:** Un script `watch` monitorizează fișierele `.scss` și le compilează automat în CSS, creând și un backup al versiunii anterioare.
    *   **Optimizare Imagini:** La pornirea serverului, imaginile sunt procesate cu `sharp` pentru a genera formate moderne `.webp` de dimensiuni diferite, optimizând viteza de încărcare.
    *   **Curățare Automată:** Un `setInterval` șterge periodic fișierele vechi din folderul de backup pentru a menține spațiul de stocare.
*   **🛡️ Sistem Robust de Erori:** Aplicația folosește un fișier centralizat `erori.json` pentru a gestiona și afișa pagini de eroare personalizate și prietenoase, inclusiv verificări critice la pornire.
*   **🎨 Temă Duală (Dark/Light):** Un comutator permite schimbarea instantanee a temei vizuale, starea fiind salvată în `localStorage`.
*   **📌 Interacțiuni Avansate:** Utilizatorii pot "fixa" cărți pe ecran (indiferent de filtre) sau le pot ascunde temporar, folosind `sessionStorage` pentru a persista starea.

---

## 🛠️ Tehnologii Folosite

*   **Backend**: **Node.js** cu **Express.js** pentru crearea serverului web și gestionarea rutelor.
*   **Frontend**:
    *   **EJS (Embedded JavaScript)** pentru randarea dinamică a paginilor HTML pe server.
    *   **SASS/SCSS** pentru un CSS structurat, modular și ușor de întreținut.
    *   **JavaScript (Vanilla)** pentru toată logica interactivă din browser (filtrare, sortare, validări).
    *   **Bootstrap** pentru un design responsiv și modern.
*   **Bază de Date**: **PostgreSQL** pentru stocarea datelor despre cărți, interogat prin pachetul `pg`.
*   **Unelte & Automatizări**:
    *   **Sharp** pentru procesarea și optimizarea imaginilor în formate moderne.
    *   **`fs` (File System)**, modulul nativ Node.js, pentru monitorizarea fișierelor și gestionarea sistemului de backup.

---

## 🚀 Ghid de Instalare

### 1. Cerințe

*   **Node.js** (versiunea 18 sau mai recentă)
*   **PostgreSQL** instalat și un server activ

### 2. Pași de Configurare

1.  **Clonează Repository-ul:**
    ```bash
    git clone https://github.com/Ioana-caty/Pagehaven.git
    cd Pagehaven
    ```

2.  **Instalează Dependințele:**
    ```bash
    npm install
    ```

3.  **Configurează Baza de Date:**
    *   Asigură-te că serverul tău PostgreSQL rulează.
    *   Creează o bază de date nouă, de exemplu `Pagehaven`.
    *   Actualizează datele de conectare în fișierul `index.js` (aproximativ linia 30):
        ```javascript
        const client = new pg.Client({
            database: "Pagehaven",
            user: "utilizatorul_tau_postgres",
            password: "parola_ta",
            host: "localhost",
            port: 5432
        })
        ```
    *   Rulează scriptul SQL pentru a popula baza de date. Poți folosi un client vizual (DBeaver, pgAdmin) sau comanda `psql`:
        ```bash
        psql -U utilizatorul_tau_postgres -d Pagehaven -f carti.sql
        ```

4.  **Pornește Serverul:**
    ```bash
    node index.js
    ```

5.  **Accesează Aplicația:**
    🎉 Deschide browserul și navighează la adresa `http://localhost:8080`.

---

## 🏗️ Arhitectura Proiectului

*   **`index.js`**: Punctul central al aplicației. Gestionează serverul Express, rutele, conexiunea la baza de date și toate scripturile de inițializare (compilare SCSS, procesare imagini).
*   **`/views`**: Conține fișierele EJS (Embedded JavaScript) folosite pentru a genera paginile HTML pe server.
    *   `/pagini`: Template-urile principale pentru fiecare pagină.
    *   `/fragmente`: Componente reutilizabile precum `head`, `header` și `footer`.
*   **`/resurse`**: Directorul pentru toate resursele statice.
    *   `/css`: Fișierele CSS compilate, gata de a fi servite clientului.
    *   `/scss`: Fișierele sursă SASS, unde este scris stilul.
    *   `/js`: Scripturile JavaScript care rulează în browser.
    *   `/imagini`: Imaginile statice ale proiectului.
    *   `/json`: Fișiere de configurare (ex: `erori.json`, `galerie.json`).
*   **`/backup`**: Director generat automat unde se salvează versiunile anterioare ale fișierelor CSS.

---

