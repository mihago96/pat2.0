import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Possessions = () => {
  const [possessions, setPossessions] = useState([]);
  const [form, setForm] = useState({ libelle: '', valeur: '', dateDebut: '',dateFin: '', tauxAmortissement: '', jour: '', valeurConstante: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Appel à l'API pour récupérer les possessions
    fetch('http://localhost:5000/api/possessions')
      .then((response) => response.json())
      .then((data) => setPossessions(data))
      .catch((error) => console.error('Erreur lors de la récupération des données :', error));
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      // Mise à jour d'une possession existante
      fetch(`http://localhost:5000/api/possessions/${editIndex}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })
        .then((response) => response.json())
        .then((updatedPossession) => {
          const updatedPossessions = possessions.map((possession, index) =>
            index === editIndex ? updatedPossession : possession
          );
          setPossessions(updatedPossessions);
          setIsEditing(false);
          setShowModal(false);
        });
    } else {
      // Création d'une nouvelle possession
      fetch('http://localhost:5000/api/possessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })
        .then((response) => response.json())
        .then((newPossession) => {
          setPossessions([...possessions, newPossession]);
          setShowModal(false);
        });
    }
    setForm({ libelle: '', valeur: '', dateDebut: '',dateFin: '', tauxAmortissement: '', jour: '', valeurConstante: '' });
  };

  const handleEdit = (index) => {
    setForm(possessions[index]);
    setIsEditing(true);
    setEditIndex(index);
    setShowModal(true);
  };

  const handleDelete = (index) => {
    fetch(`http://localhost:5000/api/possessions/${index}`, {
      method: 'DELETE',
    }).then(() => {
      const updatedPossessions = possessions.filter((_, i) => i !== index);
      setPossessions(updatedPossessions);
    });
  };

  return (
    <div className="container mt-4">
      <h1>Liste des Possessions</h1>
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Ajouter une nouvelle possession
      </Button>
      <Table striped bordered hover className="mt-3">
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
                <Button variant="warning" onClick={() => handleEdit(index)} className="me-2">
                  Modifier
                </Button>
                <Button variant="danger" onClick={() => handleDelete(index)}>
                  Supprimer
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal pour ajouter/modifier une possession */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Modifier la possession' : 'Ajouter une nouvelle possession'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Libellé</Form.Label>
              <Form.Control
                type="text"
                name="libelle"
                placeholder="Libellé"
                value={form.libelle}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Valeur</Form.Label>
              <Form.Control
                type="number"
                name="valeur"
                placeholder="Valeur"
                value={form.valeur}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date de début</Form.Label>
              <Form.Control
                type="date"
                name="dateDebut"
                placeholder="Date de début"
                value={form.dateDebut}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Taux d'amortissement</Form.Label>
              <Form.Control
                type="number"
                name="tauxAmortissement"
                placeholder="Taux d'amortissement"
                value={form.tauxAmortissement}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Jour</Form.Label>
              <Form.Control
                type="number"
                name="jour"
                placeholder="Jour"
                value={form.jour}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Valeur constante</Form.Label>
              <Form.Control
                type="number"
                name="valeurConstante"
                placeholder="Valeur constante"
                value={form.valeurConstante}
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {isEditing ? 'Modifier' : 'Ajouter'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Possessions;