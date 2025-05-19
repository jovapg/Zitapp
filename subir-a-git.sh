#!/bin/bash

# Obtener la rama actual automáticamente
rama=$(git rev-parse --abbrev-ref HEAD)

echo "📌 Estás en la rama: $rama"

# Verificar si hay cambios
if git diff --quiet && git diff --cached --quiet; then
  echo "✅ No hay cambios para subir. El repositorio está limpio."
  exit 0
fi

# Mostrar archivos modificados
echo "🔍 Archivos modificados:"
git status -s

# Confirmar si deseas continuar
read -p "¿Deseas continuar y subir estos cambios? (s/n): " continuar

if [[ $continuar != "s" ]]; then
  echo "❌ Operación cancelada."
  exit 0
fi

# Agregar todos los cambios
git add .

# Pedir mensaje de commit
read -p "📝 Escribe el mensaje para el commit: " mensaje

# Validar que el mensaje no esté vacío
if [[ -z "$mensaje" ]]; then
  echo "❌ El mensaje no puede estar vacío."
  exit 1
fi

# Hacer el commit
git commit -m "$mensaje"

# Hacer el push a la rama actual
git push origin "$rama"

echo "✅ Cambios subidos exitosamente a la rama '$rama'"