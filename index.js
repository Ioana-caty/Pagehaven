const express = require("express");
const path = require("path");
const fs = require("fs"); // file system 
const saas = require("sass");
const sharp = require("sharp");

const app = express();
app.set("view engine", "ejs")

console.log("Folder index.js", __dirname);
console.log("Folder curent (de lucru)", process.cwd());
console.log("Cale fisier", __filename);

app.use("/resurse", express.static(path.join(__dirname, "resurse")));


obGlobal = {
    obErori: null,
    obImagini: null,
    folderScss: path.join(__dirname, "resurse/scss"),
    folderCss: path.join(__dirname, "resurse/css"),
    folderBackup: path.join(__dirname, "backup"),
}


let vect_foldere = ["temp", "logs", "backup", "fisiere_uploadate"]
for (let folder of vect_foldere) {
    let caleFolder = path.join(__dirname, folder);
    if (!fs.existsSync(caleFolder)) {
        fs.mkdirSync(path.join(caleFolder), { recursive: true });
    }
}

app.get("/favicon.ico", function (req, res) {
    res.sendFile(path.join(__dirname, "resurse/imagini/favicon/favicon.ico"))
});

app.get(["/", "/index", "/home"], function (req, res) {
    res.render("pagini/index", {
        ip: req.ip
    });
});

function verificaErori() {
    // 1. Verificare existenta fisier erori.json
    const caleJson = path.join(__dirname, "resurse/json/erori.json");
    if (!fs.existsSync(caleJson)) {
        console.error("[EROARE CRITICA] Fisierul 'resurse/json/erori.json' nu a fost gasit. Aplicatia nu poate porni fara el.");
        process.exit(1);
    }

    let stringJson;
    let erori;
    try {
        stringJson = fs.readFileSync(caleJson).toString("utf-8");
        erori = JSON.parse(stringJson);
    } catch {
        console.error("[EROARE CRITICA] Fisierul 'erori.json' este invalid.");
        process.exit(1);
    }

    // 2. Verificare prorietatilor: info_erori, cale_baza, eroare_default
    for (const i of ["info_erori", "cale_baza", "eroare_default"]) {
        if (!(i in erori)) {
            console.error("[EROARE] Proprietatea" + i + " lipseste din erori.json.");
        }
    }

    // 3. Verificare proprietatilor din eroare_default (titlu, text, imagine)
    for (const i of ["titlu", "text", "imagine"]) {
        if (!(i in erori.eroare_default)) {
            console.error("[EROARE] Proprietatea" + i + " lipseste din obiectul 'eroare_default'.");
        }
    }

    // 4. Verificam daca cale_baza exista si este director
    const caleBaza = path.join(__dirname, erori.cale_baza);
    if (!fs.existsSync(caleBaza) || !fs.statSync(caleBaza).isDirectory()) {
        console.error("[EROARE] Calea de bază" + caleBaza + " nu există sau nu este un director.");
    }

    // 5. Verificam daca imaginile specificate in eroare_default si info_erori exista in cale_baza
    const toateErorile = [];
    toateErorile.push({ sursa: "eroare_default", imagine: erori.eroare_default.imagine });

    for (const e of erori.info_erori) {
        if (e.imagine) {
            toateErorile.push({ sursa: `eroare id=${e.identificator}`, imagine: e.imagine });
        }
    }
    // cream un vector cu toate erorile (default si tot c ese afla in info_erori) pentru a verifica mai usor imaginile asociate
    for (const { sursa, imagine } of toateErorile) {
        const caleImagine = path.join(__dirname, "resurse/imagini/erori", imagine);
        if (!fs.existsSync(caleImagine)) {
            console.error("[EROARE] Imaginea" + imagine + " asociata lui '" + sursa + "' nu exista.");
        }
    }

    //6. Verificam daca in info_erori nu avem dubluri pentru prorietati 
    let lista_dubluri = [];
    for (let line of stringJson.split("\n")) {
        line = line.trim();
        if (line.startsWith('{')) {
            lista_dubluri = [];
        }
        if (line.startsWith('"')) {
            let val = line.split('"')[1];
            if (lista_dubluri.includes(val)) {
                console.error("[EROARE] Proprietatea'" + val + "' apare de mai multe ori.");
            }
            lista_dubluri.push(val);
        }
    }
    //7. Verificam daca in info_erori avem erori cu aceleasi identificator
    let lista_identificatori = [];
    for (let { identificator, status, titlu, text, imagine } of erori.info_erori) {
        if (lista_identificatori.includes(identificator)) {
            console.error("[EROARE] Exista mai multe erori cu identificatorul " + identificator + ":" +
                " titlu: " + titlu + ", text: " + text + ", imagine: " + imagine
            );
        }
        lista_identificatori.push(identificator);
    }

}

verificaErori();
initErori();

function initErori() {
    let continut = fs.readFileSync(path.join(__dirname, "resurse/json/erori.json")).toString("utf-8");
    let erori = obGlobal.obErori = JSON.parse(continut)

    let err_default = erori.eroare_default
    err_default.imagine = path.join(erori.cale_baza, err_default.imagine)

    for (let eroare of erori.info_erori) {
        eroare.imagine = path.join(erori.cale_baza, eroare.imagine)
    }
}
initErori()

function afisareEroare(res, identificator, titlu, text, imagine) {
    let eroare = obGlobal.obErori.info_erori.find((element) => {
        return element.identificator == identificator
    });
    if (eroare?.status) {
        res.status(eroare.identificator);
    }
    res.render("pagini/eroare", {
        imagine: imagine || eroare?.imagine || err_default.imagine,
        titlu: titlu || eroare?.titlu || err_default.titlu,
        text: text || eroare?.text || err_default.text,
    });
}

app.get("/eroare", function (req, res) {
    afisareEroare(res, 404, "Titlu personalizat")
});

app.get("/*pagina", function (req, res) {
    console.log("Cale pagina", req.url);
    if (req.url.startsWith("/resurse") && path.extname(req.url) == "") {
        afisareEroare(res, 403);
        return;
    }
    if (path.extname(req.url) == ".ejs") {
        afisareEroare(res, 400);
        return;
    }
    try {
        res.render("pagini" + req.url, function (err, rezRandare) {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    afisareEroare(res, 404)
                }
                else {
                    afisareEroare(res);
                }
            }
            else {
                res.send(rezRandare);
                console.log("Rezultat randare", rezRandare);
            }
        });
    }
    catch (err) {
        if (err.message.includes("Cannot find module")) {
            afisareEroare(res, 404)
        }
        else {
            afisareEroare(res);
        }
    }
});

const PORT = 8080;
app.listen(PORT);
console.log("Serverul a pornit!");
