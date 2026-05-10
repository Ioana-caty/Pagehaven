-- 1. Ștergem tabelul (CASCADE rupe legăturile cu tipurile ENUM)
DROP TABLE IF EXISTS carti CASCADE;

-- 2. Acum putem șterge tipurile fără eroare
DROP TYPE IF EXISTS gen_carte;
DROP TYPE IF EXISTS public_tinta_carte;
DROP TYPE IF EXISTS format_carte;

-- 3. Recreăm tipurile
CREATE TYPE gen_carte AS ENUM ('romance', 'fantasy', 'thriller');
CREATE TYPE public_tinta_carte AS ENUM ('copii', 'adolescenti', 'adulti');
CREATE TYPE format_carte AS ENUM ('EPUB', 'MOBI', 'PDF');

-- 4. Recreăm tabelul
CREATE TABLE IF NOT EXISTS carti (
   id SERIAL PRIMARY KEY,
   titlu VARCHAR(255) NOT NULL,
   descriere TEXT,
   imagine VARCHAR(511),
   gen gen_carte,
   public_tinta public_tinta_carte,
   dimensiune_mb NUMERIC(5,2) CHECK (dimensiune_mb >= 0),
   numar_pagini INT CHECK (numar_pagini >= 0),
   data_adaugarii DATE DEFAULT current_date,
   format format_carte,
   limba TEXT, -- valori multiple separate prin virgula (ex: 'romana, engleza')
   serie BOOLEAN DEFAULT FALSE
);

INSERT INTO carti (titlu, descriere, imagine, gen, public_tinta, dimensiune_mb, numar_pagini, data_adaugarii, format, limba, serie) VALUES
('It Ends with Us', 'Roman despre iubire, limite personale si vindecare emotionala.', 'it-ends-with-us.jpg', 'romance', 'adulti', 6.30, 376, '2026-04-01', 'PDF', 'engleza, romana', FALSE),
('The Love Hypothesis', 'O poveste romantica in mediul academic, cu mult umor si tensiune.', 'the-love-hypothesis.jpg', 'romance', 'adulti', 4.10, 368, '2026-04-02', 'EPUB', 'engleza, romana', FALSE),
('Heartstopper Vol. 1', 'Poveste grafica despre prietenie, identitate si primele emotii.', 'heartstopper-1.jpg', 'romance', 'adolescenti', 2.65, 288, '2026-04-03', 'EPUB', 'engleza, romana', TRUE),
('Twisted Love', 'Relatie intensa marcata de secrete si protectie.', 'twisted-love.jpg', 'romance', 'adulti', 7.20, 448, '2026-04-04', 'MOBI', 'engleza', TRUE),
('Beach Read', 'Doi autori rivali ajung sa se cunoasca intr-o vara plina de provocari.', 'beach-read.jpg', 'romance', 'adulti', 3.90, 384, '2026-04-05', 'PDF', 'romana', FALSE),
('Fourth Wing', 'Academie de razboi, dragoni si o eroina care lupta sa supravietuiasca.', 'fourth-wing.jpg', 'fantasy', 'adolescenti', 9.45, 528, '2026-04-06', 'MOBI', 'engleza, romana', TRUE),
('A Court of Thorns and Roses', 'Lume fermecata, blesteme vechi si alegeri imposibile.', 'acotar.jpg', 'fantasy', 'adulti', 8.70, 448, '2026-04-07', 'PDF', 'engleza, romana', TRUE),
('The Cruel Prince', 'Intrigi de curte intr-un regat al zanelor periculos si seducator.', 'the-cruel-prince.jpg', 'fantasy', 'adolescenti', 4.80, 384, '2026-04-08', 'EPUB', 'engleza', TRUE),
('Percy Jackson and the Lightning Thief', 'Aventura mitologica pentru cititori tineri, plina de umor.', 'percy-jackson-1.jpg', 'fantasy', 'copii', 5.35, 416, '2026-04-09', 'PDF', 'romana, engleza', TRUE),
('Amari and the Night Brothers', 'Detectiv magic si mistere intr-o lume ascunsa.', 'amari-night-brothers.jpg', 'fantasy', 'copii', 3.20, 416, '2026-04-10', 'EPUB', 'engleza, romana', TRUE),
('Verity', 'Thriller psihologic despre un manuscris care schimba adevarul.', 'verity.jpg', 'thriller', 'adulti', 5.10, 336, '2026-04-11', 'EPUB', 'engleza', FALSE),
('The Silent Patient', 'O pacienta care nu mai vorbeste si un terapeut obsedat de adevar.', 'the-silent-patient.jpg', 'thriller', 'adulti', 3.95, 352, '2026-04-12', 'PDF', 'romana, engleza', FALSE),
('One of Us Is Lying', 'Mister de liceu: cinci intra in detentie, doar patru ies.', 'one-of-us-is-lying.jpg', 'thriller', 'adolescenti', 4.25, 360, '2026-04-13', 'MOBI', 'engleza', TRUE),
('A Good Girl''s Guide to Murder', 'Investigatie scolara care scoate la iveala secrete locale.', 'good-girls-guide.jpg', 'thriller', 'adolescenti', 4.55, 448, '2026-04-14', 'EPUB', 'engleza, romana', TRUE),
('Gone Girl', 'Disparitie misterioasa si manipulare intr-un cuplu aparent perfect.', 'gone-girl.jpg', 'thriller', 'adulti', 6.80, 432, '2026-04-15', 'MOBI', 'romana, engleza', FALSE),
('The Housemaid', 'Un job banal devine un cosmar intr-o casa cu reguli ciudate.', 'the-housemaid.jpg', 'thriller', 'adulti', 3.85, 336, '2026-04-16', 'PDF', 'romana, engleza', FALSE),
('The Inheritance Games', 'Mostenire, puzzle-uri si competitie intr-o familie bogata.', 'inheritance-games.jpg', 'thriller', 'adolescenti', 4.75, 384, '2026-04-17', 'PDF', 'engleza', TRUE),
('Six of Crows', 'Echipa de tineri infractori planifica un jaf imposibil.', 'six-of-crows.jpg', 'fantasy', 'adolescenti', 8.10, 544, '2026-04-18', 'PDF', 'engleza', TRUE),
('Caraval', 'Doua surori intra intr-un joc magic unde nimic nu e sigur.', 'caraval.jpg', 'fantasy', 'adolescenti', 5.80, 416, '2026-04-19', 'MOBI', 'romana, engleza', TRUE),
('The Hating Game', 'Rivalitate la birou care se transforma intr-o poveste de dragoste.', 'the-hating-game.jpg', 'romance', 'adulti', 3.70, 352, '2026-04-20', 'PDF', 'romana', FALSE);
