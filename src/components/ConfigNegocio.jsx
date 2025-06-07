import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Card, Alert } from 'react-bootstrap';

export default function ConfigNegocio({ show, handleClose }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const currentBusinessId = user?.businessId || null; 

  // --- REVISIÓN CLAVE AQUÍ ---
  // Asegúrate de que todas las propiedades tengan un valor inicial definido (ej. '' para strings, 0 para numbers, false para booleans)
  const [datosNegocio, setDatosNegocio] = useState({
    id: null,
    nombre: '',
    categoria: '',
    coordenadas: '', // Mapea a 'direccion' en el backend
    descripcion: '',
    imagen: '', // Mapea a 'imagenUrl' en el backend
    horariodetencion: '',
    idUsuario: user?.id || null, 
  });

  const [datosOriginales, setDatosOriginales] = useState({
    id: null, // Asegúrate de que este también tenga valores iniciales consistentes
    nombre: '',
    categoria: '',
    direccion: '',
    descripcion: '',
    imagenUrl: '',
    horariodetencion: '',
    idUsuario: null,
  });

  const [services, setServices] = useState([]);
  
  const [newService, setNewService] = useState({ 
    nombre: '', 
    descripcion: '', 
    precio: '', // Inicializar como string o número para Form.Control type="number"
    tiemposervicio: '' // Inicializar como string o número
  });

  const [showEditServiceModal, setShowEditServiceModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  
  const [editedService, setEditedService] = useState({ 
    id: null, 
    nombre: '', 
    descripcion: '', 
    precio: '', // Inicializar como string o número
    tiemposervicio: '' // Inicializar como string o número
  });
  const [alert, setAlert] = useState(null);

  const categorias = [
    'SALUD', 'BELLEZA', 'FITNESS', 'AUTOMOTRIZ', 'BIENESTAR',
    'COMIDAS', 'REPARACIONES', 'LIMPIEZA', 'ASESORIAS JURIDICAS',
    'CLASES PARTICULARES', 'MASCOTAS', 'CONTROL DE PLAGAS'
  ];

  useEffect(() => {
    if (show && currentBusinessId) {
      fetchDatosNegocio(currentBusinessId);
    } else if (!show) {
      // Al cerrar el modal, reinicia todos los estados de formulario a sus valores iniciales definidos
      setDatosNegocio({
        id: null,
        nombre: '',
        categoria: '',
        coordenadas: '',
        descripcion: '',
        imagen: '',
        horariodetencion: '',
        idUsuario: user?.id || null,
      });
      setDatosOriginales({
        id: null,
        nombre: '',
        categoria: '',
        direccion: '',
        descripcion: '',
        imagenUrl: '',
        horariodetencion: '',
        idUsuario: null,
      });
      setServices([]);
      setNewService({ nombre: '', descripcion: '', precio: '', tiemposervicio: '' });
      setAlert(null);
      setEditedService({ id: null, nombre: '', descripcion: '', precio: '', tiemposervicio: '' });
    }
  }, [show, currentBusinessId, user?.id]);

  const fetchDatosNegocio = async (id) => {
    try {
      const res = await axios.get(`http://localhost:8081/api/businesses/${id}`);
      const negocio = res.data;
      
      // Mapear los datos de la API a tu estado, asegurando que los valores siempre sean definidos
      setDatosNegocio({
        id: negocio.id || null, // Asegurar que id no sea undefined
        nombre: negocio.nombre || '',
        categoria: negocio.categoria || '',
        coordenadas: negocio.direccion || '',
        descripcion: negocio.descripcion || '',
        imagen: negocio.imagenUrl || '',
        horariodetencion: negocio.horariodetencion || '',
        idUsuario: negocio.idUsuario || null,
      });
      
      setDatosOriginales({
        id: negocio.id || null,
        nombre: negocio.nombre || '',
        categoria: negocio.categoria || '',
        direccion: negocio.direccion || '',
        descripcion: negocio.descripcion || '',
        imagenUrl: negocio.imagenUrl || '',
        horariodetencion: negocio.horariodetencion || '',
        idUsuario: negocio.idUsuario || null,
      });
      
      fetchServices(negocio.id);
    } catch (error) {
      console.error('Error al cargar datos del negocio:', error);
      showAlert('Error al cargar los datos del negocio. Asegúrate de tener un negocio registrado.', 'danger');
    }
  };

  const fetchServices = async (businessId) => {
    try {
      const res = await axios.get(`http://localhost:8081/api/services/businesses/${businessId}/services`);
      setServices(res.data);
    } catch (error) {
      console.error('Error al cargar servicios:', error);
      showAlert('Error al cargar los servicios.', 'danger');
    }
  };

  const handleCreateService = async () => {
    if (!newService.nombre || !newService.descripcion || !newService.precio || !newService.tiemposervicio) {
      showAlert('Por favor, completa todos los campos del servicio.', 'warning');
      return;
    }
    if (!datosNegocio.id) {
        showAlert('No se puede crear el servicio. Primero carga o guarda los datos del negocio.', 'danger');
        return;
    }

    try {
      const res = await axios.post(
        `http://localhost:8081/api/services/businesses/${datosNegocio.id}/from-params`,
        null, 
        {
          params: { 
            nombre: newService.nombre,
            descripcion: newService.descripcion,
            precio: newService.precio,
            duracion: newService.tiemposervicio 
          }
        }
      );
      setServices(prev => [...prev, res.data]);
      setNewService({ nombre: '', descripcion: '', precio: '', tiemposervicio: '' });
      showAlert('Servicio creado con éxito', 'success');
    } catch (error) {
      console.error('Error al crear servicio:', error);
      showAlert(`Error al crear servicio: ${error.response?.data || error.message}`, 'danger');
    }
  };

  const handleDelete = async (index) => {
    const servicio = services[index];
    if (!window.confirm(`¿Estás seguro de que deseas eliminar el servicio "${servicio.nombre}"?`)) {
      return;
    }
    try {
      const res = await axios.delete(`http://localhost:8081/api/services/${servicio.id}`);
      
      if (res.status === 200 || res.status === 204) { 
        const updated = services.filter((_, i) => i !== index);
        setServices(updated);
        showAlert('Servicio eliminado con éxito', 'danger');
      } else {
        showAlert('Error al eliminar servicio: Respuesta inesperada del servidor.', 'danger');
      }
    } catch (error) {
      console.error('Error al eliminar servicio:', error);
      showAlert(`Error al eliminar servicio: ${error.response?.data || error.message}`, 'danger');
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    // Asegurarse de que al copiar, los valores undefined se conviertan a strings vacíos o ceros.
    // Esto es crucial para inputs numéricos también.
    const serviceToEdit = services[index];
    setEditedService({ 
      id: serviceToEdit.id || null,
      nombre: serviceToEdit.nombre || '',
      descripcion: serviceToEdit.descripcion || '',
      precio: serviceToEdit.precio || '', // Usar string vacío para números si el input es de tipo texto
      tiemposervicio: serviceToEdit.tiemposervicio || '' // Usar string vacío
    }); 
    setShowEditServiceModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editedService.id) {
      showAlert('Error: ID del servicio a editar no encontrado.', 'danger');
      return;
    }
    try {
      const payload = {
          nombre: editedService.nombre,
          descripcion: editedService.descripcion,
          precio: editedService.precio,
          duracion: editedService.tiemposervicio 
      };
      const res = await axios.put(`http://localhost:8081/api/services/${editedService.id}`, payload);
      const updated = [...services];
      updated[editIndex] = res.data;
      setServices(updated);
      setShowEditServiceModal(false);
      showAlert('Servicio editado con éxito', 'info');
    } catch (error) {
      console.error('Error al editar servicio:', error);
      showAlert(`Error al editar servicio: ${error.response?.data || error.message}`, 'danger');
    }
  };

  const handleNegocioChange = (e) => {
    const { name, value } = e.target;
    setDatosNegocio(prev => ({ ...prev, [name]: value }));
  };

  const handleNewServiceChange = (e) => {
    const { name, value } = e.target;
    setNewService(prev => ({ ...prev, [name]: value }));
  };

  const handleEditedServiceChange = (e) => {
    const { name, value } = e.target;
    setEditedService(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveDatos = async () => {
    if (!datosNegocio.id) {
        showAlert('No se pudo guardar: ID de negocio no disponible. Intenta refrescar o contacta soporte.', 'danger');
        return;
    }
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

      const res = await axios.put(`http://localhost:8081/api/businesses/${datosNegocio.id}`, payload);
      
      setDatosOriginales({
        id: res.data.id || null,
        nombre: res.data.nombre || '',
        categoria: res.data.categoria || '',
        direccion: res.data.direccion || '',
        descripcion: res.data.descripcion || '',
        imagenUrl: res.data.imagenUrl || '',
        horariodetencion: res.data.horariodetencion || '',
        idUsuario: res.data.idUsuario || null,
      });
      setDatosNegocio({
        id: res.data.id || null,
        nombre: res.data.nombre || '',
        categoria: res.data.categoria || '',
        coordenadas: res.data.direccion || '',
        descripcion: res.data.descripcion || '',
        imagen: res.data.imagenUrl || '',
        horariodetencion: res.data.horariodetencion || '',
        idUsuario: res.data.idUsuario || null,
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
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-dark">Configuración del Negocio</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', color: 'white' }}>
        <div className="container-fluid">
          <h3 className="text-center mb-4">Actualiza tu información</h3>
          {alert && <Alert variant={alert.variant}>{alert.message}</Alert>}

          <div className="row">
            <div className="col-md-6 border-end">
              <h5>Servicios</h5>
              <p>Agrega los servicios que ofrece tu negocio para que tus clientes puedan agendar una cita.</p>

              <Form.Control className="mb-2" placeholder="Nombre del servicio" name="nombre" value={newService.nombre} onChange={handleNewServiceChange} />
              <Form.Control className="mb-2" placeholder="Descripción" name="descripcion" value={newService.descripcion} onChange={handleNewServiceChange} />
              <Form.Control type="number" className="mb-2" placeholder="Precio" name="precio" value={newService.precio} onChange={handleNewServiceChange} />
              <Form.Control type="number" className="mb-2" placeholder="Duración en minutos" name="tiemposervicio" value={newService.tiemposervicio} onChange={handleNewServiceChange} />
              <Button variant="success" onClick={handleCreateService} className="mt-2">Crear servicio</Button>

              <div className="mt-4">
                {services.length === 0 ? (
                  <p>No hay servicios registrados. ¡Crea uno!</p>
                ) : (
                  services.map((servicio, index) => (
                    <Card key={servicio.id} className="mb-2" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }}>
                      <Card.Body>
                        <Card.Title>{servicio.nombre}</Card.Title>
                        <Card.Text>{servicio.descripcion}</Card.Text>
                        <Card.Text><strong>Precio:</strong> ${servicio.precio}</Card.Text>
                        <Card.Text><strong>Duración:</strong> {servicio.tiemposervicio} min</Card.Text>
                        <Button size="sm" variant="outline-info" className="me-2" onClick={() => handleEdit(index)}>Editar</Button>
                        <Button size="sm" variant="outline-danger" onClick={() => handleDelete(index)}>Eliminar</Button>
                      </Card.Body>
                    </Card>
                  ))
                )}
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
        </div>

        {/* Modal para EDITAR SERVICIOS */}
        <Modal show={showEditServiceModal} onHide={() => setShowEditServiceModal(false)}>
          <Modal.Header closeButton><Modal.Title className="text-dark">Editar Servicio</Modal.Title></Modal.Header>
          <Modal.Body>
            <Form.Control className="mb-2" placeholder="Nombre" name="nombre" value={editedService.nombre || ''} onChange={handleEditedServiceChange} />
            <Form.Control className="mb-2" placeholder="Descripción" name="descripcion" value={editedService.descripcion || ''} onChange={handleEditedServiceChange} />
            <Form.Control type="number" className="mb-2" placeholder="Precio" name="precio" value={editedService.precio || ''} onChange={handleEditedServiceChange} />
            <Form.Control type="number" className="mb-2" placeholder="Duración en minutos" name="tiemposervicio" value={editedService.tiemposervicio || ''} onChange={handleEditedServiceChange} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditServiceModal(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleSaveEdit}>Guardar cambios</Button>
          </Modal.Footer>
        </Modal>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cerrar Configuración</Button>
      </Modal.Footer>
    </Modal>
  );
}