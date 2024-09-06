import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Form, Button, Container, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const PatrimoineChart = () => {
  const [possessions, setPossessions] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [chartData, setChartData] = useState({});
  const [patrimoineTotal, setPatrimoineTotal] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [patrimoineValueOnDate, setPatrimoineValueOnDate] = useState(null);

  useEffect(() => {
    // Fetch possessions data
    fetch('https://back-pat2-0.onrender.com/api/possessions')
      .then(response => response.json())
      .then(data => setPossessions(data))
      .catch(error => console.error('Error fetching possessions:', error));
  }, []);

  const calculatePatrimoine = (start, end) => {
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

        if (currentTime < dateDebut || (dateFin && currentTime > dateFin)) {
          return acc;
        }

        let valeurActuelle = possession.valeur;

        if (possession.tauxAmortissement) {
          const anneeAmort = (currentTime - dateDebut) / (1000 * 60 * 60 * 24 * 365);
          const tauxAmort = valeurActuelle * (possession.tauxAmortissement / 100) * anneeAmort;
          valeurActuelle = Math.max(0, valeurActuelle - tauxAmort);
        }

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

  const calculatePatrimoineOnDate = (date) => {
    if (!date) return;

    const selectedTime = new Date(date).getTime();
    const valueOnDate = possessions.reduce((acc, possession) => {
      const dateDebut = new Date(possession.dateDebut).getTime();
      const dateFin = possession.dateFin ? new Date(possession.dateFin).getTime() : null;

      if (selectedTime < dateDebut || (dateFin && selectedTime > dateFin)) {
        return acc;
      }

      let valeurActuelle = possession.valeur;

      if (possession.tauxAmortissement) {
        const anneeAmort = (selectedTime - dateDebut) / (1000 * 60 * 60 * 24 * 365);
        const tauxAmort = valeurActuelle * (possession.tauxAmortissement / 100) * anneeAmort;
        valeurActuelle = Math.max(0, valeurActuelle - tauxAmort);
      }

      if (possession.valeurConstante) {
        valeurActuelle += possession.valeurConstante;
      }

      return acc + valeurActuelle;
    }, 0);

    setPatrimoineValueOnDate(valueOnDate);
  };

  return (
    <Container>
      <h1 className="my-4">Gestion du Patrimoine</h1>

      {/* Section Patrimoine à une Date Spécifique */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Valeur du Patrimoine à une Date Spécifique</Card.Title>
          <Form.Group className="mb-3">
            <Form.Label>Sélectionnez une date</Form.Label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => {
                setSelectedDate(date);
                calculatePatrimoineOnDate(date);
              }}
              dateFormat="yyyy-MM-dd"
              className="form-control"
            />
          </Form.Group>
          {patrimoineValueOnDate !== null && (
            <h4>Valeur du Patrimoine à cette date : {patrimoineValueOnDate.toFixed(2)}</h4>
          )}
        </Card.Body>
      </Card>

      {/* Section Graphique du Patrimoine entre deux dates */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Évolution du Patrimoine</Card.Title>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Date de début</Form.Label>
              <Form.Control
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date de fin</Form.Label>
              <Form.Control
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
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
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PatrimoineChart;
