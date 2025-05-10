import 'package:flutter/material.dart';
import 'package:mobile/models/product.dart';
import 'package:mobile/services/api_service.dart';

class HomeScreen extends StatefulWidget {
  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late Future<List<Product>> products;

  @override
  void initState() {
    super.initState();
    products = ApiService().getProducts();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Carrito de Compras"),
      ),
      body: FutureBuilder<List<Product>>(
        future: products,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text("Error: ${snapshot.error}"));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return Center(child: Text("No hay productos disponibles"));
          } else {
            List<Product> productsList = snapshot.data!;
            return ListView.builder(
              itemCount: productsList.length,
              itemBuilder: (context, index) {
                Product product = productsList[index];
                return ListTile(
                  title: Text(product.name),
                  subtitle: Text("S/ ${product.price}"),
                  trailing: Icon(Icons.add_shopping_cart),
                  onTap: () {
                    // Aquí puedes agregar funcionalidad de agregar al carrito
                  },
                );
              },
            );
          }
        },
      ),
    );
  }
}