import { Response } from "miragejs";
import { formatDate, requiresAuth } from "../utils/authUtils";

/**
 * All the routes related to FavouritesList are present here.
 * These are private routes.
 * Client needs to add "authorization" header with JWT token in it to access it.
 * */

/**
 * This handler handles getting items to user's favouritesList.
 * send GET Request at /api/user/favouritesList
 * */

export const getFavouritesListItemsHandler = function (schema, request) {
  const userId = requiresAuth.call(this, request);
  if (!userId) {
    return new Response(
      404,
      {},
      {
        errors: ["The email you entered is not Registered. Not Found error"],
      }
    );
  }
  const userFavouritesList = schema.users.findBy({ _id: userId }).favouritesList;
  return new Response(200, {}, { favouritesList: userFavouritesList });
};

/**
 * This handler handles adding items to user's favouritesList.
 * send POST Request at /api/user/favouritesList
 * body contains {product}
 * */

export const addItemToFavouritesListHandler = function (schema, request) {
  const userId = requiresAuth.call(this, request);
  try {
    if (!userId) {
      return new Response(
        404,
        {},
        {
          errors: ["The email you entered is not Registered. Not Found error"],
        }
      );
    }
    const userFavouritesList = schema.users.findBy({ _id: userId }).favouritesList;
    const { product } = JSON.parse(request.requestBody);
    userFavouritesList.push({
      ...product,
      createdAt: formatDate(),
      updatedAt: formatDate(),
    });
    this.db.users.update({ _id: userId }, { favouritesList: userFavouritesList });
    return new Response(201, {}, { favouritesList: userFavouritesList });
  } catch (error) {
    return new Response(
      500,
      {},
      {
        error,
      }
    );
  }
};

/**
 * This handler handles removing items to user's favouritesList.
 * send DELETE Request at /api/user/favouritesList
 * body contains {product}
 * */

export const removeItemFromFavouritesListHandler = function (schema, request) {
  const userId = requiresAuth.call(this, request);
  try {
    if (!userId) {
      return new Response(
        404,
        {},
        {
          errors: ["The email you entered is not Registered. Not Found error"],
        }
      );
    }
    let userFavouritesList = schema.users.findBy({ _id: userId }).favouritesList;
    const productId = request.params.productId;
    userFavouritesList = userFavouritesList.filter((item) => item._id !== productId);
    this.db.users.update({ _id: userId }, { favouritesList: userFavouritesList });
    return new Response(200, {}, { favouritesList: userFavouritesList });
  } catch (error) {
    return new Response(
      500,
      {},
      {
        error,
      }
    );
  }
};
