const express = require("express");
const path = require("path");
const fs = require("fs"); // file system 
const sass = require("sass");
const sharp = require("sharp");

// const ejs=require('ejs');
const pg = require("pg");

const app = express();
app.set("view engine", "ejs")

console.log("Folder index.js", __dirname);
console.log("Folder curent (de lucru)", process.cwd());
console.log("Cale fisier", __filename);
    
app.use("/resurse", express.static(path.join(__dirname, "resurse")));
app.use("/dist", express.static(path.join(__dirname, "node_modules/bootstrap/dist")));

obGlobal = {
    obErori: null,
    obImagini: null,
    folderScss: path.join(__dirname, "resurse/scss"),
    folderCss: path.join(__dirname, "resurse/css"),
    folderBackup: path.join(__dirname, "backup"),
}

const client = new pg.Client({
    database:"Pagehaven",
    user:"ioana",
    password:"104n4!_Sc_2026",
    host:"localhost",
    port:5432
})

client.connect()

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
    ip: req.ip,
    imagini: obGlobal.obImagini.imagini
  });
});

app.get("/carti", function (req, res) {
  const ora = new Date().getHours();
  let perioada;
  if (ora >= 5 && ora < 12) {
    perioada = "dimineata";
  } else if (ora >= 12 && ora < 20) { 
    perioada = "zi";
  } else {
    perioada = "noapte";
  }

  let imagini = obGlobal.obImagini.imagini.filter(im => im.timp === perioada);
  if (imagini.length > 6) {
    const rest = imagini.length % 3;
    if (rest !== 0) {
        imagini = imagini.slice(0, imagini.length - rest);
    }
  }

  res.render("pagini/carti", { imagini });
});

// app.get("/carti/:gen", function (req, res) {
//     const gen = req.params.gen.toLowerCase(); 
//     const caleFisierEjs = path.join(__dirname, "views", "pagini", gen + ".ejs");

//     if (fs.existsSync(caleFisierEjs)) {
//         res.render("pagini/" + gen);
//     } else {
//          afisareEroare(res, 404);
//     }
// });

app.get("/produse", function(req, res) {
    clauzaWhere = "";
    if (req.query.tip) {
        clauzaWhere = `where tip_produs='${req.query.tip}'`;
    }
    client.query(`select * from prajituri ${clauzaWhere}`, function(err, rez) {
        if(err) {
            console.log("Eroare query", err);
            afisareEroare(res, 2);
        } else {
            console.log(rez);
            res.render("pagini/produse", { 
                produse: rez.rows,
                optiuni:[]
            });
        }
    });
})

app.get("/produs/:id", function(req, res) {
    const id = req.params.id;
    client.query(`select * from prajituri where id=${req.params.id}`, function(err, rez) {
        if(err) {
            console.log("Eroare query", err);
            afisareEroare(res, 2);
        } else {
            console.log(rez);
            if(rez.rowCount == 0) {
                afisareEroare(res, 404, "Produs inexistent");
            } else {
                res.render("pagini/produs", { 
                    prod: rez.rows[0] 
                });
            }
        }
    });
})

