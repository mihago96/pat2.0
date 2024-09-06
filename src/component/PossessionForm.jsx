import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

const PossessionForm = ({ initialForm = {}, onSubmit }) => {
  const today = new Date().toISOString().split('T')[0]; // Date d'aujourd'hui en format YYYY-MM-DD

  const [form, setForm] = useState({
    libelle: '',
    valeur: '',
    dateDebut: '',
    dateFin: '', // Date de fin par défaut à aujourd'hui
    tauxAmortissement: '',
    jour: '',
    valeurConstante: '',
    ...initialForm
  });

  useEffect(() => {
    // Met à jour le formulaire avec les données initiales, si elles sont fournies
    setForm({ ...form, ...initialForm });
  }, [initialForm]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Préparer le formulaire pour soumission
    const updatedForm = { ...form };

    // Si la date de fin est la date par défaut, on peut la mettre à null ou une autre valeur
    if (updatedForm.dateFin === today) {
      updatedForm.dateFin = null; // ou une autre valeur comme une chaîne vide si cela convient mieux à votre backend
    }

    onSubmit(updatedForm);
    setForm({
      libelle: '',
      valeur: '',
      dateDebut: '',
      dateFin: '', // Réinitialiser à la date d'aujourd'hui
      tauxAmortissement: '',
      jour: '',
      valeurConstante: ''
    });
  };

  const handleSetCurrentDate = () => {
    const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
    setForm({
      ...form,
      dateFin: today
    });
  };

  return (
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
          value={form.dateDebut.split('T')[0]}  // Format pour l'input date
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Date de fin</Form.Label>
        <Form.Control
          type="text"
          name="dateFin"
          placeholder="YYYY-MM-DD (optionnelle)"
          value={form.dateFin}
          onChange={handleChange}
        />
         <Button
          variant="secondary"
          onClick={handleSetCurrentDate}
          style={{ marginTop: '10px' }}
        >
          Insérer la date actuelle
        </Button>
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
        {initialForm ? 'Modifier' : 'Ajouter'}
      </Button>
    </Form>
  );
};

export default PossessionForm;
