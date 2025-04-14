import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, Container, Row, Col } from "react-bootstrap";

const Esemenyek = () => {
  const [esemenyek, setEsemenyek] = useState([]);
  const [newEvent, setNewEvent] = useState({
    id: "",
    cime: "",
    helyszin: "",
    datum: "",
    leiras: "",
  });
  const [editEvent, setEditEvent] = useState(null);

  const token = "YOUR_API_TOKEN";

  useEffect(() => {
    axios
      .get(`/api/Esemeny/${token}`)
      .then((response) => {
        setEsemenyek(response.data);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, [token]);

  // Handle input changes for new event
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    axios
      .post(`/api/Esemeny/${token}`, newEvent)
      .then((response) => {
        setEsemenyek([...esemenyek, response.data]);
        setNewEvent({
          cime: "",
          helyszin: "",
          datum: "",
          leiras: "",
        });
      })
      .catch((error) => {
        console.error("Error adding event:", error);
      });
  };

  // Edit an event
  const handleEditEvent = (event) => {
    setEditEvent(event);
  };

  // Save updated event
  const handleUpdateEvent = (e) => {
    e.preventDefault();
    axios
      .put(`/api/Esemeny/${token}`, editEvent)
      .then((response) => {
        const updatedEvents = esemenyek.map((event) =>
          event.Id === response.data.Id ? response.data : event
        );
        setEsemenyek(updatedEvents);
        setEditEvent(null);
      })
      .catch((error) => {
        console.error("Error updating event:", error);
      });
  };

  // Delete an event
  const handleDeleteEvent = (id) => {
    axios
      .delete(`/api/Esemeny/${token},${id}`)
      .then(() => {
        const filteredEvents = esemenyek.filter((event) => event.Id !== id);
        setEsemenyek(filteredEvents);
      })
      .catch((error) => {
        console.error("Error deleting event:", error);
      });
  };

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">Események</h1>

      {/* Event list */}
      <Row>
        {esemenyek.map((event) => (
          <Col sm={12} md={6} lg={4} key={event.Id} className="mb-4">
            <div className="card p-3 shadow-sm">
              <h5>{event.cime}</h5>
              <p>{event.helyszin}</p>
              <p>{new Date(event.datum).toLocaleString()}</p>
              <p>{event.leiras}</p>
              <Button
                variant="primary"
                className="me-2"
                onClick={() => handleEditEvent(event)}
              >
                Szerkesztés
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDeleteEvent(event.id)}
              >
                Törlés
              </Button>
            </div>
          </Col>
        ))}
      </Row>

      {/* Add new event */}
      <h2>Új Esemény</h2>
      <Form onSubmit={handleAddEvent}>
        <Row className="mb-3">
          <Col xs={12} md={6}>
            <Form.Control
              type="text"
              name="cime"
              value={newEvent.cime}
              onChange={handleInputChange}
              placeholder="Esemény címe"
              required
            />
          </Col>
          <Col xs={12} md={6}>
            <Form.Control
              type="text"
              name="helyszin"
              value={newEvent.helyszin}
              onChange={handleInputChange}
              placeholder="Helyszín"
              required
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col xs={12} md={6}>
            <Form.Control
              type="datetime-local"
              name="datum"
              value={newEvent.datum}
              onChange={handleInputChange}
              required
            />
          </Col>
          <Col xs={12}>
            <Form.Control
              as="textarea"
              name="leiras"
              value={newEvent.leiras}
              onChange={handleInputChange}
              placeholder="Esemény leírása"
              rows={3}
              required
            />
          </Col>
        </Row>
        <Button type="submit" variant="success">
          Hozzáadás
        </Button>
      </Form>

      {/* Edit event */}
      {editEvent && (
        <div className="mt-5">
          <h2>Esemény szerkesztése</h2>
          <Form onSubmit={handleUpdateEvent}>
            <Row className="mb-3">
              <Col xs={12} md={6}>
                <Form.Control
                  type="text"
                  name="cime"
                  value={editEvent.cime}
                  onChange={(e) => setEditEvent({ ...editEvent, cime: e.target.value })}
                  placeholder="Esemény címe"
                  required
                />
              </Col>
              <Col xs={12} md={6}>
                <Form.Control
                  type="text"
                  name="helyszin"
                  value={editEvent.helyszin}
                  onChange={(e) => setEditEvent({ ...editEvent, helyszin: e.target.value })}
                  placeholder="Helyszín"
                  required
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col xs={12} md={6}>
                <Form.Control
                  type="datetime-local"
                  name="datum"
                  value={editEvent.datum}
                  onChange={(e) => setEditEvent({ ...editEvent, datum: e.target.value })}
                  required
                />
              </Col>
              <Col xs={12}>
                <Form.Control
                  as="textarea"
                  name="leiras"
                  value={editEvent.leiras}
                  onChange={(e) => setEditEvent({ ...editEvent, leiras: e.target.value })}
                  placeholder="Esemény leírása"
                  rows={3}
                  required
                />
              </Col>
            </Row>
            <Button type="submit" variant="primary">
              Frissítés
            </Button>
          </Form>
        </div>
      )}
    </Container>
  );
};

export default Esemenyek;
