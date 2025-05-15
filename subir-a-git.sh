#!/bin/bash

echo "¿Qué rama estás usando? (Ej: main, ana, luis, etc.)"
read branch

echo "Escribe un mensaje claro para el commit:"
read mensaje

git add .
git commit -m "$mensaje"
git push origin $branch