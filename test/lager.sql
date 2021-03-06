/* Uebungsdatenbank Lagerhaltung */
PRAGMA foreign_keys = ON;
drop table if exists lieferungen;
drop table if exists produkte;
drop table if exists Lieferanten;
drop table if exists lager;
CREATE TABLE Lager (
       Lager             VARCHAR(10)NOT NULL,
       Kapazitaet        NUMERIC(5) DEFAULT 0 NOT NULL,
       Gekuehlt          NUMERIC(1) DEFAULT 0 NOT NULL CHECK (Gekuehlt in (0,1)),
       Strasse           varchar(20),
       Ort               varchar(20) ,
       CONSTRAINT PK_LAGER PRIMARY KEY (Lager)
);
CREATE TABLE Lieferanten  (
       Lieferant       varchar(20) NOT NULL,
       Strasse         varchar(20) ,
       Ort             varchar(20),
       PRIMARY KEY (LIEFERANT)
);
CREATE TABLE Produkte (
       Name            varchar(20) NOT NULL,
       Groesse         NUMERIC(5,2) DEFAULT 0 NOT NULL,
       Preis           NUMERIC(5,2) DEFAULT 0 NOT NULL,
       Kuehlen         NUMERIC(1) DEFAULT 0 NOT NULL CHECK (Kuehlen in (0,1)),
       Beschreibung    varchar(40),
	   Lieferant       varchar(20),
       PRIMARY KEY (Name),
	   FOREIGN KEY( Lieferant) REFERENCES LIeferanten( Lieferant)
);
CREATE TABLE Lieferungen (
       Produkt           varchar(20) NOT NULL REFERENCES Produkte (Name),
       Lager             varchar(10) NOT NULL REFERENCES Lager (Lager),
       Haltbarkeitsdatum DATE NOT NULL,
       HaltbarkeitText   varchar( 30) ,
       Anzahl            INT DEFAULT 0 NOT NULL,
       PRIMARY KEY (Produkt, Lager, Haltbarkeitsdatum),
	   FOREIGN KEY(Produkt) REFERENCES Produkte(Name),
	   FOREIGN KEY(Lager) REFERENCES Lager(Lager)
);
INSERT INTO LIEFERANTEN (LIEFERANT, STRASSE, ORT) VALUES ('Molkerei', 'Milchstraße 7', 'Bauerndorf');
INSERT INTO LIEFERANTEN (LIEFERANT, STRASSE, ORT) VALUES ('Brauerei', 'Braugasse 1', 'Bierstadt');
INSERT INTO LIEFERANTEN (LIEFERANT, STRASSE, ORT) VALUES ('Bäckerei', 'Küchengarten 6', 'Hannover');
INSERT INTO LIEFERANTEN (LIEFERANT, STRASSE, ORT) VALUES ('Käserei', 'Neben der Kuh 13', 'Großdorf');

INSERT INTO LAGER (LAGER, KAPAZITAET, GEKUEHLT, STRASSE, ORT) VALUES ('N1', 1000, 0, 'Lagerstraße 1A', 'Hannover');
INSERT INTO LAGER (LAGER, KAPAZITAET, GEKUEHLT, STRASSE, ORT) VALUES ('N2', 300, 0, 'Hallenstraße 17', 'Düsseldorf');
INSERT INTO LAGER (LAGER, KAPAZITAET, GEKUEHLT, STRASSE, ORT) VALUES ('K1', 700, 1, 'Kalter Kaffee 24', 'Nürnberg');
INSERT INTO LAGER (LAGER, KAPAZITAET, GEKUEHLT, STRASSE, ORT) VALUES ('K2', 200, 1, 'Kühler Norden 6', 'Hamburg');
INSERT INTO LAGER (LAGER, KAPAZITAET, GEKUEHLT, STRASSE, ORT) VALUES ('E1', 200, 1, 'Ersatzhalle 1', 'Frankfurt');

INSERT INTO PRODUKTE (NAME, GROESSE, PREIS, KUEHLEN, LIEFERANT, BESCHREIBUNG) VALUES ('Milch', 1, 1.69, 1, 'Molkerei', '3,5% Fett');
INSERT INTO PRODUKTE (NAME, GROESSE, PREIS, KUEHLEN, LIEFERANT, BESCHREIBUNG) VALUES ('Joghurt', 0.2, 0.89, 1, 'Molkerei', 'Der Milde');
INSERT INTO PRODUKTE (NAME, GROESSE, PREIS, KUEHLEN, LIEFERANT, BESCHREIBUNG) VALUES ('Butter', 0.25, 1.5, 0, 'Molkerei', 'Die Gute');
INSERT INTO PRODUKTE (NAME, GROESSE, PREIS, KUEHLEN, LIEFERANT, BESCHREIBUNG) VALUES ('Bier', 0.33, 0.85, 0, 'Brauerei', 'Pilsener Brauart');
INSERT INTO PRODUKTE (NAME, GROESSE, PREIS, KUEHLEN, LIEFERANT, BESCHREIBUNG) VALUES ('Alt', 0.33, 0.89, 0, NULL, 'Altbier');
INSERT INTO PRODUKTE (NAME, GROESSE, PREIS, KUEHLEN, LIEFERANT, BESCHREIBUNG) VALUES ('Brot', 1.2, 2.69, 0, 'Bäckerei', 'Roggenvollkornbrot');
INSERT INTO PRODUKTE (NAME, GROESSE, PREIS, KUEHLEN, LIEFERANT, BESCHREIBUNG) VALUES ('Brötchen', 0.15, 0.59, 0, 'Bäckerei', 'Feierabendbrötchen');
INSERT INTO PRODUKTE (NAME, GROESSE, PREIS, KUEHLEN, LIEFERANT, BESCHREIBUNG) VALUES ('Camembert', 0.2, 3.99, 1, NULL, '60% F.i.Tr.');
INSERT INTO PRODUKTE (NAME, GROESSE, PREIS, KUEHLEN, LIEFERANT, BESCHREIBUNG) VALUES ('Edamer', 0.5, 8.7, 1, 'Käserei', NULL);

