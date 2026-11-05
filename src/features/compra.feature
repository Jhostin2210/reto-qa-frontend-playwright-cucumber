# language: es
@compra
Característica: Proceso de compra
  Como cliente de Sauce Demo
  Quiero iniciar sesión, agregar productos al carrito y completar una compra
  Para poder adquirir los productos que necesito

  Antecedentes:
    Dado que el usuario inició sesión como "standard_user"

  @smoke @positivo @e2e
  Escenario: Completar la compra de un producto hasta la confirmación
    Cuando agrega el producto "Sauce Labs Backpack" al carrito
    Y abre el carrito de compras
    Y procede al checkout
    Y completa sus datos de envío con nombre "Juan", apellido "Pérez" y código postal "15001"
    Y finaliza la compra
    Entonces debería ver la confirmación de la orden "Thank you for your order!"
    Y el carrito debería quedar vacío

  @positivo
  Escenario: El resumen de la orden muestra los productos y calcula bien los totales
    Cuando agrega los siguientes productos al carrito:
      | producto                 |
      | Sauce Labs Backpack      |
      | Sauce Labs Bike Light    |
      | Sauce Labs Fleece Jacket |
    Y abre el carrito de compras
    Y procede al checkout
    Y completa sus datos de envío con datos válidos
    Entonces el resumen de la orden debería listar los productos agregados
    Y el subtotal debería ser la suma de los precios de los productos
    Y el total debería ser el subtotal más los impuestos

  @negativo
  Esquema del escenario: No se puede continuar el checkout sin <campo>
    Cuando agrega el producto "Sauce Labs Onesie" al carrito
    Y abre el carrito de compras
    Y procede al checkout
    Y completa sus datos de envío con nombre "<nombre>", apellido "<apellido>" y código postal "<codigoPostal>"
    Entonces el formulario de checkout debería mostrar el error "<mensaje>"

    Ejemplos:
      | campo         | nombre | apellido | codigoPostal | mensaje                        |
      | nombre        |        | Pérez    | 15001        | Error: First Name is required  |
      | apellido      | Juan   |          | 15001        | Error: Last Name is required   |
      | código postal | Juan   | Pérez    |              | Error: Postal Code is required |

  @positivo
  Escenario: Cancelar el checkout regresa al carrito sin perder los productos
    Cuando agrega el producto "Sauce Labs Bike Light" al carrito
    Y abre el carrito de compras
    Y procede al checkout
    Y cancela el checkout
    Entonces debería estar en el carrito de compras
    Y el carrito debería contener exactamente los productos agregados
