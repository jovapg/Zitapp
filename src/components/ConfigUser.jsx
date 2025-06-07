import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Row, Col, Image } from 'react-bootstrap';
import { FaEdit, FaCamera } from 'react-icons/fa'; 

// URL de la imagen de placeholder "quemada" para el fallback
const FALLBACK_IMAGE_URL_CONFIG = "https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ=";

export default function ConfigUser({ show, handleClose }) {
  const userData = JSON.parse(localStorage.getItem('user'));
  const userId = userData?.id;

  const [formData, setFormData] = useState({
    id: userId,
    email: '',
    nombre: '',
    telefono: '',
    contrasena: '',
    imagenUrl: '', // Mantendremos 'imagenUrl' en el estado local para consistencia con los nombres de props
    edad: ''
  });

  const [originalData, setOriginalData] = useState(null);
  const [editingField, setEditingField] = useState(null);

  useEffect(() => {
    if (show && userId) {
      // CORRECCIÓN 1: Usar backticks para la URL en axios.get
      axios.get(`http://localhost:8081/api/users/${userId}`)
        .then((res) => {
          const { id, email, nombre, telefono, imagenPerfil, edad } = res.data; 
          setFormData({
            id: id || userId,
            email: email || '',
            nombre: nombre || '',
            telefono: telefono || '',
            contrasena: '', 
            imagenUrl: imagenPerfil || '', 
            edad: edad || ''
          });
          setOriginalData(res.data);
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

  const handleImageEditClick = () => {
    setEditingField('imagenUrl'); // Seguirá editando 'imagenUrl' en el formulario
  };

  const handleSubmit = async () => {
    if (!userId) {
      alert('Usuario no identificado');
      return;
    }
    try {
      const datosAEnviar = {
        ...originalData,
        ...formData,
      };

      if (formData.contrasena === '') {
        delete datosAEnviar.contrasena;
      }
      
      // Asegurarse de que se envía 'imagenPerfil' al backend
      if (datosAEnviar.imagenUrl === '') {
        datosAEnviar.imagenUrl = null; 
      }
      datosAEnviar.imagenPerfil = datosAEnviar.imagenUrl; // Crear la propiedad correcta para el backend
      delete datosAEnviar.imagenUrl; // Eliminar la propiedad local 'imagenUrl' si no la espera el backend

      // CORRECCIÓN 2: Usar backticks para la URL en axios.put
      await axios.put(`http://localhost:8081/api/users/${userId}`, datosAEnviar);

      alert('Datos actualizados correctamente');
      // Actualizar localStorage con la nueva imagen (como imagenPerfil) y otros datos
      localStorage.setItem('user', JSON.stringify({ 
          ...userData, 
          ...formData, 
          contrasena: '', 
          imagenPerfil: datosAEnviar.imagenPerfil || '', // Guardar como imagenPerfil en localStorage
      }));
      
      handleClose();
      setEditingField(null); 
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      alert(error.response?.data?.error || 'Error al actualizar los datos');
    }
  };

  const displayFields = [
    { label: 'Nombre y Apellido', name: 'nombre', value: formData.nombre, editable: true },
    { label: 'Número de teléfono', name: 'telefono', value: formData.telefono, editable: true },
    { label: 'Email', name: 'email', value: formData.email, editable: false, type: 'email' },
    // CORRECCIÓN 3: Asegurar que la contraseña no se muestre en texto plano por defecto
    { label: 'Contraseña', name: 'contrasena', value: '********', editable: true, type: 'password-mask' }, 
    { label: 'Edad', name: 'edad', value: formData.edad, editable: true, type: 'number' }
  ];

  return (
    <Modal show={show} onHide={handleClose} centered size="lg" dialogClassName="custom-modal">
      <Modal.Header closeButton className="modal-header-custom">
        <Modal.Title className="text-light">Actualiza tus datos</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body-custom p-0">
        <Row className="g-0">
          {/* Columna Izquierda: Vista del Perfil (fondo oscuro) */}
          <Col md={5} className="d-flex flex-column align-items-center p-4" style={{
              background: 'rgba(30, 30, 50, 0.85)',
              color: 'white', 
              borderRadius: '15px 0 0 15px' 
          }}>
            <div className="position-relative mb-3">
              <Image 
                // CORRECCIÓN 4: Usar FALLBACK_IMAGE_URL_CONFIG
                src={formData.imagenUrl || FALLBACK_IMAGE_URL_CONFIG} 
                roundedCircle 
                style={{ width: '150px', height: '150px', objectFit: 'cover', border: '2px solid #00FFFF' }} 
                className="shadow-sm"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = FALLBACK_IMAGE_URL_CONFIG; // CORRECCIÓN 5: Usar fallback "quemado"
                  console.error("Error al cargar la imagen de perfil. La URL es inválida o inaccesible.");
                }}
              />
              <Button 
                variant="outline-secondary" 
                size="sm" 
                className="rounded-circle position-absolute bottom-0 end-0 p-2"
                onClick={handleImageEditClick} 
                style={{ background: 'rgba(0,0,0,0.6)', borderColor: 'white', color: 'white' }}
              >
                <FaCamera /> 
              </Button>
            </div>
            
            <h4 className="text-white mb-4">
                {formData.nombre} {formData.apellido || ''}
            </h4>

            {displayFields.map((field) => (
                <div key={field.name} className="d-flex justify-content-between align-items-center w-100 mb-2 py-1" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <span className="text-white small">{field.label}:</span> 
                    <span className="text-white me-2 small">
                        {field.type === 'password-mask' ? '********' : field.value || '-'}
                    </span>
                    {field.editable && (
                        <Button 
                            variant="link" 
                            size="sm" 
                            onClick={() => setEditingField(field.name)}
                            className="text-info p-0"
                        >
                            <FaEdit />
                        </Button>
                    )}
                </div>
            ))}
          </Col>

          {/* Columna Derecha: Campos de Edición (fondo claro) */}
          <Col md={7} className="p-4" style={{
              background: 'rgba(255, 255, 255, 0.95)',
              color: '#333', 
              borderRadius: '0 15px 15px 0' 
          }}>
            <h5 className="mb-4" style={{color: '#333'}}>Editar Campo</h5>
            {editingField ? (
                <Form.Group className="mb-3">
                    <Form.Label className="form-label" style={{color: '#555'}}>
                        {displayFields.find(f => f.name === editingField)?.label}
                    </Form.Label>
                    <Form.Control
                        type={editingField === 'imagenUrl' ? 'url' : 
                              displayFields.find(f => f.name === editingField)?.type === 'password-mask' ? 'password' : 
                              displayFields.find(f => f.name === editingField)?.type || 'text'}
                        name={editingField}
                        value={editingField === 'contrasena' ? formData.contrasena : formData[editingField]}
                        onChange={handleChange}
                        className="form-control-light"
                        // CORRECCIÓN 6: Usar backticks para el placeholder dinámico
                        placeholder={editingField === 'imagenUrl' ? 'Pega la URL de tu foto de perfil' : `Ingrese ${displayFields.find(f => f.name === editingField)?.label.toLowerCase()}`}
                    />
                    {editingField === 'contrasena' && (
                        <Form.Text className="text-muted">
                            Deje en blanco para no cambiar la contraseña.
                        </Form.Text>
                    )}
                    {editingField === 'imagenUrl' && (
                        <Form.Text className="text-muted">
                            Pega la URL de tu foto de perfil (ej. https://ejemplo.com/foto.jpg)
                        </Form.Text>
                    )}
                    <Button 
                        variant="outline-secondary" 
                        className="mt-3 w-100" 
                        onClick={() => setEditingField(null)}
                        style={{ color: '#555', borderColor: '#bbb' }}
                    >
                        Cerrar Edición
                    </Button>
                </Form.Group>
            ) : (
                <p className="text-muted">Selecciona un campo a la izquierda para editar.</p>
            )}

            <Button variant="primary" onClick={handleSubmit} className="mt-4 w-100" style={{ background: '#007bff', borderColor: '#007bff' }}>
                Actualizar datos
            </Button>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer className="modal-footer-custom">

      </Modal.Footer>

      {/* Estilos CSS en línea para el modal */}
      <style>{`
        .custom-modal .modal-content {
          background: transparent;
          color: white;
          border-radius: 15px;
          border: none;
          backdrop-filter: blur(10px);
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
          overflow: hidden;
        }
        .modal-header-custom {
          background: rgba(30, 30, 50, 0.85);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          border-radius: 15px 15px 0 0;
        }
        .modal-header-custom .btn-close {
            filter: invert(1);
        }
        .modal-footer-custom {
          background: rgba(30, 30, 50, 0.85);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0 0 15px 15px;
        }
        .modal-body-custom {
          background: transparent;
        }
        .form-label {
          color: #ddd;
        }
        .form-control-light {
          background-color: rgba(0, 0, 0, 0.05);
          color: #333;
          border: 1px solid #ccc;
        }
        .form-control-light:focus {
          background-color: rgba(0, 0, 0, 0.1);
          border-color: #007bff;
          box-shadow: 0 0 0 0.25rem rgba(0, 123, 255, 0.25);
          color: #333;
        }
        .btn-link {
          text-decoration: none;
        }
      `}</style>
    </Modal>
  );
}