INSERT INTO LIEFERUNGEN (PRODUKT, LAGER, HALTBARKEITSDATUM, HALTBARKEITTEXT, ANZAHL) VALUES ('Milch', 'K1', CURRENT_DATE, 'CURRENT_DATE', 200);
INSERT INTO LIEFERUNGEN (PRODUKT, LAGER, HALTBARKEITSDATUM, HALTBARKEITTEXT, ANZAHL) VALUES ('Joghurt', 'K1', CURRENT_DATE + 3, 'CURRENT_DATE + 3', 500);
INSERT INTO LIEFERUNGEN (PRODUKT, LAGER, HALTBARKEITSDATUM, HALTBARKEITTEXT, ANZAHL) VALUES ('Milch', 'K1', CURRENT_DATE + 7, 'CURRENT_DATE + 7', 150);
INSERT INTO LIEFERUNGEN (PRODUKT, LAGER, HALTBARKEITSDATUM, HALTBARKEITTEXT, ANZAHL) VALUES ('Bier', 'K1', CURRENT_DATE + 92, 'CURRENT_DATE + 92', 300);
INSERT INTO LIEFERUNGEN (PRODUKT, LAGER, HALTBARKEITSDATUM, HALTBARKEITTEXT, ANZAHL) VALUES ('Milch', 'K2', CURRENT_DATE +10, 'CURRENT_DATE +10', 100);
INSERT INTO LIEFERUNGEN (PRODUKT, LAGER, HALTBARKEITSDATUM, HALTBARKEITTEXT, ANZAHL) VALUES ('Joghurt', 'K2', CURRENT_DATE - 2, 'CURRENT_DATE - 2', 300);
INSERT INTO LIEFERUNGEN (PRODUKT, LAGER, HALTBARKEITSDATUM, HALTBARKEITTEXT, ANZAHL) VALUES ('Camembert', 'K2', CURRENT_DATE, 'CURRENT_DATE', 100);
INSERT INTO LIEFERUNGEN (PRODUKT, LAGER, HALTBARKEITSDATUM, HALTBARKEITTEXT, ANZAHL) VALUES ('Brot', 'N1', CURRENT_DATE + 108, 'CURRENT_DATE + 108', 500);
INSERT INTO LIEFERUNGEN (PRODUKT, LAGER, HALTBARKEITSDATUM, HALTBARKEITTEXT, ANZAHL) VALUES ('Bier', 'N1', CURRENT_DATE + 40, 'CURRENT_DATE + 40', 300);
INSERT INTO LIEFERUNGEN (PRODUKT, LAGER, HALTBARKEITSDATUM, HALTBARKEITTEXT, ANZAHL) VALUES ('Brötchen', 'N1', CURRENT_DATE - 3, 'CURRENT_DATE - 3', 800);
INSERT INTO LIEFERUNGEN (PRODUKT, LAGER, HALTBARKEITSDATUM, HALTBARKEITTEXT, ANZAHL) VALUES ('Brötchen', 'N1', CURRENT_DATE + 15, 'CURRENT_DATE + 15', 400);
INSERT INTO LIEFERUNGEN (PRODUKT, LAGER, HALTBARKEITSDATUM, HALTBARKEITTEXT, ANZAHL) VALUES ('Butter', 'N1', CURRENT_DATE+3, 'CURRENT_DATE + 3', 300);
INSERT INTO LIEFERUNGEN (PRODUKT, LAGER, HALTBARKEITSDATUM, HALTBARKEITTEXT, ANZAHL) VALUES ('Brötchen', 'N2', CURRENT_DATE + 1, 'CURRENT_DATE + 1', 500);
INSERT INTO LIEFERUNGEN (PRODUKT, LAGER, HALTBARKEITSDATUM, HALTBARKEITTEXT, ANZAHL) VALUES ('Alt', 'N2', CURRENT_DATE + 45, 'CURRENT_DATE + 45', 200);