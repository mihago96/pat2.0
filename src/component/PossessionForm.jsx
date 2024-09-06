import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

const PossessionForm = ({ initialForm = {}, onSubmit }) => {
  const [form, setForm] = useState({
    libelle: '',
    valeur: '',
    dateDebut: '',
    dateFin: '',
    tauxAmortissement: '',
    jour: '',
    valeurConstante: '',
    ...initialForm
  });

  useEffect(() => {
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
    onSubmit(form);
    setForm({
      libelle: '',
      valeur: '',
      dateDebut: '',
      dateFin: '', 
      tauxAmortissement: '',
      jour: '',
      valeurConstante: ''
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
        <Form.Label>Date de fin</Form.Label> {/* Ajout du champ dateFin */}
        <Form.Control
          type="date"
          name="dateFin"
          value={form.dateFin.split('T')[0]}  // Format pour l'input date
          onChange={handleChange}
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
        {initialForm ? 'Modifier' : 'Ajouter'}
      </Button>
    </Form>
  );
};

export default PossessionForm;