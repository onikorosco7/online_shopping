import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl = 'http://localhost:8000'; // Cambia por tu IP local si usas móvil o emulador

  // Obtener todos los productos
  static Future<List<dynamic>> getProductos() async {
    final response = await http.get(Uri.parse('$baseUrl/productos'));

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Error al cargar productos');
    }
  }

  // Agregar producto al carrito
  static Future<void> agregarAlCarrito(int productoId) async {
    final response = await http.post(
      Uri.parse('$baseUrl/carrito'),
      body: jsonEncode({'producto_id': productoId}),
      headers: {'Content-Type': 'application/json'},
    );

    if (response.statusCode != 200) {
      throw Exception('Error al agregar producto al carrito');
    }
  }

  // Obtener carrito
  static Future<List<dynamic>> getCarrito() async {
    final response = await http.get(Uri.parse('$baseUrl/carrito'));

    if (response.statusCode == 200) {
      return jsonDecode(response.body)['productos'];
    } else {
      throw Exception('Error al cargar carrito');
    }
  }

  // Eliminar producto del carrito
  static Future<void> eliminarDelCarrito(int productoId) async {
    final response = await http.delete(
      Uri.parse('$baseUrl/carrito/$productoId'),
    );

    if (response.statusCode != 200) {
      throw Exception('Error al eliminar producto del carrito');
    }
  }
}