function verificaErori() {

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

    for (const i of ["info_erori", "cale_baza", "eroare_default"]) {
        if (!(i in erori)) {
            console.error("[EROARE] Proprietatea" + i + " lipseste din erori.json.");
        }
    }


    for (const i of ["titlu", "text", "imagine"]) {
        if (!(i in erori.eroare_default)) {
            console.error("[EROARE] Proprietatea" + i + " lipseste din obiectul 'eroare_default'.");
        }
    }

    const caleBaza = path.join(__dirname, erori.cale_baza);
    if (!fs.existsSync(caleBaza) || !fs.statSync(caleBaza).isDirectory()) {
        console.error("[EROARE] Calea de bază" + caleBaza + " nu există sau nu este un director.");
    }


    const toateErorile = [];
    toateErorile.push({ sursa: "eroare_default", imagine: erori.eroare_default.imagine });

    for (const e of erori.info_erori) {
        if (e.imagine) {
            toateErorile.push({ sursa: `eroare id=${e.identificator}`, imagine: e.imagine });
        }
    }

    for (const { sursa, imagine } of toateErorile) {
        const caleImagine = path.join(__dirname, "resurse/imagini/erori", imagine);
        if (!fs.existsSync(caleImagine)) {
            console.error("[EROARE] Imaginea" + imagine + " asociata lui '" + sursa + "' nu exista.");
        }
    }


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

function verifyImages() {
    const pathJsonGallery = path.join(__dirname, "resurse/json/galerie.json");
    if( !fs.existsSync(pathJsonGallery) ) {
        console.error("[CRITICAL ERROR] The file 'resurse/json/galerie.json' is missing. The application cannot start without it.");
        process.exit(1);
    }

    let content = fs.readFileSync(pathJsonGallery).toString("utf-8");
    let obImages = JSON.parse(content);

    let pathGallery = obImages.cale_galerie;
    let pathAbsGallery = path.join(__dirname, pathGallery);

    if(!fs.existsSync(pathAbsGallery)) {
        console.error("[CRITICAL ERROR] The gallery path '" + pathAbsGallery + "' does not exist. The application cannot start without it.");
        process.exit(1);
    }

    let images = obImages.imagini;
    for (let img of images) {
        let pathImg = path.join(pathAbsGallery, img.cale_relativa);
        if (!fs.existsSync(pathImg)) {
            console.error("[ERROR] The image '" + img.cale_relativa + "' does not exist in the gallery.");
            process.exit(1);
        }
    }
}
verifyImages();

function initImagini() {
    var continut = fs.readFileSync(path.join(__dirname, "resurse/json/galerie.json")).toString("utf-8");
    // __dirname => calea absoluta la unde se afla index.js 
    // SYNC => serverul asteapta pana cand fisierul este citit complet
    // coninut => string cu tot ce este in fisierul galerie.json

    obGlobal.obImagini = JSON.parse(continut);
    let vImagini = obGlobal.obImagini.imagini;
    let caleGalerie = obGlobal.obImagini.cale_galerie

    let caleAbs = path.join(__dirname, caleGalerie);
    //  c.a. pentru folderul galerie 
    let caleAbsMediu = path.join(caleAbs, "mediu");
    // c.a pentru folderul mediu din galerie

    if (!fs.existsSync(caleAbsMediu))
        fs.mkdirSync(caleAbsMediu);
    let caleAbsMic = path.join(caleAbs, "mic");
    if (!fs.existsSync(caleAbsMic))
        fs.mkdirSync(caleAbsMic);

    for (let imag of vImagini) {
        [numeFis, ext] = imag.cale_relativa.split(".");
        let caleFisAbs = path.join(caleAbs, imag.cale_relativa);
        // c.a pentru fisierul pe care vrem sa il procesam
    
        let caleFisMediuAbs = path.join(caleAbsMediu, numeFis + ".webp");
        sharp(caleFisAbs).resize(800).toFile(caleFisMediuAbs);

        let caleFisMicAbs = path.join(caleAbsMic, numeFis + ".webp");
        sharp(caleFisAbs).resize(400).toFile(caleFisMicAbs);

        imag.fisier = path.join("/", caleGalerie, imag.cale_relativa);
    // se creeaza cererea http pentru imaginea originala (ex: /resurse/imagini/galerie/ceva.png) care va fi folosita in cazul in care browserul nu suporta formatul webp
        imag.fisier_mediu = path.join("/", caleGalerie, "mediu", numeFis + ".webp");
        imag.fisier_mic = path.join("/", caleGalerie, "mic", numeFis + ".webp");

        imag.alt = imag.alt || imag.nume; 
        // we can not be sure that the alt propert will be in the json file
    }
}
initImagini();

function compileazaScss(caleScss, caleCss) {
    // caleScss => entry point 
    // caleCss => output
    if (!caleCss) {
        let nameFileExt = path.basename(caleScss); // "folder1/folder2/a.scss" -> "a.scss"
        let positionLastDot = nameFileExt.lastIndexOf(".");
        let nameWithoutExt = nameFileExt.substring(0, positionLastDot); // "a.scss" -> "a"
        caleCss = nameWithoutExt + ".css"; // output: a.css
    }
    // if we forgot to provide the output path for the css file, we will generate it based on 
    // the same name as the scss file but with the .css extension and we will put it in the same folder as the scss fil 

    if (!path.isAbsolute(caleScss))
        caleScss = path.join(obGlobal.folderScss, caleScss)
    if (!path.isAbsolute(caleCss))
        caleCss = path.join(obGlobal.folderCss, caleCss)
    // if we provide just the relative path, we will generate the absolute path by joining the 
    // folderScss with the relative path (caleScss)
    // folderCss with the relative path (caleCss)

    let caleBackup = path.join(obGlobal.folderBackup, "resurse/css");
    // before compiling the scss file, ww will create a backup of the previous version of the css file in the backup folder
    // if it exists
    if (!fs.existsSync(caleBackup)) {
        fs.mkdirSync(caleBackup, { recursive: true })
    }
    // if the css file already exists, we will copy it to the backup folder before compiling the scss file
    // recursive:true -> if the backup folder does not exist, it will be created along with any necessary parent folders

    // la acest punct avem cai absolute in caleScss si  caleCss
    let numeFisCss = path.basename(caleCss);
    // if the css file does not exist, it means that we are compiling the scss file for the first time
    // so we do not need to create a backup of the previous version of the css file
    if (fs.existsSync(caleCss)) {
        let positionPunct = numeFisCss.lastIndexOf(".");
        let nameWithoutExt = numeFisCss.substring(0, positionPunct);
        let extension = numeFisCss.substring(positionPunct);

        let timestamp = new Date().getTime();
        let nameFileBackup = `${nameWithoutExt}_${timestamp}${extension}`;

        //fs.copyFileSync(caleCss, path.join(obGlobal.folderBackup, "resurse/css", numeFisCss))// +(new Date()).getTime()
        fs.copyFileSync(caleCss, path.join(caleBackup, nameFileBackup))
    }
    let rez = sass.compile(caleScss, { "sourceMap": true });
    // sass.complie => compile a scss file to css 
    // caleScss => the path to the scss file that we want to compile
    // {"sourceMap":true} => options for the compilation process, in this case this is a map which makes the link between the scss file and the css file 
    fs.writeFileSync(caleCss, rez.css)
    // if we do not use this function, the translation from the scss to css will be stay in the air (memory RAM) and it will not save when we close the server
    // so we need to put in on the hard disk by writting it to a file, and this is what fs.writeFileSync does
    // fs.writeFileSync => write a file, if the file does not exist it will be created, if it already exists it will be overwritten
    // rez.css -> contains the compiled css code that we want to write to the css file
    // caleCss -> absolute path to the css file where we want to write the compiled css code   
}

fs.watch(obGlobal.folderScss, function (eveniment, numeFis) {
    // verify if we change or rename a scss file, we will compile it to css
    if (eveniment == "change" || eveniment == "rename") {
        let caleCompleta = path.join(obGlobal.folderScss, numeFis);
        if (fs.existsSync(caleCompleta)) {
            compileazaScss(caleCompleta);
        }
    }
})
// when the server starts, it will complie all the scss files in the folderScss and put the css files in the folderCss
vFisiere = fs.readdirSync(obGlobal.folderScss);
// it will make an array with the names of the files int the folders 
for (let numeFis of vFisiere) {
    if (path.extname(numeFis) == ".scss") {
        compileazaScss(numeFis);
    }
}

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
