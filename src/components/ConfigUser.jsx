import { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';

export default function ConfigUser({ show, handleClose }) {
  // Obtener datos del usuario logueado desde localStorage
  const userData = JSON.parse(localStorage.getItem('user'));
  const userId = userData?.id;

  const [formData, setFormData] = useState({
    id: userId,
    email: '',
    nombre: '',
    telefono: '',
    contrasena: '',
    imagenUrl: '',
    edad: ''
   
  });

  // Cargar datos actuales del usuario al abrir el modal
  useEffect(() => {
    if (show && userId) {
      axios.get(`http://localhost:8081/api/users/${userId}`)
        .then((res) => {
          const { id, email, nombre, telefono, imagenUrl, edad} = res.data;
          setFormData({
            id: id || userId,
            email: email || '',
            nombre: nombre || '',
            telefono: telefono || '',
            contrasena: '',
            imagenUrl: imagenUrl || '',
            edad: edad || ''
           
          });
        })
        .catch((error) => {
          console.error('Error al obtener los datos del usuario:', error);
          alert('No se pudieron cargar los datos del usuario');
        });
    }
  }, [show, userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!userId) {
      alert('Usuario no identificado');
      return;
    }
    try {
      // Obtener datos actuales para mantener "tipo" y otros campos no editables
      const resActual = await axios.get(`http://localhost:8081/api/users/${userId}`);
      const datosActuales = resActual.data;

      // Combinar datos actuales con los editados
      const datosCombinados = {
        ...datosActuales,
        ...formData,
        tipo: datosActuales.tipo || 'cliente',
      };

      // Eliminar imagenUrl si está vacía para evitar error 400
      if (!datosCombinados.imagenUrl || datosCombinados.imagenUrl.trim() === '') {
        delete datosCombinados.imagenUrl;
      }

      await axios.put(`http://localhost:8081/api/users/${userId}`, datosCombinados);

      alert('Datos actualizados correctamente');
      handleClose();

      // Limpiar contraseña en el formulario
      setFormData((prev) => ({ ...prev, contrasena: '' }));
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      alert(error.response?.data?.error || 'Error al actualizar los datos');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg" dialogClassName="custom-modal">
      <Modal.Header closeButton className="modal-header-custom">
        <Modal.Title>Actualiza tus datos</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body-custom">
        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="form-label">Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="servicio-info"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="form-label">Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              readOnly
              className="servicio-info"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="form-label">Teléfono</Form.Label>
            <Form.Control
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="servicio-info"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="form-label">Contraseña</Form.Label>
            <Form.Control
              type="password"
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              placeholder="Nueva contraseña"
              className="servicio-info"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="form-label">Imagen de perfil (URL)</Form.Label>
            <Form.Control
              type="text"
              name="imagenUrl"
              value={formData.imagenUrl}
              onChange={handleChange}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="servicio-info"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="form-label">Edad</Form.Label>
            <Form.Control
              type="text"
              name="edad"
              value={formData.edad}
              onChange={handleChange}
              className="servicio-info"
            />
          </Form.Group>


        </Form>
      </Modal.Body>
      <Modal.Footer className="modal-footer-custom">
        <Button variant="primary" onClick={handleSubmit}>
          Actualizar datos
        </Button>
      </Modal.Footer>

      <style>{`
        .custom-modal .modal-content {
          background: rgba(35, 35, 60, 0.92);
          color: white;
          border-radius: 15px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          box-shadow: 0 0 15px rgba(0, 255, 255, 0.2);
        }
        .modal-header-custom,
        .modal-footer-custom {
          background: rgba(30, 30, 50, 0.85);
          border: none;
          text-align: center;
        }
        .modal-body-custom {
          background: rgba(40, 40, 70, 0.85);
        }
        .form-label {
          color: #ddd;
        }
        .servicio-info {
          background-color: rgba(255, 255, 255, 0.05);
          color: #ccc;
          border: 1px solid rgba(255,255,255,0.1);
        }
      `}</style>
    </Modal>
  );
}
