import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Card, Alert } from 'react-bootstrap';

export default function ConfigNegocio() {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ nombre: '', descripcion: '', costo: '' });
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editedService, setEditedService] = useState({ nombre: '', descripcion: '', costo: '' });
  const [alert, setAlert] = useState(null);

  const [datosNegocio, setDatosNegocio] = useState({
    nombre: '',
    categoria: '',
    coordenadas: '',
    descripcion: '',
    imagen: '',
    horariodetencion: '',
  });
  const [datosOriginales, setDatosOriginales] = useState({});

  useEffect(() => {
    setDatosOriginales({ ...datosNegocio });
  }, []);

  const handleServiceChange = (e) => {
    const { name, value } = e.target;
    setNewService(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateService = () => {
    if (!newService.nombre || !newService.descripcion || !newService.costo) return;
    setServices([...services, newService]);
    setNewService({ nombre: '', descripcion: '', costo: '' });
    showAlert('Servicio creado con éxito', 'success');
  };

  const handleDelete = (index) => {
    const updated = [...services];
    updated.splice(index, 1);
    setServices(updated);
    showAlert('Servicio eliminado con éxito', 'danger');
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedService(services[index]);
    setShowModal(true);
  };

  const handleSaveEdit = () => {
    const updated = [...services];
    updated[editIndex] = editedService;
    setServices(updated);
    setShowModal(false);
    showAlert('Servicio editado con éxito', 'info');
  };

  const showAlert = (message, variant) => {
    setAlert({ message, variant });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleNegocioChange = (e) => {
    const { name, value } = e.target;
    setDatosNegocio(prev => ({ ...prev, [name]: value }));
  };

  const hasChanged = JSON.stringify(datosNegocio) !== JSON.stringify(datosOriginales);

  const handleSaveDatos = () => {
    setDatosOriginales({ ...datosNegocio });
    showAlert('Datos del negocio actualizados con éxito', 'success');
  };

  return (
    <div className="container mt-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', color: 'white', padding: '20px', borderRadius: '10px' }}>
      <h3 className="text-center mb-4">Actualiza tu información</h3>
      {alert && <Alert variant={alert.variant}>{alert.message}</Alert>}
      <div className="row">
        <div className="col-md-6 border-end">
          <h5>Servicios</h5>
          <p>Agrega los servicios que ofrece tu negocio para que tus clientes puedan agendar una cita.</p>
          <Form.Control className="mb-2" placeholder="Nombre del servicio" name="nombre" value={newService.nombre} onChange={handleServiceChange} />
          <Form.Control className="mb-2" placeholder="Descripción del servicio" name="descripcion" value={newService.descripcion} onChange={handleServiceChange} />
          <Form.Control className="mb-2" placeholder="Costo" name="costo" value={newService.costo} onChange={handleServiceChange} />
          <Button variant="success" onClick={handleCreateService}>Crear servicio</Button>

          <div className="mt-4">
            {services.map((servicio, index) => (
              <Card key={index} className="mb-2" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }}>
                <Card.Body>
                  <Card.Title>{servicio.nombre}</Card.Title>
                  <Card.Text>{servicio.descripcion}</Card.Text>
                  <Card.Text><strong>Costo:</strong> ${servicio.costo}</Card.Text>
                  <Button size="sm" variant="outline-info" className="me-2" onClick={() => handleEdit(index)}>Editar</Button>
                  <Button size="sm" variant="outline-danger" onClick={() => handleDelete(index)}>Eliminar</Button>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>

        <div className="col-md-6">
          <h5>Datos del Negocio</h5>
          <Form.Control className="mb-2" placeholder="Nombre" name="nombre" value={datosNegocio.nombre} onChange={handleNegocioChange} />
          <Form.Control className="mb-2" placeholder="Categoría" name="categoria" value={datosNegocio.categoria} onChange={handleNegocioChange} />
          <Form.Control className="mb-2" placeholder="Coordenadas" name="coordenadas" value={datosNegocio.coordenadas} onChange={handleNegocioChange} />
          <Form.Control className="mb-2" placeholder="Descripción" name="descripcion" value={datosNegocio.descripcion} onChange={handleNegocioChange} />
         <Form.Control className="mb-2" placeholder="horario de atencion" name="horario de atencion" value={datosNegocio.horariodetencion} onChange={handleNegocioChange} />
          <Form.Control className="mb-2" placeholder="URL de la imagen del negocio" name="imagen" value={datosNegocio.imagen} onChange={handleNegocioChange} />
          <Button variant="primary" disabled={!hasChanged} onClick={handleSaveDatos}>Guardar Datos</Button>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Servicio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control className="mb-2" placeholder="Nombre del servicio" name="nombre" value={editedService.nombre} onChange={(e) => setEditedService({ ...editedService, nombre: e.target.value })} />
          <Form.Control className="mb-2" placeholder="Descripción" name="descripcion" value={editedService.descripcion} onChange={(e) => setEditedService({ ...editedService, descripcion: e.target.value })} />
          <Form.Control className="mb-2" placeholder="Costo" name="costo" value={editedService.costo} onChange={(e) => setEditedService({ ...editedService, costo: e.target.value })} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="info" onClick={handleSaveEdit}>Guardar Cambios</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}