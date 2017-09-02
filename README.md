# 🍅🔵 Pomo Blue

### Características

* Uso Personal
* Offline APP

### ¿Que es un pomodoro?

Es una técnica planteada por _Francesco Cirillo_ para mejorar la administración del tiempo. Se basa en tener rangos de tiempo de en donde el usuario esta en suma concentración desarrollando una tarea previamente planteada por unos 25 minutos, en donde el usuario deberá no considerar otras tareas. y si por alguna razón debe de abandonar esta tarea es que el usuario deberá tomarse 5 minutos y luego reiniciar el pomodoro nuevamente.

_Ve más información [aquí](https://es.wikipedia.org/wiki/T%C3%A9cnica_Pomodoro)._

### ¿Que es lo que soluciona PomoBlue?

```plantuml
@startuml

:Usuario: as user
:Invitado: as invit

invit --|> user

'Administrar Tareas
user --> (Ver Tareas)
user --> (Crear nueva Tarea)
user --> (Cumplir Tarea)

user --> (Ver registro de Tarea Cumplidas)

(Cumplir Tarea) ..> (Agregar al registro de tareas cumplidas) : <<include>>

@enduml
```


