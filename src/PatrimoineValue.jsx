import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Form, Button, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const PatrimoineValue = () => {
  const [possessions, setPossessions] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [chartData, setChartData] = useState({});
  const [patrimoineTotal, setPatrimoineTotal] = useState(null);

  useEffect(() => {
    // Fetch possessions data
    fetch('https://back-pat2-0.onrender.com/api/possessions')
      .then(response => response.json())
      .then(data => setPossessions(data))
      .catch(error => console.error('Error fetching possessions:', error));
  }, []);

  const calculatePatrimoine = (start, end) => {
    if (!start || !end) return;

    const startDate = new Date(start);
    const endDate = new Date(end);
    const dates = [];
    const values = [];
    
    let currentDate = startDate;
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      dates.push(dateStr);

      const currentTime = currentDate.getTime();
      const value = possessions.reduce((acc, possession) => {
        const dateDebut = new Date(possession.dateDebut).getTime();
        const dateFin = possession.dateFin ? new Date(possession.dateFin).getTime() : null;

        // Vérifie si la date actuelle est dans la période de la possession
        if (currentTime < dateDebut || (dateFin && currentTime > dateFin)) {
          return acc;
        }

        let valeurActuelle = possession.valeur;

        // Calcule l'amortissement
        if (possession.tauxAmortissement) {
          const anneeAmort = (currentTime - dateDebut) / (1000 * 60 * 60 * 24 * 365);
          const tauxAmort = valeurActuelle * (possession.tauxAmortissement / 100) * anneeAmort;
          valeurActuelle = Math.max(0, valeurActuelle - tauxAmort);
        }

        // Ajoute la valeur constante
        if (possession.valeurConstante) {
          valeurActuelle += possession.valeurConstante;
        }

        return acc + valeurActuelle;
      }, 0);

      values.push(value);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    setChartData({
      labels: dates,
      datasets: [
        {
          label: 'Valeur du Patrimoine',
          data: values,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 1
        }
      ]
    });

    setPatrimoineTotal(values[values.length - 1]);
  };

  return (
    <Container>
      <h1 className="my-4">Évolution du Patrimoine</h1>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Date de début</Form.Label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy-MM-dd"
            className="form-control"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Date de fin</Form.Label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="yyyy-MM-dd"
            className="form-control"
          />
        </Form.Group>
        <Button
          variant="primary"
          onClick={() => calculatePatrimoine(startDate, endDate)}
        >
          Calculer
        </Button>
      </Form>

      {chartData.labels && (
        <>
          <div className="my-4">
            <Line data={chartData} />
          </div>
          <h3>Valeur Totale du Patrimoine : {patrimoineTotal !== null ? patrimoineTotal.toFixed(2) : 'N/A'}</h3>
        </>
      )}
    </Container>
  );
};

export default PatrimoineValue;
