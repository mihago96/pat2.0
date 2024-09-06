import React, { useEffect, useState } from 'react';
import { Table, Button, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const PossessionsTable = ({ onEdit }) => {
  const [possessions, setPossessions] = useState([]);

  useEffect(() => {
    fetchPossessions();
  }, []);

  const fetchPossessions = () => {
    fetch('http://localhost:5000/api/possessions')
      .then(response => response.json())
      .then(data => setPossessions(data))
      .catch(error => console.error('Erreur lors de la récupération des données:', error));
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/api/possessions/${id}`, {
      method: 'DELETE',
    })
      .then(() => fetchPossessions())  // Refresh the possessions list after deletion
      .catch(error => console.error('Erreur lors de la suppression:', error));
  };

  return (
    <Container>
      <h1 className="my-4">Liste des Possessions</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Libellé</th>
            <th>Valeur</th>
            <th>Date de début</th>
            <th>Date de fin</th>
            <th>Taux d'amortissement</th>
            <th>Jour</th>
            <th>Valeur constante</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {possessions.map((possession, index) => (
            <tr key={index}>
              <td>{possession.libelle}</td>
              <td>{possession.valeur}</td>
              <td>{new Date(possession.dateDebut).toLocaleDateString()}</td>
              <td>{possession.dateFin ? new Date(possession.dateFin).toLocaleDateString() : 'N/A'}</td>
              <td>{possession.tauxAmortissement ?? 'N/A'}</td>
              <td>{possession.jour ?? 'N/A'}</td>
              <td>{possession.valeurConstante ?? 'N/A'}</td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => onEdit(possession, index)}
                  className="me-2"
                >
                  Modifier
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(possession.id)} // Assure-toi d'avoir un id unique
                >
                  Supprimer
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default PossessionsTable;