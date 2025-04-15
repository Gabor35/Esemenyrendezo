-- MySqlBackup.NET 2.3.8.0
-- Dump Time: 2025-01-14 10:00:44
-- --------------------------------------
-- Server version 10.4.32-MariaDB mariadb.org binary distribution


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- 
-- Definition of esemeny
-- 

DROP TABLE IF EXISTS `esemeny`;
CREATE TABLE IF NOT EXISTS `esemeny` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Cime` varchar(255) NOT NULL,
  `Helyszin` varchar(255) NOT NULL,
  `Datum` datetime NOT NULL,
  `Leiras` text DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

-- 
-- Dumping data for table esemeny
-- 

/*!40000 ALTER TABLE `esemeny` DISABLE KEYS */;
INSERT INTO `esemeny`(`Id`,`Cime`,`Helyszin`,`Datum`,`Leiras`) VALUES(1,'Lovag torna','Miskolc Diósgyőri vár','2025-11-25 07:37:38','A Lovagi tornák tere a Diósgyőri vár szomszédságában található. Napjainkban közösségi térként funkcionál, a lovas hagyományok ápolását segíti, továbbá különböző koncertek és rendezvények helyszínéül is szolgál.\r\n\r\nSzolgáltatások\r\nLovas sportesemények\r\nA Lovagi Tornák Terén időről időre megrendezésre kerülnek díjugrató és díjlovagló versenyek. A versenypálya mellett melegítőpálya is elérhető, az aréna talaja pedig tökéletesen alkalmas ezekre az eseményekre, hiszen bármilyen időjárás esetén használható és a lovak lábát is kíméli.\r\n\r\nTörténelmi játékok\r\nA Diósgyőri vár legkedveltebb programjai a fegyverbemutatók, csatajelenetek és párviadalok, amikor több lovagrend összecsapásának lehetünk tanúi. A hatalmas népszerűségnek örvendő Középkori Forgatag pontosan ezt a célt szolgálja, hiszen a nyári eseményen az érdeklődők betekintést nyerhetnek ezen kor világába.\r\n\r\nSzínházi előadások, koncertek\r\nAz akár 4000 fő befogadására is alkalmas aréna számos koncert és szabadtéri színházi előadás helyszínéül is szolgál a speciális mobilfedésnek és a mobil lelátóknak köszönhetően. A küzdőtéren több száz állóhely áll rendelkezésre és fedett lelátó is a vendégek kényelmét szolgálja.\r\n\r\nVásártér\r\nA Diósgyőri vár és a Lovagi Tornák Tere is időnként kiköltözik programjaival a Vásártérre, ahol alapvetően kézműves vásárok és utcai kiállítások kerülnek megrendezésre. A Lovagi Tornák Tere előtt kialakított tér hangulatos világításának és környezetének köszönhetően közösségi találkozóhelyként is funkcionál.\r\n\r\nKiállítótér\r\nAz északi lelátó építésekor egy kövezett medrű középkori csatornát találtak a régészek, melyet egy zsilip köt össze a vizesárokkal. Ezen a területen kiállítóteret hoztak létre, ahol a vízvezeték maradványain kívül időszaki kiállításokat is megtekinthetnek a látogatók.');
/*!40000 ALTER TABLE `esemeny` ENABLE KEYS */;

-- 
-- Definition of felhasznalo
-- 

DROP TABLE IF EXISTS `felhasznalo`;
CREATE TABLE IF NOT EXISTS `felhasznalo` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `FelhasznaloNev` varchar(100) NOT NULL,
  `TeljesNev` varchar(60) NOT NULL,
  `SALT` varchar(64) NOT NULL,
  `HASH` varchar(64) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Jogosultsag` int(1) NOT NULL,
  `Aktiv` int(1) NOT NULL,
  `RegisztracioDatuma` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Email` (`Email`),
  UNIQUE KEY `FelhasznaloNev` (`FelhasznaloNev`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

-- 
-- Dumping data for table felhasznalo
-- 

/*!40000 ALTER TABLE `felhasznalo` DISABLE KEYS */;
INSERT INTO `felhasznalo`(`Id`,`FelhasznaloNev`,`TeljesNev`,`SALT`,`HASH`,`Email`,`Jogosultsag`,`Aktiv`,`RegisztracioDatuma`) VALUES(1,'LakatosI','Lakatos István','jQGX8grO1yjNqhiZbtROcseiqj1NVZJd2iqlfxPx1GKLJ9H8smnLJ9dloScCK6Zp','dcedbd2d352d19c6eae0dfb12271b74d985c825b8d774afd2abd0d101b6e57ef','lakatosi@gmail.com',9,1,'2024-11-25 07:33:49'),(2,'TóthI','Tóth István','','','tothi@gmail.com',0,0,'2024-11-25 07:33:49'),(3,'NagyV','Nagy Virág','','','nagyv@gmail.com',0,0,'2024-11-25 07:36:46'),(4,'KissK','Kiss Kata','','','kissk@gmail.com',0,0,'2018-10-23 09:34:31'),(5,'string','string','string','473287f8298dba7163a897908958f7c0eae733e25d2e027992ea2edc9bed2fa8','string',1,0,'2024-12-18 08:30:13'),(6,'string2','string','string','473287f8298dba7163a897908958f7c0eae733e25d2e027992ea2edc9bed2fa8','string2',1,0,'2024-12-18 08:30:13'),(9,'adsafgs9','string','string','string','asfesgfrdgrd9',0,0,'2025-01-14 07:29:24');
/*!40000 ALTER TABLE `felhasznalo` ENABLE KEYS */;

-- 
-- Definition of bejelentkezes
-- 

DROP TABLE IF EXISTS `bejelentkezes`;
CREATE TABLE IF NOT EXISTS `bejelentkezes` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `FelhasznaloID` int(11) NOT NULL,
  `BejelentkezesDatuma` datetime DEFAULT current_timestamp(),
  `IPAddress` varchar(45) DEFAULT NULL,
  `Sikeres` tinyint(1) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `FelhasznaloID` (`FelhasznaloID`),
  CONSTRAINT `bejelentkezes_ibfk_1` FOREIGN KEY (`FelhasznaloID`) REFERENCES `felhasznalo` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

-- 
-- Dumping data for table bejelentkezes
-- 

/*!40000 ALTER TABLE `bejelentkezes` DISABLE KEYS */;

/*!40000 ALTER TABLE `bejelentkezes` ENABLE KEYS */;

-- 
-- Definition of kijelentkezes
-- 

DROP TABLE IF EXISTS `kijelentkezes`;
CREATE TABLE IF NOT EXISTS `kijelentkezes` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `FelhasznaloId` int(11) NOT NULL,
  `KijelentkezesDatuma` datetime DEFAULT current_timestamp(),
  `IPAddress` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `FelhasznaloID` (`FelhasznaloId`),
  CONSTRAINT `kijelentkezes_ibfk_1` FOREIGN KEY (`FelhasznaloId`) REFERENCES `felhasznalo` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

-- 
-- Dumping data for table kijelentkezes
-- 

/*!40000 ALTER TABLE `kijelentkezes` DISABLE KEYS */;

/*!40000 ALTER TABLE `kijelentkezes` ENABLE KEYS */;

-- 
-- Definition of reszvetel
-- 

DROP TABLE IF EXISTS `reszvetel`;
CREATE TABLE IF NOT EXISTS `reszvetel` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `FelhasznaloId` int(11) NOT NULL,
  `EsemenyId` int(11) NOT NULL,
  `Visszajelzes` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `FelhasznaloID` (`FelhasznaloId`,`EsemenyId`),
  KEY `EsemenyID` (`EsemenyId`),
  CONSTRAINT `reszvetel_ibfk_1` FOREIGN KEY (`FelhasznaloId`) REFERENCES `felhasznalo` (`Id`),
  CONSTRAINT `reszvetel_ibfk_2` FOREIGN KEY (`EsemenyId`) REFERENCES `esemeny` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

-- 
-- Dumping data for table reszvetel
-- 

/*!40000 ALTER TABLE `reszvetel` DISABLE KEYS */;
INSERT INTO `reszvetel`(`Id`,`FelhasznaloId`,`EsemenyId`,`Visszajelzes`) VALUES(1,1,1,1),(2,3,1,0);
/*!40000 ALTER TABLE `reszvetel` ENABLE KEYS */;


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;


-- Dump completed on 2025-01-14 10:00:44
-- Total time: 0:0:0:0:240 (d:h:m:s:ms)
