import 'package:flutter/material.dart';
import 'package:mobile/services/api_service.dart';

class CarritoPage extends StatefulWidget {
  const CarritoPage({super.key});

  @override
  _CarritoPageState createState() => _CarritoPageState();
}

class _CarritoPageState extends State<CarritoPage> {
  List<dynamic> carrito = [];
  bool cargando = true;

  @override
  void initState() {
    super.initState();
    _cargarCarrito();
  }

  Future<void> _cargarCarrito() async {
    try {
      final data = await ApiService.getCarrito();
      setState(() {
        carrito = data;
        cargando = false;
      });
    } catch (e) {
      setState(() {
        cargando = false;
      });
      print('Error: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Carrito de Compras'),
      ),
      body: cargando
          ? const Center(child: CircularProgressIndicator())
          : carrito.isEmpty
              ? const Center(child: Text('No hay productos en el carrito'))
              : ListView.builder(
                  itemCount: carrito.length,
                  itemBuilder: (context, index) {
                    final producto = carrito[index];
                    return ListTile(
                      title: Text(producto['nombre']),
                      subtitle: Text('S/ ${producto['precio']}'),
                      trailing: IconButton(
                        icon: const Icon(Icons.remove_shopping_cart),
                        onPressed: () async {
                          try {
                            await ApiService.eliminarDelCarrito(producto['id']);
                            setState(() {
                              carrito.removeAt(index); // Eliminar el producto localmente
                            });
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Producto eliminado del carrito')),
                            );
                          } catch (e) {
                            print('Error al eliminar del carrito: $e');
                          }
                        },
                      ),
                    );
                  },
                ),
    );
  }
}