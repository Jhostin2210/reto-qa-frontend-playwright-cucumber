# language: es
@login
Característica: Inicio de sesión en Sauce Demo
  Como cliente de Sauce Demo
  Quiero iniciar sesión con mis credenciales
  Para poder acceder al catálogo de productos

  Antecedentes:
    Dado que el usuario está en la página de inicio de sesión

  @smoke @positivo
  Escenario: Inicio de sesión exitoso con standard_user
    Cuando inicia sesión como "standard_user"
    Entonces debería ver la página de productos
    Y el catálogo debería mostrar 6 productos

  @negativo
  Escenario: El usuario bloqueado locked_out_user no puede iniciar sesión
    Cuando inicia sesión como "locked_out_user"
    Entonces debería ver el mensaje de error "Epic sadface: Sorry, this user has been locked out."
    Y debería permanecer en la página de inicio de sesión

  @negativo
  Esquema del escenario: Inicio de sesión fallido por <caso>
    Cuando ingresa el usuario "<usuario>" y la contraseña "<password>"
    Entonces debería ver el mensaje de error "<mensaje>"
    Y debería permanecer en la página de inicio de sesión

    Ejemplos:
      | caso                  | usuario       | password      | mensaje                                                                   |
      | contraseña incorrecta | standard_user | clave_erronea | Epic sadface: Username and password do not match any user in this service |
      | usuario inexistente   | usuario_falso | secret_sauce  | Epic sadface: Username and password do not match any user in this service |
      | usuario vacío         |               | secret_sauce  | Epic sadface: Username is required                                        |
      | contraseña vacía      | standard_user |               | Epic sadface: Password is required                                        |
      | ambos campos vacíos   |               |               | Epic sadface: Username is required                                        |

  @negativo
  Escenario: No se puede acceder al catálogo sin iniciar sesión
    Cuando intenta abrir directamente la página de productos
    Entonces debería ver el mensaje de error "Epic sadface: You can only access '/inventory.html' when you are logged in."
    Y debería permanecer en la página de inicio de sesión
