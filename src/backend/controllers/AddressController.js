import { Response } from "miragejs";
import { v4 as uuid } from "uuid";
import { formatDate, requiresAuth } from "../utils/authUtils";

/**
 * All the routes related to Address List are present here.
 * These are private routes.
 * Client needs to add "authorization" header with JWT token in it to access it.
 * */

/**
 * This handler handles getting items to user's address list.
 * send GET Request at /api/user/addressList
 * */

export const getAddressListHandler = function (schema, request) {
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
  const userAddressList = schema.users.findBy({ _id: userId }).addressList;
  return new Response(200, {}, { addressList: userAddressList });
};

/**
 * This handler handles adding items to user's address List.
 * send POST Request at /api/user/addressList
 * body contains {address}
 * */

export const addAddressHandler = function (schema, request) {
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
    const userAddressList = schema.users.findBy({ _id: userId }).addressList;
    const { address } = JSON.parse(request.requestBody);
    userAddressList.push({
        _id: uuid(),
      ...address,
      createdAt: formatDate(),
      updatedAt: formatDate(),
    });
    this.db.users.update({ _id: userId }, { addressList: userAddressList });
    return new Response(201, {}, { addressList: userAddressList });
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
 * This handler handles editing user's address in address list
 * send POST Request at /api/user/addressList/:addressID
 * body contains {address}
 * */

export const updateAddressHandler = function (schema, request) {
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
      let userAddressList = schema.users.findBy({ _id: userId }).addressList;
      const addressID = request.params.addressID;
      const { address } = JSON.parse(request.requestBody);
      userAddressList = userAddressList.map((item) => item._id === addressID ? ({...item, ...address, createdAt: formatDate(), updatedAt: formatDate(),}) : item );
      this.db.users.update({ _id: userId }, { addressList: userAddressList });
      return new Response(200, {}, { addressList: userAddressList });
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
 * This handler handles removing items to user's address list.
 * send DELETE Request at /api/user/addressList/:addressID
 * body contains {address}
 * */

export const removeAddressHandler = function (schema, request) {
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
    let userAddressList = schema.users.findBy({ _id: userId }).addressList;
    const addressID = request.params.addressID;
    userAddressList = userAddressList.filter((item) => item._id !== addressID);
    this.db.users.update({ _id: userId }, { addressList: userAddressList });
    return new Response(200, {}, { addressList: userAddressList });
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
