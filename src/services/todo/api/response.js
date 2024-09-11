const express = require("express");
const { StatusCodes } = require("http-status-codes");

const listResponse = (
  res,
  { results, message = null, code = StatusCodes.OK }
) => {
  return res
    .status(code)
    .json({
      message,
      results,
    })
    .end();
};

const successResponse = (
  res,
  { message = null, data = null, code = StatusCodes.OK }
) => {
  return res
    .status(code)
    .json({
      message,
      data,
    })
    .end();
};

const errorResponse = (
  res,
  { message, data = null, code = StatusCodes.BAD_REQUEST }
) => {
  return res
    .status(code)
    .json({
      message,
      data,
    })
    .end();
};

module.exports = {
  listResponse,
  successResponse,
  errorResponse,
};
