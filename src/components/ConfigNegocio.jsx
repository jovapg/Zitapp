import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Card, Alert } from 'react-bootstrap';

export default function ConfigNegocio() {
  const user = JSON.parse(localStorage.getItem("user"));
  const idUsuario = user?.id || 1;

  const [datosNegocio, setDatosNegocio] = useState({
    id: null,
    nombre: '',
    categoria: '',
    coordenadas: '',
    descripcion: '',
    imagen: '',
    horariodetencion: '',
    idUsuario,
  });

  const [datosOriginales, setDatosOriginales] = useState({});
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ nombre: '', descripcion: '', precio: '', tiemposervicio: '' });
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editedService, setEditedService] = useState({});
  const [alert, setAlert] = useState(null);

  const categorias = [
    'SALUD', 'BELLEZA', 'FITNESS', 'AUTOMOTRIZ', 'BIENESTAR',
    'COMIDAS', 'REPARACIONES', 'LIMPIEZA', 'ASESORIAS JURIDICAS',
    'CLASES PARTICULARES', 'MASCOTAS', 'CONTROL DE PLAGAS'
  ];

  useEffect(() => {
    fetchDatosNegocio();
  }, []);

  const fetchDatosNegocio = async () => {
    try {
      const res = await axios.get(`http://localhost:8081/api/business/user/${idUsuario}`);
      const negocio = res.data;
      setDatosNegocio({
        ...negocio,
        coordenadas: negocio.direccion,
        imagen: negocio.imagenUrl,
        idUsuario: negocio.idUsuario
      });
      setDatosOriginales(negocio);
      fetchServices(negocio.id);
    } catch (error) {
      console.error('Error al cargar datos del negocio:', error);
    }
  };

  const fetchServices = async (negocioId) => {
    try {
      const res = await axios.get(`http://localhost:8081/api/services/businesses/${negocioId}/services`);
      setServices(res.data);
    } catch (error) {
      console.error('Error al cargar servicios:', error);
    }
  };

  const handleCreateService = async () => {
    if (!newService.nombre || !newService.descripcion || !newService.precio || !newService.tiemposervicio) return;

    try {
      const res = await axios.post(`http://localhost:8081/api/services/businesses/${datosNegocio.id}`, newService);
      setServices(prev => [...prev, res.data]);
      setNewService({ nombre: '', descripcion: '', precio: '', tiemposervicio: '' });
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
      const res = await axios.put(`http://localhost:8081/api/services/${editedService.id}`, editedService);
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

  const handleNegocioChange = (e) => {
    const { name, value } = e.target;
    setDatosNegocio(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (e) => {
    const { name, value } = e.target;
    setNewService(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveDatos = async () => {
    try {
      const payload = {
        nombre: datosNegocio.nombre,
        categoria: datosNegocio.categoria,
        descripcion: datosNegocio.descripcion,
        direccion: datosNegocio.coordenadas,
        imagenUrl: datosNegocio.imagen,
        horariodetencion: datosNegocio.horariodetencion,
        idUsuario: datosNegocio.idUsuario
      };

      const res = await axios.put(`http://localhost:8081/api/business/${datosNegocio.id}`, payload);
      setDatosOriginales(res.data);
      setDatosNegocio({
        ...res.data,
        coordenadas: res.data.direccion,
        imagen: res.data.imagenUrl
      });
      showAlert('Datos del negocio actualizados con éxito', 'success');
    } catch (error) {
      console.error('Error al actualizar datos del negocio:', error);
      showAlert('Error al actualizar datos del negocio', 'danger');
    }
  };

  const showAlert = (message, variant) => {
    setAlert({ message, variant });
    setTimeout(() => setAlert(null), 3000);
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

  return (
    <div className="container mt-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', color: 'white', padding: '20px', borderRadius: '10px' }}>
      <h3 className="text-center mb-4">Actualiza tu información</h3>
      {alert && <Alert variant={alert.variant}>{alert.message}</Alert>}

      <div className="row">
        <div className="col-md-6 border-end">
          <h5>Servicios</h5>
          <p>Agrega los servicios que ofrece tu negocio para que tus clientes puedan agendar una cita.</p>

          <Form.Control className="mb-2" placeholder="Nombre del servicio" name="nombre" value={newService.nombre} onChange={handleServiceChange} />
          <Form.Control className="mb-2" placeholder="Descripción" name="descripcion" value={newService.descripcion} onChange={handleServiceChange} />
          <Form.Control type="number" className="mb-2" placeholder="Precio" name="precio" value={newService.precio} onChange={handleServiceChange} />
          <Form.Control type="number" className="mb-2" placeholder="Duración en minutos" name="tiemposervicio" value={newService.tiemposervicio} onChange={handleServiceChange} />
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
          <Form.Control className="mb-2" placeholder="Nombre" name="nombre" value={datosNegocio.nombre} onChange={handleNegocioChange} />
          <Form.Select className="mb-2" name="categoria" value={datosNegocio.categoria} onChange={handleNegocioChange}>
            <option value="">Selecciona una categoría</option>
            {categorias.map((cat, idx) => <option key={idx} value={cat}>{cat}</option>)}
          </Form.Select>
          <Form.Control className="mb-2" placeholder="Coordenadas (Dirección)" name="coordenadas" value={datosNegocio.coordenadas} onChange={handleNegocioChange} />
          <Form.Control className="mb-2" placeholder="Descripción" name="descripcion" value={datosNegocio.descripcion} onChange={handleNegocioChange} />
          <Form.Control className="mb-2" placeholder="Imagen URL" name="imagen" value={datosNegocio.imagen} onChange={handleNegocioChange} />
          <Form.Control className="mb-2" placeholder="Horario de atención" name="horariodetencion" value={datosNegocio.horariodetencion} onChange={handleNegocioChange} />
          <Button disabled={!hasChanged} className="mt-2" variant="primary" onClick={handleSaveDatos}>Guardar datos del negocio</Button>
        </div>
      </div>

      {/* Modal editar servicio */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton><Modal.Title>Editar Servicio</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Control className="mb-2" placeholder="Nombre" value={editedService.nombre} onChange={(e) => setEditedService(prev => ({ ...prev, nombre: e.target.value }))} />
          <Form.Control className="mb-2" placeholder="Descripción" value={editedService.descripcion} onChange={(e) => setEditedService(prev => ({ ...prev, descripcion: e.target.value }))} />
          <Form.Control type="number" className="mb-2" placeholder="Precio" value={editedService.precio} onChange={(e) => setEditedService(prev => ({ ...prev, precio: e.target.value }))} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleSaveEdit}>Guardar cambios</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
