import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Card, Alert } from 'react-bootstrap';

export default function ConfigNegocio() {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ nombre: '', descripcion: '', precio: '' });
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editedService, setEditedService] = useState({ nombre: '', descripcion: '', precio: '' });
  const [alert, setAlert] = useState(null);

  const [datosNegocio, setDatosNegocio] = useState({
    id: 1,
    nombre: '',
    categoria: '',
    coordenadas: '', // Usamos para llenar direccion en backend
    descripcion: '',
    imagen: '',
    horariodetencion: '',
    idUsuario: 1, // Si no tienes esto, asigna el valor adecuado o quita del payload
  });
  const [datosOriginales, setDatosOriginales] = useState({});

  useEffect(() => {
    fetchDatosNegocio();
    fetchServices();
  }, []);

  const fetchDatosNegocio = async () => {
    try {
      const res = await axios.get(`http://localhost:8081/api/business/1`);
      setDatosNegocio({
        ...res.data,
        coordenadas: res.data.direccion || '',
        imagen: res.data.imagenUrl || '',
        idUsuario: res.data.idUsuario || 1,
      });
      setDatosOriginales(res.data);
    } catch (error) {
      console.error('Error al cargar datos del negocio:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await axios.get(`http://localhost:8081/api/services/businesses/1/services`);
      setServices(res.data);
    } catch (error) {
      console.error('Error al cargar servicios:', error);
    }
  };

  const handleServiceChange = (e) => {
    const { name, value } = e.target;
    setNewService(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateService = async () => {
    if (!newService.nombre || !newService.descripcion || !newService.precio) return;

    try {
      const res = await axios.post(`http://localhost:8081/api/services/businesses/1`, {
        ...newService,
      });
      setServices(prev => [...prev, res.data]);
      setNewService({ nombre: '', descripcion: '', precio: '' });
      showAlert('Servicio creado con éxito', 'success');
    } catch (error) {
      console.error('Error al crear servicio:', error);
      showAlert('Error al crear servicio', 'danger');
    }
  };

  const handleDelete = async (index) => {
    const servicio = services[index];
    try {
      await axios.delete(`http://localhost:8081/api/services/${servicio.id}`);
      const updated = services.filter((_, i) => i !== index);
      setServices(updated);
      showAlert('Servicio eliminado con éxito', 'danger');
    } catch (error) {
      console.error('Error al eliminar servicio:', error);
      showAlert('Error al eliminar servicio', 'danger');
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedService(services[index]);
    setShowModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      const res = await axios.put(`http://localhost:8081/api/services/${editedService.id}`, {
        ...editedService,
      });
      const updated = [...services];
      updated[editIndex] = res.data;
      setServices(updated);
      setShowModal(false);
      showAlert('Servicio editado con éxito', 'info');
    } catch (error) {
      console.error('Error al editar servicio:', error);
      showAlert('Error al editar servicio', 'danger');
    }
  };

  const showAlert = (message, variant) => {
    setAlert({ message, variant });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleNegocioChange = (e) => {
    const { name, value } = e.target;
    setDatosNegocio(prev => ({ ...prev, [name]: value }));
  };

  const hasChanged = JSON.stringify({
    nombre: datosNegocio.nombre,
    categoria: datosNegocio.categoria,
    descripcion: datosNegocio.descripcion,
    direccion: datosNegocio.coordenadas,
    imagenUrl: datosNegocio.imagen,
    horariodetencion: datosNegocio.horariodetencion,
    idUsuario: datosNegocio.idUsuario,
  }) !== JSON.stringify({
    nombre: datosOriginales.nombre,
    categoria: datosOriginales.categoria,
    descripcion: datosOriginales.descripcion,
    direccion: datosOriginales.direccion,
    imagenUrl: datosOriginales.imagenUrl,
    horariodetencion: datosOriginales.horariodetencion,
    idUsuario: datosOriginales.idUsuario,
  });

  const handleSaveDatos = async () => {
    try {
      const payload = {
        nombre: datosNegocio.nombre,
        categoria: datosNegocio.categoria,
        descripcion: datosNegocio.descripcion,
        direccion: datosNegocio.coordenadas,
        imagenUrl: datosNegocio.imagen,
        horariodetencion: datosNegocio.horariodetencion,
        idUsuario: datosNegocio.idUsuario,
      };

      console.log('Payload a enviar:', payload);

      const res = await axios.put(`http://localhost:8081/api/business/1`, payload);
      setDatosOriginales(res.data);
      setDatosNegocio(prev => ({
        ...prev,
        nombre: res.data.nombre,
        categoria: res.data.categoria,
        descripcion: res.data.descripcion,
        coordenadas: res.data.direccion,
        imagen: res.data.imagenUrl,
        horariodetencion: res.data.horariodetencion,
        idUsuario: res.data.idUsuario,
      }));
      showAlert('Datos del negocio actualizados con éxito', 'success');
    } catch (error) {
      console.error('Error al actualizar datos del negocio:', error);
      if (error.response && error.response.data) {
        console.error('Mensaje backend:', error.response.data);
      }
      showAlert('Error al actualizar datos del negocio', 'danger');
    }
  };

  return (
    <div className="container mt-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', color: 'white', padding: '20px', borderRadius: '10px' }}>
      <h3 className="text-center mb-4">Actualiza tu información</h3>
      {alert && <Alert variant={alert.variant}>{alert.message}</Alert>}
      <div className="row">
        <div className="col-md-6 border-end">
          <h5>Servicios</h5>
          <p>Agrega los servicios que ofrece tu negocio para que tus clientes puedan agendar una cita.</p>
          <Form.Control
            className="mb-2"
            placeholder="Nombre del servicio"
            name="nombre"
            value={newService.nombre || ''}
            onChange={handleServiceChange}
          />
          <Form.Control
            className="mb-2"
            placeholder="Descripción del servicio"
            name="descripcion"
            value={newService.descripcion || ''}
            onChange={handleServiceChange}
          />
          <Form.Control
            type="number"
            className="mb-2"
            placeholder="Precio"
            name="precio"
            value={newService.precio || ''}
            onChange={handleServiceChange}
          />
          <Button variant="success" onClick={handleCreateService}>Crear servicio</Button>

          <div className="mt-4">
            {services.map((servicio, index) => (
              <Card key={servicio.id} className="mb-2" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }}>
                <Card.Body>
                  <Card.Title>{servicio.nombre}</Card.Title>
                  <Card.Text>{servicio.descripcion}</Card.Text>
                  <Card.Text><strong>Precio:</strong> ${servicio.precio}</Card.Text>
                  <Button size="sm" variant="outline-info" className="me-2" onClick={() => handleEdit(index)}>Editar</Button>
                  <Button size="sm" variant="outline-danger" onClick={() => handleDelete(index)}>Eliminar</Button>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>

        <div className="col-md-6">
          <h5>Datos del Negocio</h5>
          <Form.Control className="mb-2" placeholder="Nombre" name="nombre" value={datosNegocio.nombre || ''} onChange={handleNegocioChange} />
          <Form.Control className="mb-2" placeholder="Categoría" name="categoria" value={datosNegocio.categoria || ''} onChange={handleNegocioChange} />
          <Form.Control className="mb-2" placeholder="Coordenadas (Dirección)" name="coordenadas" value={datosNegocio.coordenadas || ''} onChange={handleNegocioChange} />
          <Form.Control className="mb-2" placeholder="Descripción" name="descripcion" value={datosNegocio.descripcion || ''} onChange={handleNegocioChange} />
          <Form.Control className="mb-2" placeholder="Imagen URL" name="imagen" value={datosNegocio.imagen || ''} onChange={handleNegocioChange} />
          <Form.Control className="mb-2" placeholder="Horario de atención" name="horariodetencion" value={datosNegocio.horariodetencion || ''} onChange={handleNegocioChange} />

          <Button
            disabled={!hasChanged}
            className="mt-2"
            variant="primary"
            onClick={handleSaveDatos}
          >
            Guardar datos del negocio
          </Button>
        </div>
      </div>

      {/* Modal para editar servicio */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Servicio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            className="mb-2"
            placeholder="Nombre"
            value={editedService.nombre || ''}
            onChange={(e) => setEditedService(prev => ({ ...prev, nombre: e.target.value }))}
          />
          <Form.Control
            className="mb-2"
            placeholder="Descripción"
            value={editedService.descripcion || ''}
            onChange={(e) => setEditedService(prev => ({ ...prev, descripcion: e.target.value }))}
          />
          <Form.Control
            type="number"
            className="mb-2"
            placeholder="Precio"
            value={editedService.precio || ''}
            onChange={(e) => setEditedService(prev => ({ ...prev, precio: e.target.value }))}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleSaveEdit}>Guardar cambios</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
