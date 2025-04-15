import React from "react";
import { motion } from "framer-motion";

const AboutUs = () => {
  return (
    <div className="container mt-5">


      <motion.div
        className="card shadow-lg p-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="mb-3">A digitális világ lehetőségei</h2>
        <p>
          A digitális világ rohamos fejlődése új lehetőségeket teremtett a közösségek szerveződésére és az események hatékony lebonyolítására.
        </p>
        <p>
          Manapság egyre nagyobb igény van arra, hogy a személyes és szakmai találkozók – legyen szó koncertekről, workshopokról, előadásokról vagy akár baráti összejövetelekről – átláthatóan, gyorsan és egyszerűen megszervezhetők legyenek.
        </p>
      </motion.div>

      <motion.div
        className="card shadow-lg p-4 mt-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="mb-3">Célunk</h2>
        <p>
          A projekt fő célja, hogy megkönnyítse az eseményszervezés minden lépését, a tervezéstől a részvételig. 
          Interaktív platformunk lehetőséget kínál az intuitív eseménykezelésre és részvételi visszajelzések követésére.
        </p>
      </motion.div>

      <motion.div
        className="card shadow-lg p-4 mt-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="mb-3">A rendszer felépítése</h2>
        <ul>
          <li><strong>Frontend:</strong> Reszponzív és modern vizuális felület, amely lehetővé teszi a könnyű navigációt.</li>
          <li><strong>Backend:</strong> Az üzleti logika megvalósítása és az adatok biztonságos kezelése.</li>
          <li><strong>Adatbázis:</strong> Megbízható és strukturált adatkezelés az események és felhasználók számára.</li>
        </ul>
      </motion.div>

      <motion.div
        className="card shadow-lg p-4 mt-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="mb-3">Amit képviselünk</h2>
        <p>
          Hiszünk abban, hogy a technológia nemcsak megkönnyíti az emberek életét, hanem új kapcsolatok létrejöttét is elősegítheti.
          Platformunk egy közösségi tér, ahol az emberek könnyebben találhatnak egymásra – akár hobbik, érdeklődési körök vagy szakmai célok mentén.
        </p>
      </motion.div>
    </div>
  );
};

export default AboutUs;
