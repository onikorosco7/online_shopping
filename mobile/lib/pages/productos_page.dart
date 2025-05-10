import 'package:flutter/material.dart';
import 'package:mobile/services/api_service.dart';
import 'package:mobile/pages/carrito_page.dart'; // Importa la página del carrito

class ProductosPage extends StatefulWidget {
  const ProductosPage({super.key});

  @override
  State<ProductosPage> createState() => _ProductosPageState();
}

class _ProductosPageState extends State<ProductosPage> {
  List<dynamic> productos = [];
  bool cargando = true;

  @override
  void initState() {
    super.initState();
    _cargarProductos();
  }

  Future<void> _cargarProductos() async {
    try {
      final data = await ApiService.getProductos();
      setState(() {
        productos = data;
        cargando = false;
      });
    } catch (e) {
      setState(() {
        cargando = false;
      });
      print('Error: $e');
    }
  }

  Future<void> _agregarAlCarrito(int productoId) async {
    try {
      await ApiService.agregarAlCarrito(productoId);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Producto agregado al carrito')),
      );
    } catch (e) {
      print('Error al agregar al carrito: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Carrito de Compras'),
        actions: [
          IconButton(
            icon: const Icon(Icons.shopping_cart),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const CarritoPage()),
              );
            },
          ),
        ],
      ),
      body: cargando
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              itemCount: productos.length,
              itemBuilder: (context, index) {
                final producto = productos[index];
                return ListTile(
                  title: Text(producto['nombre']),
                  subtitle: Text('S/ ${producto['precio']}'),
                  trailing: IconButton(
                    icon: const Icon(Icons.add_shopping_cart),
                    onPressed: () => _agregarAlCarrito(producto['id']),
                  ),
                );
              },
            ),
    );
  }
}