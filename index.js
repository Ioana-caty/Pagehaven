const express= require("express"); 
const path= require("path"); 
const fs = require("fs"); // file system 
const saas = require("sass");

const app= express(); 
app.set("view engine", "ejs") 

console.log("Folder index.js", __dirname);
console.log("Folder curent (de lucru)", process.cwd());
console.log("Cale fisier", __filename);

obGlobal = {
    obErori:null, // nimic, gol 
    obImagini:null,
    folderScss: path.join(__dirname, "resurse/scss"),
    folderCss: path.join(__dirname, "resurse/css"),
    folderBackup: path.join(__dirname, "backup"),
}



let vect_foldere=[ "temp", "logs", "backup", "fisiere_uploadate" ]
for (let folder of vect_foldere){
    let caleFolder=path.join(__dirname, folder);
    if (!fs.existsSync(caleFolder)) {
        fs.mkdirSync(path.join(caleFolder), {recursive:true});   
    }
}

app.use("/resurse", express.static(path.join(__dirname, "resurse")));

app.get("/favicon.ico", function(req, res){
    res.sendFile(path.join(__dirname,"resurse/imagini/favicon/favicon.ico"))
});

app.get(["/", "/index", "/home"], function(req, res) {
    res.render("pagini/index", {
        ip: req.ip
    });
});
app.get("/echipa", function(req, res) {
    res.render("pagini/echipa");
});

/* we need to change in the future */
app.get("/admin", function(req, res) {
    console.log("Am primit o cerere pe /admin");
    res.send("Salut <b>admin</b>!");
});
/*we need to change in the future */
app.get("/shop", function(req, res) {
    res.write("magazin\n");
    res.write("in\n");
    res.write("constructie");
    res.end();
});
/*we need to change in the future*/
app.get("/sum/:a/:b", function(req, res) {
    res.send(parseInt(req.params.a) + parseInt(req.params.b));
});


function initErori() {
    let continut = fs.readFileSync(path.join(__dirname, "resurse/json/erori.json")).toString("utf-8");
    // calculatorul citeste fisierele ca pe niste dat brute, comanda .toString... il obliga sa transforme datele intr un text normal 
    // variabila continut contine tot ce se gaseste in fisierul erori.json, dar sub forma de text, nu de obiecte sau array-uri
    let erori = obGlobal.obErori = JSON.parse(continut)
    // parse ia acel text brut și îl transformă într-o structură de date organizată (un obiect JavaScript)
    let err_default = erori.eroare_default
    // pentru m=comoditate ca sa nu scriem de fiecare data obGlobal.obErori.eroare_default, ci doar err_default

    err_default.imagine = path.join(erori.cale_baza, err_default.imagine)
    // creeaza o cale absoluta pentru imaginea erorii default
    for (let eroare of erori.info_erori) {
        eroare.imagine = path.join(erori.cale_baza, eroare.imagine)
        // creeaza caile absolute pentru imaginile erorilor din 'info_erori'
    }
}
initErori()

function afisareEroare (res, identificator, titlu, text, imagine) {
    // afisam eroarea dupa identificator 
    let eroare = obGlobal.obErori.info_erori.find((element) => {
        return element.identificator == identificator
    });
    // daca sunt setate titlu, text, imagine, le folosim,
    // altfel folosim cele din fisierul json pentru eroarea gasita
    // daca nu o gasim, afisam eroarea default
    if(eroare?.status) {
        res.status(eroare.identificator);
    }
    res.render("pagini/eroare", {
        imagine: imagine || eroare?.imagine || err_default.imagine,
        titlu: titlu || eroare?.titlu || err_default.titlu,
        text: text || eroare?.text || err_default.text,
    });
}

app.get("/eroare", function(req, res) {
    afisareEroare(res, 404, "Titlu personalizat")
});
// al doilea parametru in render, poarta numele de "locals"

// daca inceram sa accesam o pagina ce nu o avem, vom face sa primim eroare 404 si o pagina de eroare personalizata, nu cea standard a browserului
app.get("/*pagina", function(req, res){
    console.log("Cale pagina", req.url);
    if (req.url.startsWith("/resurse") && path.extname(req.url)==""){
        afisareEroare(res,403);
        return;
    }
    if (path.extname(req.url)==".ejs"){
        afisareEroare(res,400);
        return;
    }
    try{
        res.render("pagini"+req.url, function(err, rezRandare){
            if (err){
                if (err.message.includes("Failed to lookup view")){
                    afisareEroare(res,404)
                }
                else{
                    afisareEroare(res);
                }
            }
            else{
                res.send(rezRandare);
                console.log("Rezultat randare", rezRandare);
            }
        });
    }
    catch(err){
        if (err.message.includes("Cannot find module")){
            afisareEroare(res,404)
        }
        else{
            afisareEroare(res);
        }
    }
});

const PORT = 8080;
app.listen(PORT);
console.log("Serverul a pornit!");
