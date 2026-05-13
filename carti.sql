-- 1. Ștergem tabelul (CASCADE rupe legăturile cu tipurile ENUM)
DROP TABLE IF EXISTS carti CASCADE;

-- 2. Acum putem șterge tipurile fără eroare
DROP TYPE IF EXISTS gen_carte;
DROP TYPE IF EXISTS public_tinta_carte;
DROP TYPE IF EXISTS format_carte;

-- 3. Recreăm tipurile
CREATE TYPE gen_carte AS ENUM ('romance', 'fantasy', 'thriller');
CREATE TYPE public_tinta_carte AS ENUM ('copii', 'adolescenti', 'adulti');
CREATE TYPE sursa_carte AS ENUM ('scanare', 'digital_native', 'proiect_extern');

-- 4. Recreăm tabelul
CREATE TABLE IF NOT EXISTS carti (
   id SERIAL PRIMARY KEY,
   titlu VARCHAR(255) NOT NULL,
   autor VARCHAR(255),
   descriere TEXT,
   imagine VARCHAR(511),
   gen gen_carte,
   public_tinta public_tinta_carte,
   dimensiune_mb NUMERIC(5,2) CHECK (dimensiune_mb >= 0),
   numar_pagini INT CHECK (numar_pagini >= 0),
   data_adaugarii DATE DEFAULT current_date,
   sursa sursa_carte DEFAULT 'digital_native',
   limba TEXT,
   serie BOOLEAN DEFAULT FALSE
);

INSERT INTO carti (titlu, autor, descriere, imagine, gen, public_tinta, dimensiune_mb, numar_pagini, data_adaugarii, sursa,limba, serie) VALUES
('It Ends with Us', 'Colleen Hoover', 'Roman despre iubire, limite personale si vindecare emotionala.', 'it-ends-with-us.jpg', 'romance', 'adulti', 6.30, 376, '2026-04-01', 'digital_native','engleza, romana', FALSE),
('The Love Hypothesis', 'Ali Hazelwood', 'O poveste romantica in mediul academic, cu mult umor si tensiune.', 'the-love-hypothesis.jpg', 'romance', 'adulti', 4.10, 368, '2026-04-02', 'digital_native','engleza, romana', FALSE),
('Heartstopper Vol. 1', 'Alice Oseman', 'Poveste grafica despre prietenie, identitate si primele emotii.', 'heartstopper-1.jpg', 'romance', 'adolescenti', 2.65, 288, '2026-04-03', 'scanare', 'engleza, romana', TRUE),
('Twisted Love', 'Ana Huang', 'Relatie intensa marcata de secrete si protectie.', 'twisted-love.jpg', 'romance', 'adulti', 7.20, 448, '2026-04-04', 'digital_native','engleza', TRUE),
('Beach Read', 'Emily Henry', 'Doi autori rivali ajung sa se cunoasca intr-o vara plina de provocari.', 'beach-read.jpg', 'romance', 'adulti', 3.90, 384, '2026-04-05', 'proiect_extern', 'romana', FALSE),
('Fourth Wing', 'Rebecca Yarros', 'Academie de razboi, dragoni si o eroina care lupta sa supravietuiasca.', 'fourth-wing.jpg', 'fantasy', 'adolescenti', 9.45, 528, '2026-04-06', 'digital_native', 'engleza, romana', TRUE),
('A Court of Thorns and Roses', 'Sarah J. Maas', 'Lume fermecata, blesteme vechi si alegeri imposibile.', 'a-court-of-thorns-and-roses.jpg', 'fantasy', 'adulti', 8.70, 448, '2026-04-07', 'scanare', 'engleza, romana', TRUE),
('The Cruel Prince', 'Holly Black', 'Intrigi de curte intr-un regat al zanelor periculos si seducator.', 'the-cruel-prince.jpg', 'fantasy', 'adolescenti', 4.80, 384, '2026-04-08', 'digital_native', 'engleza', TRUE),
('Percy Jackson and the Lightning Thief', 'Rick Riordan', 'Aventura mitologica pentru cititori tineri, plina de umor.', 'percy-jackson-and-the-lightning-thief.jpg', 'fantasy', 'copii', 5.35, 416, '2026-04-09', 'proiect_extern', 'romana, engleza', TRUE),
('Amari and the Night Brothers', 'B.B. Alston', 'Detectiv magic si mistere intr-o lume ascunsa.', 'amari-and-the-night-brothers.jpg', 'fantasy', 'copii', 3.20, 416, '2026-04-10', 'digital_native', 'engleza, romana', TRUE),
('Verity', 'Colleen Hoover', 'Thriller psihologic despre un manuscris care schimba adevarul.', 'verity.jpg', 'thriller', 'adulti', 5.10, 336, '2026-04-11', 'scanare','engleza', FALSE),
('The Silent Patient', 'Alex Michaelides', 'O pacienta care nu mai vorbeste si un terapeut obsedat de adevar.', 'the-silent-patient.jpg', 'thriller', 'adulti', 3.95, 352, '2026-04-12', 'digital_native', 'romana, engleza', FALSE),
('One of Us Is Lying', 'Karen M. McManus', 'Mister de liceu: cinci intra in detentie, doar patru ies.', 'one-of-us-is-lying.jpg', 'thriller', 'adolescenti', 4.25, 360, '2026-04-13', 'digital_native', 'engleza', TRUE),
('A Good Girl''s Guide to Murder', 'Holly Jackson', 'Investigatie scolara care scoate la iveala secrete locale.', 'good-girls-guide.jpg', 'thriller', 'adolescenti', 4.55, 448, '2026-04-14', 'proiect_extern', 'engleza, romana', TRUE),
('Gone Girl', 'Gillian Flynn', 'Disparitie misterioasa si manipulare intr-un cuplu aparent perfect.', 'gone-girl.jpg', 'thriller', 'adulti', 6.80, 432, '2026-04-15', 'scanare', 'romana, engleza', FALSE),
('The Housemaid', 'Freida McFadden', 'Un job banal devine un cosmar intr-o casa cu reguli ciudate.', 'the-housemaid.jpg', 'thriller', 'adulti', 3.85, 336, '2026-04-16', 'digital_native', 'romana, engleza', FALSE ),
('The Inheritance Games', 'Jennifer Lynn Barnes', 'Mostenire, puzzle-uri si competitie intr-o familie bogata.', 'inheritance-games.jpg', 'thriller', 'adolescenti', 4.75, 384, '2026-04-17', 'digital_native', 'engleza', TRUE),
('Six of Crows', 'Leigh Bardugo', 'Echipa de tineri infractori planifica un jaf imposibil.', 'six-of-crows.jpg', 'fantasy', 'adolescenti', 8.10, 544, '2026-04-18', 'digital_native', 'engleza', TRUE),
('Caraval', 'Stephanie Garber', 'Doua surori intra intr-un joc magic unde nimic nu e sigur.', 'caraval.jpg', 'fantasy', 'adolescenti', 5.80, 416, '2026-04-19', 'proiect_extern', 'romana, engleza', TRUE),
('The Hating Game', 'Sally Thorne', 'Rivalitate la birou care se transforma intr-o poveste de dragoste.', 'the-hating-game.jpg', 'romance', 'adulti', 3.70, 352, '2026-04-20', 'digital_native', 'romana', FALSE);
