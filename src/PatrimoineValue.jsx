import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function PatrimoineValue() {
  const [data, setData] = useState(null);
  const [date, setDate] = useState(new Date());
  const [valeurPat, setValeurPat] = useState(null);

  // Appel à l'API pour récupérer les données
  useEffect(() => {
    fetch('http://localhost:5000/api/patrimoine')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Erreur:', error));
  }, []);

  const calculateValeurPat = () => {
    if (!data) return;

    const possessions = data[1].data.possessions;  // Assure-toi que c'est l'index correct
    const time = date.getTime();

    const valeur = possessions.reduce((acc, possession) => {
      const dateDebut = new Date(possession.dateDebut).getTime();
      const dateFin = possession.dateFin ? new Date(possession.dateFin).getTime() : null;

      if (time < dateDebut || (dateFin && time > dateFin)) {
        return acc;
      }

      let valeurActuelle = possession.valeur;

      if (possession.tauxAmortissement) {
        const anneeAmort = (time - dateDebut) / (1000 * 60 * 60 * 24 * 365);
        const tauxAmort = valeurActuelle * (possession.tauxAmortissement / 100) * anneeAmort;
        valeurActuelle = Math.max(0, valeurActuelle - tauxAmort);
      }

      if (possession.valeurConstante) {
        valeurActuelle += possession.valeurConstante;
      }

      return acc + valeurActuelle;
    }, 0);

    setValeurPat(valeur);
  };

  if (!data) return <div>Chargement...</div>;

  return (
    <div className="App">
      <h2>Patrimoine de {data[1].data.possesseur.nom} : {valeurPat !== null && <span>{valeurPat} Ar</span>}</h2>
      <DatePicker selected={date} onChange={date => setDate(date)} />
      <button onClick={calculateValeurPat}>Calculer Valeur</button>
      {/* Tableau des possessions */}
    </div>
  );
}

export default PatrimoineValue;