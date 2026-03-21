# Configuración del proyecto Prisma

Para configurar el proyecto Prisma ORM, se debe crear el archivo de esquema de Prisma con el siguiente comando:


```bash
npx prisma init
```

## Este comando realiza dos acciones principales:

Crea un nuevo directorio llamado prisma que contiene un archivo llamado schema.prisma, que incluye el esquema de Prisma con la variable de conexión a la base de datos y los modelos del esquema.

Crea un archivo .env en el directorio raíz del proyecto, que se utiliza para definir variables de entorno (como la conexión a la base de datos).

**1. Configuración de la conexión a la base de datos**
Dentro del archivo .env, se debe agregar la URL de conexión a la base de datos MySQL. Un ejemplo de una URL de conexión podría ser:

```bash
DATABASE_URL="mysql://user:password@localhost:3306/mydatabase"
DATABASE_URL="postgresql://user:password@db:5432/insurance?schema=public&connect_timeout=60"
```

### Definición de modelos en Prisma Schema
Una vez que se ha configurado la conexión a la base de datos, se pueden definir los modelos en el archivo schema.prisma. Un modelo básico podría tener la siguiente estructura:

```bash
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Generación de Prisma Client
Después de definir los modelos en el esquema, se necesita generar el Prisma Client, que es una herramienta que permite interactuar con la base de datos desde el código. Para generar el cliente, se utiliza el siguiente comando:

```bash
npx prisma generate
```

**2. Crear una migración**

Cuando realizas cambios en el esquema, como añadir, modificar o eliminar campos o relaciones, debes crear una nueva migración que Prisma aplicará a la base de datos.

Para crear una migración, se utiliza el siguiente comando:

```bash
npx prisma migrate dev --name nombre-de-la-migracion
```

* El parámetro *--name* te permite darle un nombre descriptivo a la migración (por ejemplo, *add-post-model*).
* El comando genera un archivo de migración SQL basado en los cambios del archivo *schema.prisma* y lo aplica a la base de datos de desarrollo.

Prisma guardará este archivo de migración en una carpeta *prisma/migrations*, donde mantendrá el historial de cambios.

**3. Revisar y aplicar migraciones en producción**

En un entorno de producción, las migraciones no se aplican automáticamente como en desarrollo. En su lugar, utilizas el siguiente comando para aplicar las migraciones a la base de datos de producción:

```bash
npx prisma migrate deploy
```

Esto asegurará que las migraciones sean aplicadas de forma segura en un entorno de producción.

**4. Verificar el estado de las migraciones**

Puedes verificar qué migraciones han sido aplicadas y el estado de la base de datos usando:

npx prisma migrate status
Esto te mostrará el estado actual de las migraciones, si hay migraciones pendientes, y si la base de datos está sincronizada con el esquema actual.

**5. Revertir migraciones**

Si necesitas deshacer una migración en desarrollo, puedes utilizar el siguiente comando para regresar a una migración anterior:

```bash
npx prisma migrate reset
```

Este comando **eliminará toda la base de datos** y aplicará nuevamente todas las migraciones desde el principio. **Solo se recomienda para entornos de desarrollo**, ya que en producción, generalmente no se eliminan datos.

**6. Modificar migraciones**

Si aún no has desplegado una migración a producción y necesitas modificarla, puedes editar el archivo SQL generado en *prisma/migrations*, o puedes simplemente eliminar la migración y volver a generar una nueva con los cambios adecuados.

## Flujo típico de trabajo con Prisma y migraciones:

- Modificar el modelo en el archivo *schema.prisma*.
- Crear la migración con *npx prisma migrate dev --name nombre-de-la-migracion*.
- Aplicar migraciones en producción con *npx prisma migrate deploy*.
- Actualizar el cliente Prisma para reflejar los cambios en la base de datos en el código:

```bash
npx prisma generate
```

## Comandos clave:

- *npx prisma migrate dev --name nombre*: Crea y aplica migraciones en desarrollo.
- *npx prisma migrate deploy*: Aplica las migraciones en producción.
- *npx prisma migrate status*: Verifica el estado de las migraciones.
- *npx prisma migrate reset*: Restablece la base de datos y aplica las migraciones nuevamente (solo en desarrollo).

Prisma gestiona las migraciones de una manera controlada y versionada, lo que permite mantener un historial de cambios en tu base de datos, facilitando tanto el desarrollo como la puesta en producción de cambios en la estructura de tus datos.