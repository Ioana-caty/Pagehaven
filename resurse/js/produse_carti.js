window.onload = function () {

    document.getElementById("inp-pagini").oninput = function () {
        document.getElementById("info-range").innerHTML = this.value;
    }

    // auto correction for description (validation in real time)
    document.getElementById("inp-descriere").oninput = function() {
        const regexValidare = /^[a-zA-Z0-9, \s]*$/;
        if (this.value.match(regexValidare)) {
            this.classList.remove("is-invalid");
        } else {
             this.classList.add("is-invalid");
        }
    };

    document.getElementById("inp-autor").oninput = function() { 
        if (this.value.match(/^\D+$/)) {
            this.classList.remove("is-invalid");
         } else {
            this.classList.add("is-invalid");
        }
    }

    function valideaza() {
        // find the elements by id
        let titlu = document.getElementById("inp-titlu");
        let autor = document.getElementById("inp-autor");
        let descriere = document.getElementById("inp-descriere");

        // erase the old red border
        titlu.classList.remove("is-invalid");
        autor.classList.remove("is-invalid");
        descriere.classList.remove("is-invalid");

        // 1. Title: if something is written, it must have at least 3 characters
        let valTitlu = titlu.value.trim();
        if (valTitlu !== "" && !valTitlu.match(/\S{3,}/)) {
            alert("Dacă introduceți un titlu, acesta trebuie să aibă minim 3 caractere!");
            titlu.classList.add("is-invalid");
            return false;
        }

        // 2. Author: without numbers
        if (autor.value.match(/\d/)) {
            alert("Numele autorului nu poate conține cifre!");
            autor.classList.add("is-invalid");
            return false;
        }

        // 3. Description: just letters, numbers, spaces, ",";
        if (!descriere.value.match(/^[a-zA-Z0-9, \s]*$/)) {
            alert("Descrierea conține caractere interzise!");
            descriere.classList.add("is-invalid");
            return false;
        }

        return true;
    }

    document.getElementById("filtrare").onclick = function () {
        if (!valideaza()) return;

        //we read the values from the input fields
        let inpTitlu = document.getElementById("inp-titlu").value.toLowerCase().trim();
        let inpAutor = document.getElementById("inp-autor").value.toLowerCase().trim();
        let inpPaginiMax = parseInt(document.getElementById("inp-pagini").value);

        let grupRadio = document.getElementsByName("gr_rad");
        let valGen = "toate";
        for (let r of grupRadio) {
            if (r.checked) {
                valGen = r.value;
                break;
            }
        }

        let inpPublic = document.getElementById("inp-public").value.toLowerCase().trim();

        let optionsSursa = Array.from(document.getElementById("inp-sursa").selectedOptions);
        let vValSurse = optionsSursa.map(opt => opt.value);

        let vValLimbi = [];
        let chkLimbi = document.getElementsByName("gr_chck");
        for (let chk of chkLimbi) {
            if (chk.checked) {
                vValLimbi.push(chk.value);
            }
        }

        let textDescriere = document.getElementById("inp-descriere").value.toLowerCase().trim();
        let cuvinteCheie = textDescriere.split(",").map(s => s.trim()).filter(s => s !== "");

        let produse = document.getElementsByClassName("produs");

        for (let prod of produse) {
            prod.style.display = "none";

            // let titlu = prod.getElementsByClassName("val-titlu")[0].innerHTML.trim().toLowerCase();
            let titlu = prod.dataset.titlu.toLowerCase();
            let cond1 = titlu.includes(inpTitlu);

            // let autor = prod.getElementsByClassName("val-autor")[0].innerHTML.trim().toLowerCase();
            let autor = prod.dataset.autor.toLowerCase();
            let cond2 = autor.includes(inpAutor);

            // let pagini = parseInt(prod.getElementsByClassName("val-pagini")[0].innerHTML.trim());
            let pagini = parseInt(prod.dataset.pagini);
            let cond3 = (pagini <= inpPaginiMax);

            // let gen = prod.getElementsByClassName("val-gen")[0].innerHTML.trim().toLowerCase();
            let gen = prod.dataset.gen.toLowerCase()
            // true || gen:false => true;
            let cond4 = (valGen === "toate" || gen === valGen);

            // let publicTinta = prod.getElementsByClassName("val-public")[0].innerHTML.trim().toLowerCase();
            let publicTinta = prod.dataset.public.toLowerCase();
            let cond5 = (inpPublic === "toate" || publicTinta === inpPublic);

            // let sursa = prod.getElementsByClassName("val-sursa")[0].innerHTML.trim();
            let sursa = prod.dataset.sursa;
            let cond6 = (vValSurse.length === 0 || vValSurse.includes(sursa));

            // let limbiCarte = prod.getElementsByClassName("val-limbi")[0].innerHTML.trim().toLowerCase();
            let limbiCarte = prod.dataset.limbi.toLowerCase();
            let cond7 = false; // default => we do not display any book
            if (vValLimbi.length === 0) {
                cond7 = true;
            } else {
                let vLimbiCarte = limbiCarte.split(",").map(s => s.trim());
                for (let l of vValLimbi) {
                    if (vLimbiCarte.includes(l)) {
                        cond7 = true;
                        break;
                    }
                }
            }

            // let descriere = prod.getElementsByClassName("val-descriere")[0].innerHTML.trim().toLowerCase();
            let descriere = prod.dataset.descriere.toLowerCase();
            let cond8 = true; // display by default all the books 
            if (cuvinteCheie.length > 0) {
                // if we have some keywords to look for
                // we verify if a keyword appers in the description minimum once
                cond8 = false;
                for (let cuvant of cuvinteCheie) {
                    if (descriere.includes(cuvant)) {
                        cond8 = true;
                        break;
                    }
                }
            }

            if (cond1 && cond2 && cond3 && cond4 && cond5 && cond6 && cond7 && cond8) {
                prod.style.display = "block";
            }
        }
    }

    document.getElementById("resetare").onclick = function () {
        if (confirm("Sunteți sigur că vreți să resetați toate filtrele?")) {
            document.getElementById("inp-titlu").value = "";
            document.getElementById("inp-autor").value = "";
            document.getElementById("inp-descriere").value = "";

            // eliminate the red border 
            document.getElementById("inp-titlu").classList.remove("is-invalid");
            document.getElementById("inp-autor").classList.remove("is-invalid");
            document.getElementById("inp-descriere").classList.remove("is-invalid");

            // reset the silder value
            const slider = document.getElementById("inp-pagini");
            slider.value = slider.max;
            document.getElementById("info-range").innerHTML = slider.max;

            // all the radio buttons  for the type book are checked
            document.getElementById("i_radToate").checked = true;
            // the value for the target public is fro all
            document.getElementById("inp-public").value = "toate";

            // all the options for sourse are unchecked
            let optsSursa = document.getElementById("inp-sursa").options;
            for (let o of optsSursa) o.selected = false;

            // all the options for language are checked
            let chksLimbi = document.getElementsByName("gr_chck");
            for (let c of chksLimbi) c.checked = true;

            // we display all the books
            let produse = document.getElementsByClassName("produs");
            for (let prod of produse) prod.style.display = "block";

            // we sort the books by id
            let vProduse = Array.from(produse); // HTML collection
            vProduse.sort((a, b) =>
                // convert the id from "ent1" to 1
                parseInt(a.id.replace("ent", "")) - parseInt(b.id.replace("ent", "")));

            // the organize is just in the memory 9we do not see it) 
            // we organize the books ont he grid 
            let container = document.querySelector(".grid-produse");
            for (let prod of vProduse) {
                container.appendChild(prod);
            }
        }
    }

    function sorteaza(semn) {
        if (!valideaza()) return;
        let produse = document.getElementsByClassName("produs");
        let vProduse = Array.from(produse);
        vProduse.sort(function (a, b) {
            // let paginiA = parseInt(a.getElementsByClassName("val-pagini")[0].innerHTML.trim());
            // let paginiB = parseInt(b.getElementsByClassName("val-pagini")[0].innerHTML.trim());
            let paginiA = parseInt(a.dataset.pagini);
            let paginiB = parseInt(b.dataset.pagini);
            if (paginiA === paginiB) {
                // let nrLimbiA = a.getElementsByClassName("val-limbi")[0].innerHTML.split(",").filter(s => s.trim() !== "").length;
                // let nrLimbiB = b.getElementsByClassName("val-limbi")[0].innerHTML.split(",").filter(s => s.trim() !== "").length;
                let nrLimbiA = a.dataset.limbi.split(",").filter(s => s.trim() !== "").length;
                let nrLimbiB = b.dataset.limbi.split(",").filter(s => s.trim() !== "").length;
                return semn * (nrLimbiB - nrLimbiA);
            }
            return semn * (paginiA - paginiB);
        });
        for (let prod of vProduse) prod.parentElement.appendChild(prod);
    }

    document.getElementById("sortCresc").onclick = () => sorteaza(1);
    document.getElementById("sortDescresc").onclick = () => sorteaza(-1);

    function afiseazaCalcul() {
        if (!valideaza()) return;

        let produse = document.getElementsByClassName("produs");
        let suma = 0;

        for (let prod of produse) {
            if (prod.style.display !== "none") {
                // suma += parseInt(prod.getElementsByClassName("val-pagini")[0].innerHTML.trim());
                suma += parseInt(prod.dataset.pagini);
            }
        }

        let p = document.getElementById("infoSuma");
        if (!p) {
            p = document.createElement("p");
            p.id = "infoSuma";
            let sectiuneProduse = document.getElementById("produse");
            sectiuneProduse.parentElement.insertBefore(p, sectiuneProduse);

            setTimeout(function () {
                let p1 = document.getElementById("infoSuma");
                p1.remove();
            }, 2000);
        } 
    
        p.innerHTML = "Total pagini: " + suma;
    }

    // Butonul și scurtătura tastaturii fac același lucru
    document.getElementById("calculare").onclick = function () {
        afiseazaCalcul();
    };

    // Scurtătură tastatură Alt + C
    window.onkeydown = function (e) {
        if (e.key === "c" && e.altKey) {
            afiseazaCalcul();
        }
    }
}
