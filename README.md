# 📖 Pagehaven - Biblioteca Ta Virtuală

Bun venit la **Pagehaven**, o aplicație web dinamică construită cu Node.js, Express și PostgreSQL, concepută pentru a funcționa ca o bibliotecă virtuală modernă și interactivă. Explorează, filtrează și descoperă cărți într-un mod intuitiv!

## ✨ Funcționalități Principale

*   **📚 Galerie de Cărți:** Vizualizează o colecție de cărți preluate dintr-o bază de date PostgreSQL.
*   **🔍 Filtrare Avansată:** Filtrează cărțile în timp real, fără reîncărcarea paginii, folosind criterii multiple:
    *   Titlu și Autor (cu validare live)
    *   Număr de pagini (slider)
    *   Gen (butoane radio)
    *   Public țintă (dropdown)
    *   Sursă (selecție multiplă)
    *   Limbă (grup de checkbox-uri)
    *   Descriere (căutare după cuvinte cheie)
*   **📊 Sortare Dinamică:** Ordonează cărțile ascendent sau descendent după numărul de pagini și, secundar, după numărul de limbi disponibile.
*   **🧮 Calculator Sumă Pagini:** Calculează și afișează instant suma paginilor pentru toate cărțile vizibile.
*   **📌 Opțiuni Produs:** Fiecare carte are opțiuni pentru a fi "fixată" (rămâne vizibilă indiferent de filtre) sau ascunsă temporar/pe durata sesiunii.
*   **🎨 Temă Dark/Light:** Comutator pentru a schimba tema vizuală a întregului site.
*   **⚙️ Procesare Automată:**
    *   **SCSS -> CSS:** Compilează automat fișierele SASS la fiecare modificare.
    *   **Optimizare Imagini:** Generează versiuni optimizate `.webp` (mici și medii) pentru imagini la pornirea serverului, folosind biblioteca `sharp`.
*   **🛡️ Robustete:** Aplicația verifică la pornire existența fișierelor critice (JSON, imagini) și se oprește cu un mesaj clar dacă acestea lipsesc.

## 🛠️ Tehnologii Folosite

| Categorie      | Tehnologie                                                                                                                            |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **🖥️ Backend**   | **Node.js**, **Express.js** (pentru server și rutare)                                                                                 |
| **📄 Frontend**  | **EJS** (templating), **SASS/SCSS** (pre-procesor CSS), **JavaScript** (pentru interactivitate), **Bootstrap** (pentru design responsiv) |
| **🗃️ Bază de Date** | **PostgreSQL** (stocare date), **pg** (driver Node.js)                                                                                |
| **🖼️ Unelte**     | **Sharp** (procesare imagini de înaltă performanță)                                                                                    |

## 🚀 Cum se Rulează Proiectul

Urmează acești pași pentru a rula proiectul pe mașina ta locală.

### Cerințe

*   **Node.js** (versiunea 18 sau mai recentă)
*   **PostgreSQL** instalat și pornit

### Pași de Instalare

1.  **Clonează repository-ul:**
    ```bash
    git clone https://github.com/Ioana-caty/Pagehaven.git
    cd Pagehaven
    ```

2.  **Configurează Baza de Date:**
    *   Creează o bază de date nouă în PostgreSQL numită `Pagehaven`.
    *   Creează un utilizator (ex: `ioana`) cu o parolă și acordă-i toate privilegiile pe baza de date `Pagehaven`.
    *   Actualizează datele de conectare în fișierul `index.js`:
        ```javascript
        const client = new pg.Client({
            database: "Pagehaven",
            user: "numele_tau_de_user",
            password: "parola_ta",
            host: "localhost",
            port: 5432
        })
        ```
    *   Rulează scriptul SQL `carti.sql` pentru a crea tabelele și a insera datele inițiale. Poți folosi un client vizual (ca DBeaver, pgAdmin) sau comanda `psql`:
        ```bash
        psql -U numele_tau_de_user -d Pagehaven -f carti.sql
        ```

3.  **Instalează Dependințele:**
    ```bash
    npm install
    ```

4.  **Pornește Serverul:**
    ```bash
    node index.js
    ```

5.  **Accesează Aplicația:**
    Deschide browserul și navighează la `http://localhost:8080`.

## 🏗️ Cum Funcționează

1.  **Inițializare Server:** La pornire, serverul încarcă datele esențiale (genuri, autori etc.) din PostgreSQL în memorie pentru acces rapid. De asemenea, compilează fișierele `.scss` în `.css` și optimizează imaginile din `galerie.json`.

2.  **Rutare:** Când un utilizator accesează un URL (ex: `/carti/lista`), Express identifică ruta corespunzătoare.

3.  **Preluare Date:** Serverul interoghează baza de date PostgreSQL pentru a obține lista de cărți.

4.  **Randare:** Datele obținute sunt trimise către un template EJS (`produse_carti.ejs`). Motorul EJS generează HTML-ul final, inserând dinamic datele în pagină.

5.  **Interactivitate Client:** Odată ce pagina este încărcată în browser, scriptul `produse_carti.js` preia controlul. Toate acțiunile de filtrare, sortare și validare se execută direct în browser, oferind o experiență fluidă, fără a mai face cereri către server.

## 🔒 Notă de Securitate

Versiunea inițială a codului era vulnerabilă la atacuri de tip **SQL Injection** din cauza concatenării directe a parametrilor din URL în query-urile SQL.

Această problemă a fost **remediată** prin utilizarea **interogărilor parametrizate**, o practică esențială de securitate. Driver-ul `pg` se ocupă acum de "curățarea" (escaping) input-ului, prevenind execuția de cod SQL malițios.

**Exemplu de remediere:**

```diff
--- a/index.js
+++ b/index.js
@@ -171,8 +171,7 @@
 
 app.get("/carte/:id", function (req, res) {
     const id = req.params.id;
-    client.query(`select * from carti where id=${req.params.id}`, function (err, rez) {
+    client.query("select * from carti where id=$1", [req.params.id], function (err, rez) {
         if (err) {
             console.log("Eroare query", err);
             afisareEroare(res, 2);
```