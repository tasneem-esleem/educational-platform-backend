// // utils/sendResponse.js
// function sendResponse(res, statusCode, data, message = null, extra = {}) {
//   const response = {
//     success: true,
//     data,
//   };

//   if (message) {
//     response.message = message;
//   }

//   Object.assign(response, extra);

//   return res.status(statusCode).json(response);
// }

// module.exports = sendResponse;

function sendResponse(
  res,
  statusCode = 200,
  data = null,
  message = "Success",
  extra = {}
) {
  const response = {
    success: statusCode < 400,
    statusCode,
    message,
    data,
    error: null,
  };

  Object.assign(response, extra);

  return res.status(statusCode).json(response);
}

module.exports = sendResponse;