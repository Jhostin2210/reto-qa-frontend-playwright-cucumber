# language: es
@carrito
Característica: Carrito de compras
  Como cliente de Sauce Demo
  Quiero agregar productos al carrito desde la página de productos
  Para revisarlos antes de comprarlos

  Antecedentes:
    Dado que el usuario inició sesión como "standard_user"

  @smoke @positivo
  Escenario: Agregar un producto al carrito desde la página de productos
    Cuando agrega el producto "Sauce Labs Backpack" al carrito
    Entonces el ícono del carrito debería mostrar 1 producto
    Y el botón del producto "Sauce Labs Backpack" debería decir "Remove"

  @smoke @positivo
  Escenario: Ver en el carrito los productos agregados
    Cuando agrega los siguientes productos al carrito:
      | producto              |
      | Sauce Labs Backpack   |
      | Sauce Labs Bike Light |
      | Sauce Labs Onesie     |
    Y abre el carrito de compras
    Entonces el ícono del carrito debería mostrar 3 productos
    Y el carrito debería contener exactamente los productos agregados
    Y cada producto del carrito debería tener el mismo precio que en el catálogo

  @positivo
  Escenario: Eliminar un producto desde el carrito
    Cuando agrega los siguientes productos al carrito:
      | producto                |
      | Sauce Labs Backpack     |
      | Sauce Labs Bolt T-Shirt |
    Y abre el carrito de compras
    Y elimina el producto "Sauce Labs Backpack" del carrito
    Entonces el ícono del carrito debería mostrar 1 producto
    Y el carrito debería contener exactamente los productos agregados

  @positivo
  Escenario: El carrito conserva los productos al seguir comprando
    Cuando agrega el producto "Sauce Labs Fleece Jacket" al carrito
    Y abre el carrito de compras
    Y vuelve a la página de productos
    Y agrega el producto "Sauce Labs Onesie" al carrito
    Y abre el carrito de compras
    Entonces el ícono del carrito debería mostrar 2 productos
    Y el carrito debería contener exactamente los productos agregados
