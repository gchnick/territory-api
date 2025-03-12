# 🗺 Registros del siervo de territorio (API)


## Índice

- [🦺 Arquitectura de la aplicación](#🦺-arquitectura-de-la-aplicación)
  - Contexto
    - [Sistema de registro del siervo de territorio](#sistema-de-registro-del-siervo-de-territorio)
  - Contenedores
    - [Sistema de registro de asignación de territorio](#sistema-de-registro-de-asignación-de-territorio)
    - [Aplicación móvil para los publicadores](#aplicación-móvil-para-los-publicadores)
  - Componentes
    - [API de la aplicación](#api-de-la-aplicación)
- [Casos de uso](#casos-de-uso)
  - [👨‍💼🗺️ Siervo de territorio y el superintendente de servicio](#👨‍💼🗺️-siervo-de-territorio-y-el-superintendente-de-servicio)
  - [🙋Conductor de grupo de predicación](#🙋conductor-de-grupo-de-predicación)
  - [👥 Publicador](#👥-publicador)
- [Base de datos](#base-de-datos)
  - [General](#general)
  - [Territorios con su congregación](#territorios-con-su-congregación)
  - [Puntos de encuentro para salir a predicar y su disponibilidad para hacer reunión para el servicio del campo](#puntos-de-encuentro-para-salir-a-predicar-y-su-disponibilidad-para-hacer-reunión-para-el-servicio-del-campo)
  - [Conductores de grupo de predicación y su disponibilidad](#conductores-de-grupo-de-predicación-y-su-disponibilidad)
  - [Asignaciones y programa de predicación](#asignaciones-y-programa-de-predicación)
- [API Rest Enpoints](#api-rest-enpoints)
- [Trabajando en](#trabajando-en)
- [Requisistos](#requisitos)
- [Cómo instalar el servidor localmente](#como-instalar-el-servidor-localmente)

---

## 🦺 Arquitectura de la aplicación

El sistema de registro del siervo de territorio pretende ser una aplicación que permita el siervo de territorio invertir su tiempo en actividades valiosas como la creación de mapas de territorio o la colaboración en otras asignaciones.

La arquitectura que maneja permite tener sincronizado los datos en los distintos dispositivos que se usen. Por ejemplo, el **siervo de territorio** puede tener un laptop en la que realiza su trabajo. Y el **superintendente de servicio** desde su laptop o móvil puede ver e incluso modificar el trabajo que se está realizando. Para ello se necesita un método para sincronizar todos los dispositivo, si en posible en tiempo real.
### Contexto

**¿Debería usarse una base de datos SQLite o IndexedDB para la persistencia local de los datos?**

**IndexedDB** es una API de almacenamiento del lado del cliente que está diseñada para funcionar en navegadores web. No está disponible en el entorno de ejecución de Node.js y por tanto no puede ser usada por el *backend*.

**SQLite** es una alternativa. La aplicación *frontend* usaría la *API* del *backend* para solicitar información de la base de datos **SQLite**.

**¿Qué información almacena la base de datos SQLite y IndexedDB?**

- **SQLite**: almacena los datos de registro de asignación de territorios, asignaciones, programas de predicación, informes y conversaciones. También se replicarán información de la base de datos Supabase con el propósito de tener la información necesaria para un inicio de sección offline.

- **IndexedDB**: almacenará datos de para el funcionamiento *Offline* y como caché para disminuir la carga de la base de datos **Turso** y **Supabase**. Llevará una réplica de los datos de territorios, publicadores, disponibilidad y congregación (caché vence cada 15 días).

**¿Qué información almacena la base de datos Supabase, Turso y MongoDB?**

- **Supabase**: almacena los datos de publicadores, usuarios para iniciar sesión y roles para el sistema de autorización.

- **Turso**: almacena los datos de la congregación, territorios y puntos de encuentro.

- **MongoDB**: almacena los programas de predicación publicados a la congregación y las conversaciones e informes de los territorios (se mantendrán registros de 3 meses).

#### Sistema de registro del siervo de territorio

``` mermaid
C4Context

title Diagrama de sistema de contexto para el registro del siervo de territorio

Enterprise_Boundary(app, "Sistema de registro de territorio y programa de predicación") {

  Person(servant, "Siervo de territorio", "Encargado de registrar de asignar <br> y registrar las asignaciones de  <br> los territorios.")
  System(system, "Sistema de registro de <br> asignación de territorios", "Permite a los encargados gestionar<br> los territorios y las asignaciones de<br> territorio y publicar programas de predicación.")
  SystemDb_Ext(territories_database, "Base de datos <br> para el registro de los territorios", "Almacena los datos de la congregación, <br> territorios y puntos de encuentro")

  Person(overseer, "Superintendente<br>de servicio", "Puede actualizar<br> información de los territorios.")
   System(programs_api, "API de programas <br> de predicación", "Permite la gestión de los <br>programas de predicación.")
  SystemDb_Ext(users_database, "Base de datos <br> para inicio de sesión", "Almacena los datos de publicadores, <br>usuarios para iniciar sesión y roles <br>para el sistema de autorización.")

   Person(conductor, "Conductor de grupo <br> de predicación", "Encargado del grupo <br> de predicación.")
System(mobile, "Aplicación móvil para <br> los publicadores", "Permite a los publicadores de <br> la congregración ver el programa <br> de predicación y reportar disponibilidad <br> o la cobertura de territorios.")
  Person(publisher, "Publicador de la <br> congregación.")
  SystemDb_Ext(programs_database, "Base de datos para <br> públicación de programas", "Contiene los programas públicados <br> de predicación para los <br> publicadores de la congregación.")
}

Rel(servant, system, "Gestiona las  <br>territorios, <br> asignaciones <br> y programas.")
Rel(overseer, system, "Administra el sistema")
Rel(conductor, mobile, "Gestion a asignaciones <br> y actualiza disponibilidad")
Rel(publisher, mobile, "Observa programa<br>de predicación")
Rel(system, programs_api, "Gestiona programa")
Rel(mobile, programs_api, "Gestiona programa")

BiRel(system, territories_database, "Leer desde <br> y escribir para")
BiRel(system, users_database, "Leer desde")
BiRel(mobile, users_database, "Leer desde")
Rel(programs_api, programs_database, "Leer desde")

UpdateElementStyle(servant, $bgColor="#18672c", $borderColor="#041107")
UpdateElementStyle(overseer, $bgColor="#18672c", $borderColor="#041107")
UpdateElementStyle(conductor, $bgColor="#18672c", $borderColor="#041107")
UpdateElementStyle(publisher, $bgColor="#18672c", $borderColor="#041107")

UpdateElementStyle(system, $bgColor="#208a3a", $borderColor="#041107")
UpdateElementStyle(programs_api, $bgColor="#208a3a", $borderColor="#041107")
UpdateElementStyle(mobile, $bgColor="#208a3a", $borderColor="#041107")

UpdateRelStyle(servant, system, $offsetX="-40", $offsetY="-40")
UpdateRelStyle(system, territories_database, $offsetX="-30", $offsetY="-20")
UpdateRelStyle(conductor, mobile, $offsetX="-190")
UpdateRelStyle(system, programs_database, $offsetX="70", $offsetY="120")
UpdateRelStyle(mobile, users_database, $offsetX="-20", $offsetY="-10")
UpdateRelStyle(publisher, mobile, $offsetX="-50", $offsetY="-30")
```

### Contenedores

#### Sistema de registro de asignación de territorio

``` mermaid
C4Context

title Diagrama de sistema de contexto para el sistema de transacciones de la congregación

Person(overseer, "Superintendente<br>de servicio", "Puede actualizar<br> información de los territorios.")
ContainerDb_Ext(programs_database, "Programas", "MongoDB", "Contiene los programas públicados <br> de predicación para los <br> publicadores de la congregación.")
ContainerDb_Ext(users_database, "Autenticación", "Supabase", "Contiene los registros de lo usuario <br> y publicadores de nla congregación")
ContainerDb_Ext(territories_database, "Base de datos", "Turso", "Contiene los registros de <br> los datos de los territorios")
Person(servant, "Siervo de territorio", "Encargado de registrar de asignar <br> y registrar las asignaciones de  <br> los territorios.")
Container_Ext(programs_api, "API de <br>programas de predicación", "Cloudflare Worker, Hono", "Provee funcionalidades <br> para la gestión de los <br>programas de predicación")

System(mobile, "Aplicación móvil para <br> los publicadores", "Permite a los publicadores de <br> la congregración ver el programa <br> de predicación y reportar disponibilidad <br> o la cobertura de territorios.")

Container_Boundary(system, "Sistema de registro de asignación de territorios") { 
  Container(desktop_app, "Single-Page App", "Typescript, React, Electron", "Provee todas las funcionalidades <br> a los encargados para administrar <br>los territorios y sus asignaciones")
  Container(desktop_api, "API de la aplicación", "Typescript, Nest", "Provee las funcionalidades <br> de la aplicación vía API")
  
  ContainerDb(database, "Base de datos", "SQLite", "Registros de asignaciones, <br>programas de predicación.")
  ContainerDb(offline_database, "Base de datos", "IndexedDB", "Almacena cambios fuera de línea <br> que se deben persistir en la base <br> de datos de territorios")
}

Rel(servant, desktop_app, "Ejecuta la aplicación usando", "Windows 11")
Rel(overseer, desktop_app, "Ejecuta la aplicación usando", "Windows 11")
Rel(desktop_app, desktop_api, "Hace llamadas <br> a la API", "JSON/HTTPS")
Rel(desktop_api, database, "Lee desde y<br> escribe para", "SQL/TCP")
Rel(desktop_api, territories_database, "Lee desde y<br> escribe para", "SQL/TCP")
Rel(desktop_api, users_database, "Lee desde y<br> escribe para", "SQL/TCP")
Rel(desktop_api, programs_api, "Lee desde y<br> escribe para", "SQL/TCP")
Rel(programs_api, programs_database, "Lee desde y<br> escribe para", "SQL/TCP")
Rel(desktop_api, offline_database, "Lee desde y<br> escribe para", "SQL/TCP")

UpdateElementStyle(overseer, $bgColor="#18672c", $borderColor="#2E702E")
UpdateElementStyle(servant, $bgColor="#18672c", $borderColor="#2E702E")

UpdateElementStyle(mobile, $bgColor="#208a3a", $borderColor="#008A18")
UpdateElementStyle(desktop_app, $bgColor="#28AC49", $borderColor="#008A18")
UpdateElementStyle(desktop_api, $bgColor="#28AC49", $borderColor="#008A18")
UpdateElementStyle(database, $bgColor="#28AC49", $borderColor="#008A18")
UpdateElementStyle(offline_database, $bgColor="#28AC49", $borderColor="#008A18")

UpdateElementStyle(territories_database, $bgColor="#999999", $borderColor="#8A8A8A")
UpdateElementStyle(programs_database, $bgColor="#999999", $borderColor="#8A8A8A")
UpdateElementStyle(users_database, $bgColor="#999999", $borderColor="#8A8A8A")
UpdateElementStyle(programs_api, $bgColor="#999999", $borderColor="#8A8A8A")
```


#### Aplicación móvil para los publicadores

``` mermaid
C4Context

title Diagrama de sistema de contexto para el sistema de transacciones de la congregación

Person(publisher, "Publicador", "Interesado en ver<br> el programa de predicación y<br> gestionar su disponibilidad.")
ContainerDb_Ext(programs_database, "Programas", "MongoDB", "Contiene los programas públicados <br> de predicación para los <br> publicadores de la congregación.")
ContainerDb_Ext(users_database, "Autenticación", "Supabase", "Contiene los registros de lo usuario <br> y publicadores de nla congregación")
ContainerDb_Ext(territories_database, "Base de datos", "Turso", "Contiene los registros de <br> los datos de los territorios")
Person(conductor, "Conductor de <br> grupo de predicación", "Interesado en consultar e informar<br> sobre asignaciones de territorio.")
Container_Ext(programs_api, "API de <br>programas de predicación", "Cloudflare Worker, Hono", "Provee funcionalidades <br> para la gestión de los <br>programas de predicación")
System(system, "Sistema de registro de <br> asignación de territorios", "Permite a los encargados gestionar<br> los territorios y las asignaciones de<br> territorio y publicar programas de predicación.")

Container_Boundary(mobile_app, "Aplicación móvil para los publicadores") { 
  Container(web_app, "Progressive Web App", "Typescript, React", "Provee todas las funcionalidades <br> para gestionar las asignaciones, <br>la disponibilidad y ver programas.")
  ContainerDb(offline_database, "Base de datos", "IndexedDB", "Almacena cambios fuera de línea <br> que se deben persistir en la base <br> de datos de territorios")
}

UpdateElementStyle(publisher, $bgColor="#18672c", $borderColor="#041107")
UpdateElementStyle(conductor, $bgColor="#18672c", $borderColor="#041107")

UpdateElementStyle(system, $bgColor="#208a3a", $borderColor="#041107")

UpdateElementStyle(web_app, $bgColor="#28AC49", $borderColor="#041107")
UpdateElementStyle(offline_database, $bgColor="#28AC49", $borderColor="#041107")

UpdateElementStyle(territories_database, $bgColor="#999999", $borderColor="#8A8A8A")
UpdateElementStyle(programs_database, $bgColor="#999999", $borderColor="#8A8A8A")
UpdateElementStyle(users_database, $bgColor="#999999", $borderColor="#8A8A8A")
UpdateElementStyle(programs_api, $bgColor="#999999", $borderColor="#8A8A8A")
```

### Componentes

#### API de la aplicación

Para simplificar el diagrama, se muestra el flujo de un componente como ejemplo de como funcionan los demás.

``` mermaid
---
config:
  look: handDraw
---
C4Context

title Diagrama de sistema de contexto para el sistema de transacciones de la congregación

ContainerDb_Ext(programs_database, "Programas", "MongoDB", "Contiene los programas públicados <br> de predicación para los <br> publicadores de la congregación.")
ContainerDb_Ext(users_database, "Autenticación", "Supabase", "Contiene los registros de lo usuario <br> y publicadores de nla congregación")
ContainerDb_Ext(territories_database, "Base de datos", "Turso", "Contiene los registros de <br> los datos de los territorios")
Container_Ext(programs_api, "API de <br>programas de predicación", "Cloudflare Worker, Hono", "Provee funcionalidades <br> para la gestión de los <br>programas de predicación")

Container(mobile, "Aplicación móvil para <br> los publicadores", "React", "Permite a los publicadores de <br> la congregración ver el programa <br> de predicación y reportar disponibilidad <br> o la cobertura de territorios.")
  
ContainerDb(database, "Base de datos", "SQLite", "Registros de asignaciones, <br>programas de predicación.")
ContainerDb(offline_database, "Base de datos", "IndexedDB", "Almacena cambios fuera de línea <br> que se deben persistir en la base <br> de datos de territorios")

Container(desktop_app, "Single-Page App", "Typescript, React, Electron", "Provee todas las funcionalidades <br> a los encargados para administrar <br>los territorios y sus asignaciones")

Container_Boundary(desktop_api, "API de la aplicación") {
 Component(command_bus, "Command Bus", "Nest Service", "Mediador que asigna el manejador <br> del comando correspondiente")
   Component(territory_controller, "Territory Controller", "Nest Controller", "Permite la gestión de territorios <br> y sus puntos de encuentro")
  Component(query_bus, "Query Bus", "Nest Service", "Mediador que asigna el manejador <br> del query correspondiente")
  Component(command_handler, "Command Handler", "Typescript Class", "Ejecuta el caso de <br> uso correspondiente")
  Component(auth_controller, "Auth Controller", "Nest Controller", "Permite la gestión de usuarios <br> y el inicio de sesión en la aplicación")
  Component(query_handler, "Query Handler", "Typescript Class", "Ejecuta el caso de <br> uso correspondiente")
  Component(congregation_controller, "Congregation Controller", "Nest Controller", "Permite la gestión de los <br> datos de la congregación")
  Component(conductor_controller, "Conductor Controller", "Nest Controller", "Permite la gestión de conductores <br> de grupo de predicación")
  Component(assignament_controller, "Assignament Controller", "Nest Controller", "Permite la gestión de las asignaciones <br> de territorio para predicar")
  Component(registry_controller, "Registry Controller", "Nest Controller", "Permite la gestión de los registros <br> de asignación de territorios <br> y la gestión de periodos de registro")
  Component(program_controller, "Program Controller", "Nest Controller", "Permite la gestión de programas <br> de predicación y solicitudes <br> de aprobación y publicación")

  Rel(desktop_app, territory_controller, "Usa")
  Rel(territory_controller, command_bus, "Usa")
  Rel(territory_controller, query_bus, "Usa")
  Rel(command_bus, command_handler, "Usa")
  Rel(query_bus, query_handler, "Usa")
  Rel(command_handler, database, "Escribe para")
  Rel(query_handler, database, "Lee desde")
  Rel(command_handler, programs_api, "Usa")
  Rel(query_handler, programs_api, "Usa")
  Rel(query_handler, users_database, "Usa")
  Rel(command_handler, users_database, "Escribe para")
  Rel(query_handler, territories_database, "Usa")
  Rel(command_handler, territories_database, "Escribe para")

  UpdateElementStyle(territory_controller, $bgColor="#53bd6d", $borderColor="#008A18")
  UpdateElementStyle(congregation_controller, $bgColor="#53bd6d", $borderColor="#008A18")
  UpdateElementStyle(auth_controller, $bgColor="#53bd6d", $borderColor="#008A18")
  UpdateElementStyle(command_bus, $bgColor="#53bd6d", $borderColor="#008A18")
  UpdateElementStyle(query_bus, $bgColor="#53bd6d", $borderColor="#008A18")
  UpdateElementStyle(assignament_controller, $bgColor="#53bd6d", $borderColor="#008A18")
  UpdateElementStyle(program_controller, $bgColor="#53bd6d", $borderColor="#008A18")
  UpdateElementStyle(registry_controller, $bgColor="#53bd6d", $borderColor="#008A18")
  UpdateElementStyle(conductor_controller, $bgColor="#53bd6d", $borderColor="#008A18")
  UpdateElementStyle(command_handler, $bgColor="#53bd6d", $borderColor="#008A18")
  UpdateElementStyle(query_handler, $bgColor="#53bd6d", $borderColor="#008A18")

  UpdateRelStyle(command_handler, users_database, $textColor="tomato", $lineColor="tomato")
  UpdateRelStyle(command_handler, programs_api, $textColor="tomato", $lineColor="tomato")
  UpdateRelStyle(command_handler, territories_database, $textColor="tomato", $lineColor="tomato")
  UpdateRelStyle(command_handler, database, $textColor="tomato", $lineColor="tomato")
  UpdateRelStyle(query_handler, users_database, $textColor="#3333a2", $lineColor="#3333a2")
  UpdateRelStyle(query_handler, programs_api, $textColor="#3333a2", $lineColor="#3333a2")
  UpdateRelStyle(query_handler, territories_database, $textColor="#3333a2", $lineColor="#3333a2")
  UpdateRelStyle(query_handler, database, $textColor="#3333a2", $lineColor="#3333a2")
  
}

BiRel(desktop_app, offline_database, "Lee desde <br> y escribe para", "PouchDB/ServiceWorker")
BiRel(programs_api, programs_database, "Lee desde <br> y escribe para")
Rel(mobile, programs_api, "Usa")

UpdateElementStyle(mobile, $bgColor="#28AC49", $borderColor="#008A18")
UpdateElementStyle(database, $bgColor="#28AC49", $borderColor="#008A18")
UpdateElementStyle(offline_database, $bgColor="#28AC49", $borderColor="#008A18")
UpdateElementStyle(desktop_app, $bgColor="#28AC49", $borderColor="#008A18")

UpdateLayoutConfig($c4ShapeInRow="3")

```

## Casos de uso

### 👨‍💼🗺️ Siervo de territorio y el superintendente de servicio

![Diagrama de registros del siervo de territorio](./etc/excalidraw/Registros%20del%20siervo%20de%20territorio%202025-02-12%2006.48.24.excalidraw.png)



### 🙋Conductor de grupo de predicación

![Diagrama de registros del siervo de territorio](./etc/excalidraw/Registros%20del%20siervo%20de%20territorio%202025-02-12%2007.18.51.excalidraw.png)

### 👥 Publicador

![Diagrama de registros del siervo de territorio](./etc/excalidraw/Registros%20del%20siervo%20de%20territorio%202025-02-13%2009.16.42.excalidraw.png)

## Base de datos

### General

``` mermaid
---
config:
  layout: elk
  elk:
    mergeEdges: true
    nodePlacementStrategy: LINEAR_SEGMENTS
  look: handDraw
  theme: forest
---
erDiagram

CONGREGATIONS ||--o{ TERRITORIES : tiene
TERRITORIES ||..|{ MEETING_PLACES : tiene
TERRITORIES ||..o{ REGISTRIES : "esta en"
REGISTRIES }o..|| REGISTRY_PERIODS : "es de"
MEETING_PLACES ||--o{ ASSIGNAMENTS : es
TERRITORIES ||--|{ TERRITORY_OF_ASSIGNAMENT : asignado
TERRITORY_OF_ASSIGNAMENT }|--|| ASSIGNAMENTS : asignado
MEETING_PLACES |o--o| PUBLISHERS : vive
ASSIGNAMENTS }o--|| CONDUCTORS : encargado
REGISTRIES }o..|| CONDUCTORS : "fue asignado"
ASSIGNAMENTS }o--|| PROGRAMS : "forma parte"
CONDUCTORS ||--o|  PUBLISHERS : es
PUBLISHERS ||--o{ AVAILABILITY : "puede estar"

```

### Territorios con su congregación

![Diagrama de entidad relación](./etc/excalidraw/Registros%20del%20siervo%20de%20territorio%202025-02-18%2010.39.51.excalidraw.png)

``` mermaid
---
config:
  look: handDraw
  theme: forest
---
erDiagram

CONGREGATIONS ||--o{ TERRITORIES : tiene
TERRITORIES ||..|{ MEETING_PLACES : tiene
TERRITORIES ||..o{ REGISTRIES : "esta en"
CONGREGATIONS {
  numeric number PK
  text(200) name UK "NN"
  text(150) circuit "NN"
  numeric number_of_territories "NULL, por defecto: 0"
  text(255) map_image_url "NULL"
  text(255) north_limit "NN"
  text(255) south_limit "NN"
  text(255) east_limit "NN"
  text(255) west_limit "NN"
}

TERRITORIES {
  numeric congregation_number PK, FK
  numeric number PK
  text territory_id UK "De tipo UUID"
  text(100) label UK
  text(80) sector "NULL"
  numeric quantity_houses "NN, por defecto 0"
  text(255) locality "NN"
  text(255) locality_in_part "NULL"
  text(255) map_image_url "NULL"
  date last_date_completed "NN"
  boolean current_assigned "NN, por defecto: false"
}
```

### Puntos de encuentro para salir a predicar y su disponibilidad para hacer reunión para el servicio del campo

[[PalHub#Publicadores y su disponibilidad|🔗 Ver más detalles sobre la disponibilidad de los publicadores]]

``` mermaid
---
config:
  look: handDraw
  theme: forest
---
erDiagram

TERRITORIES ||..|{ MEETING_PLACES : tiene
MEETING_PLACES ||--o{ ASSIGNAMENTS : es
MEETING_PLACES |o--o| PUBLISHERS : vive
PUBLISHERS ||--o{ AVAILABILITY : "puede estar"
MEETING_PLACES {
  text meeting_place_id PK
  text(200) address "NN"
  text(10) latitude "NULL"
  text(10) longitude "NULL"
}

```

### Conductores de grupo de predicación y su disponibilidad

[[PalHub#Publicadores y su disponibilidad|🔗 Ver más detalles sobre la disponibilidad de los publicadores]]

![Diagrama de entidad relación](./etc/excalidraw/Registros%20del%20siervo%20de%20territorio%202025-02-19%2007.30.06.excalidraw.png)

``` mermaid
---
config:
  look: handDraw
  theme: forest
---
erDiagram

REGISTRIES }o..|| CONDUCTORS : contiene
ASSIGNAMENTS }o--|| CONDUCTORS : recibe
CONDUCTORS ||--o|  PUBLISHERS : "es un"
PUBLISHERS ||--o{ AVAILABILITY : informa
CONDUCTORS {
  text publisher_id FK
  date last_date_assigned "NULL"
}

```

### Registros de asignación de territorios

![Diagrama de entidad relación](./etc/excalidraw/Registros%20del%20siervo%20de%20territorio%202025-03-04%2012.18.59.excalidraw.png)

``` mermaid
---
config:
  look: handDraw
  theme: forest
---
erDiagram
TERRITORIES ||..o{ REGISTRIES : "esta en"
REGISTRIES }o..|| REGISTRY_PERIODS : "es de"
REGISTRIES }o..|| CONDUCTORS : "fue asignado"
REGISTRIES {
  text registry_id PK "De tipo UUID"
  date date_assigned "NN"
  date date_completed "NULL"
  text assigned_to  FK
  text territory_id FK
  text period_id FK
}
REGISTRY_PERIODS {
  text period_id PK "De tipo UUID"
  text description "NN"
  date start_date "NN"
  date finish_date "NULL"
}
```

### Asignaciones y programa de predicación

![Diagrama de entidad relación](./etc/excalidraw/Registros%20del%20siervo%20de%20territorio%202025-03-04%2013.07.48.excalidraw.png)

``` mermaid
---
config:
  look: handDraw
  theme: forest
---
erDiagram
TERRITORIES ||--|{ TERRITORY_OF_ASSIGNAMENT : asignado
TERRITORY_OF_ASSIGNAMENT }|--|| ASSIGNAMENTS : asignado
MEETING_PLACES ||--o{ ASSIGNAMENTS : convocado
ASSIGNAMENTS }o--|| CONDUCTORS : encargado
ASSIGNAMENTS }o--|| PROGRAMS : "forma parte"
ASSIGNAMENTS {
  text assignament_id PK "Tipo UUID"
  datetime date "NN"
  text meeting_place_id FK
  text conductor_id FK
  text program_id FK
}
TERRITORY_OF_ASSIGNAMENT {
  text territory_id PK, FK
  text assignament_id PK, FK
  boolean covered "NN, por defecto: false"
  text(255) report "NULL"
}
PROGRAMS {
  text program_id PK "De tipo UUID"
  date since_week "NN"
  date until_week "NN"
  boolean is_published "NN, por defecto: false"
  datetime created_at "Por defecto fecha al momento de registrar"
  datetime updated_at "Al momento de actualizar"
}
```

## API Rest Enpoints

Con el propósito de hacer un boceto de la API se ha escrito los siguientes ejemplos y no deben tomarse como una documentación, sino como ayuda para el programador. 

Para acceder a la documentación (Swagger) de la API vaya a la siguiente enlace, cuando el servidor de la aplicación este en ejecución: `/api/v2/doc`

```http
GET /api/v2/territories
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```
``` http
GET /api/v2/territories?filters[0][field]=isAssigned&filters[0][operator]=EQUAL&filters[0][value]=false?orderBy=lastCompleted&order=ASC&cursor=230dc278-bcfe-4211-ba34-a96289d50627&limit=20
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```
```http
GET /api/v2/territories/7047/4
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```
``` http
PUT /api/v2/territories/230dc278-bcfe-4211-ba34-a96289d50627
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

{
  "number": 3,
  "label": "Label if territory",
  ...
}
```
``` http
POST /api/v2/territories
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

{
  "number": 4,
  "label": "Label of territory",
  ...
}
```
``` http
PATCH /api/v2/territories/230dc278-bcfe-4211-ba34-a96289d50627
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

{
  "label": "New label of territory",
  ...
}
```
``` http
DELETE /api/v2/territories/230dc278-bcfe-4211-ba34-a96289d50627
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

## Trabajando en

- Add Swagger documentation Api
- Add end to end test per endpoint
- Add unit test
- Use Domain Driven Design methodology
- Use Port and Adapter Architecture

## Requisitos

Necesitas tener instalado:

- NodeJs

## Como instalar el servidor localmente

1. Clone the repository

```
git clone https://github.com/gchnick/territory-api.git
```

2. Compile the project

Run following command:

```
node --run build
```

3. Go to dist folder

Now work into dist folder.

4. Config file

Rename the **env.example** file to **.env**

You can change the values ​​of each of the environment variables to suit your needs.

5. Instalar las dependencias necesarias:

```
pnpm install --prod
```

6. Desplegar bases de datos

```
node --run prisma:deploy
```

> 📝 **NOTA**
>  
> Aplicar una migración usando Turso CLI
> 
> ```sh
> turso db shell turso-prisma.db < ./prisma/external/migrations/ 20250310214508_init/migration.sql
> ```

7. Iniciar servidor

```
node --run start
```
