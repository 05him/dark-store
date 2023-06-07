import { Server, Model, RestSerializer } from "miragejs";
import {
  loginHandler,
  signupHandler,
} from "./backend/controllers/AuthController";
import {
  addItemToCartHandler,
  getCartItemsHandler,
  removeItemFromCartHandler,
  updateCartItemHandler,
} from "./backend/controllers/CartController";
import {
  getAllCategoriesHandler,
  getCategoryHandler,
} from "./backend/controllers/CategoryController";
import {
  getAllProductsHandler,
  getProductHandler,
} from "./backend/controllers/ProductController";
import {
  addItemToFavouritesListHandler,
  getFavouritesListItemsHandler,
  removeItemFromFavouritesListHandler,
} from "./backend/controllers/FavouritesListController";
import{
  getAddressListHandler,
  addAddressHandler,
  updateAddressHandler,
  removeAddressHandler
} from './backend/controllers/AddressController'
import { categories } from "./backend/db/categories";
import { products } from "./backend/db/products";
import { users } from "./backend/db/users";

export function makeServer({ environment = "development" } = {}) {
  return new Server({
    serializers: {
      application: RestSerializer,
    },
    environment,
    models: {
      product: Model,
      category: Model,
      user: Model,
      cart: Model,
      favouritesList: Model,
    },

    // Runs on the start of the server
    seeds(server) {
      // disballing console logs from Mirage
      server.logging = false;
      products.forEach((item) => {
        server.create("product", { ...item });
      });

      users.forEach((item) =>
        server.create("user", { ...item, cart: [], favouritesList: [], addressList : [] })
      );

      categories.forEach((item) => server.create("category", { ...item }));
    },

    routes() {
      this.namespace = "api";
      // auth routes (public)
      this.post("/auth/signup", signupHandler.bind(this));
      this.post("/auth/login", loginHandler.bind(this));

      // products routes (public)
      this.get("/products", getAllProductsHandler.bind(this));
      this.get("/products/:productId", getProductHandler.bind(this));

      // categories routes (public)
      this.get("/categories", getAllCategoriesHandler.bind(this));
      this.get("/categories/:categoryId", getCategoryHandler.bind(this));

      // cart routes (private)
      this.get("/user/cart", getCartItemsHandler.bind(this));
      this.post("/user/cart", addItemToCartHandler.bind(this));
      this.post("/user/cart/:productId", updateCartItemHandler.bind(this));
      this.delete(
        "/user/cart/:productId",
        removeItemFromCartHandler.bind(this)
      );

      // favouritesList routes (private)
      this.get("/user/favouritesList", getFavouritesListItemsHandler.bind(this));
      this.post("/user/favouritesList", addItemToFavouritesListHandler.bind(this));
      this.delete(
        "/user/favouritesList/:productId",
        removeItemFromFavouritesListHandler.bind(this)
      );

      // address routes(private)
      this.get("/user/addressList", getAddressListHandler.bind(this));
      this.post("/user/addressList", addAddressHandler.bind(this));
      this.post("/user/addressList/:addressID", updateAddressHandler.bind(this));
      this.delete("/user/addressList/:addressID", removeAddressHandler.bind(this));
    },
  });
}
