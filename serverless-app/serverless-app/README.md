# AWS SDK JavaScript Project

Este proyecto es un ejemplo que utiliza el **AWS SDK v3** para interactuar con servicios como **S3**, **SQS** y **RDS**. Utilizamos **AWS Lambda** para procesar los eventos y **AWS SAM** para gestionar la infraestructura como código.

## Estructura del Proyecto
├── /src # Código fuente │ ├── /services # Servicios AWS (S3, SQS, RDS) │ ├── /handlers # Funciones Lambda ├── /tests # Pruebas unitarias ├── /template.yaml # Configuración AWS SAM ├── package.json # Dependencias del proyecto └── README.md # Documentación
## Requisitos

- Node.js (versión 14 o superior)
- AWS CLI
- AWS SAM CLI

## Instalación

1. Clona este repositorio.
2. Ejecuta `npm install` para instalar las dependencias.
3. Configura tus credenciales de AWS.

## Despliegue

Para desplegar el proyecto en AWS, utiliza el siguiente comando:

```bash
sam deploy --guided
