import database from "../config/mysql.config.js";
import Response from "../domain/response.js";
import logger from "../util/logger.js";
import QUERY from "../query/patient.query.js";

const HttpStatus = {
  OK: { code: 200, status: "OK" },
  CREATED: { code: 201, status: "CREATED" },
  NO_CONTENT: { code: 204, status: "NO_CONTENT" },
  BAD_REQUEST: { code: 400, status: "BAD_REQUEST" },
  NOT_FOUND: { code: 404, status: "NOT_FOUND" },
  INTERNAL_SERVER_ERROR: { code: 500, status: "INTERNAL_SERVER_ERROR" },
};

export const getPatients = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, FETCHING PATIENTS`);
  database.query(QUERY.SELECT_PATIENTS, (error, results) => {
    if (!results) {
      res
          .status(HttpStatus.OK.code)
          .send(
              new Response(
                  HttpStatus.OK.code,
                  HttpStatus.OK.status,
                  `NO PATIENTS FOUND!`
              )
          );
    } else {
      res
          .status(HttpStatus.OK.code)
          .send(
              new Response(
                  HttpStatus.OK.code,
                  HttpStatus.OK.status,
                  `PATIENTS RETRIEVED!`,
                  { patients: results }
              )
          );
    }
  });
};

export const createPatient = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, CREATING PATIENT`);
  database.query(
      QUERY.CREATE_PATIENT,
      Object.values(req.body),
      (error, results) => {
        if (!results) {
          logger.error(error.message);
          res
              .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
              .send(
                  new Response(
                      HttpStatus.INTERNAL_SERVER_ERROR.code,
                      HttpStatus.INTERNAL_SERVER_ERROR.status,
                      `ERROR OCCURRED!`
                  )
              );
        } else {
          const patient = {
            id: results.insertId,
            ...req.body,
            createdAt: new Date(),
          };
          res
              .status(HttpStatus.CREATED.code)
              .send(
                  new Response(
                      HttpStatus.CREATED.code,
                      HttpStatus.CREATED.status,
                      `PATIENT CREATED!`,
                      { patient }
                  )
              );
        }
      }
  );
};

export const getPatient = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, FETCHING PATIENT`);
  database.query(QUERY.SELECT_PATIENT, [req.params.id], (error, results) => {
    if (!results[0]) {
      logger.error(error.message);
      res
          .status(HttpStatus.NOT_FOUND.code)
          .send(
              new Response(
                  HttpStatus.NOT_FOUND.code,
                  HttpStatus.NOT_FOUND.status,
                  `PATIENT BY ID ${req.params.id} WAS NOT FOUND!`
              )
          );
    } else {
      res
          .status(HttpStatus.OK.code)
          .send(
              new Response(
                  HttpStatus.OK.code,
                  HttpStatus.OK.status,
                  `PATIENT RETRIEVED!`,
                  results[0]
              )
          );
    }
  });
};

export const updatePatient = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, FETCHING PATIENT`);
  database.query(QUERY.SELECT_PATIENT, [req.params.id], (error, results) => {
    if (!results[0]) {
      res
          .status(HttpStatus.NOT_FOUND.code)
          .send(
              new Response(
                  HttpStatus.NOT_FOUND.code,
                  HttpStatus.NOT_FOUND.status,
                  `PATIENT BY ID ${req.params.id} WAS NOT FOUND!`
              )
          );
    } else {
      logger.info(`${req.method} ${req.originalUrl}, UPDATING PATIENT`);
      database.query(
          QUERY.UPDATE_PATIENT,
          [...Object.values(req.body), req.params.id],
          (error, results) => {
            if (!error) {
              res
                  .status(HttpStatus.OK.code)
                  .send(
                      new Response(
                          HttpStatus.OK.code,
                          HttpStatus.OK.status,
                          `PATIENT UPDATED!`,
                          { id: req.params.id, ...req.body }
                      )
                  );
            } else {
              logger.error(error.message);
              res
                  .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
                  .send(
                      new Response(
                          HttpStatus.INTERNAL_SERVER_ERROR.code,
                          HttpStatus.INTERNAL_SERVER_ERROR.status,
                          `ERROR OCCURED!`
                      )
                  );
            }
          }
      );
    }
  });
};

export const deletePatient = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, DELETING PATIENT`);
  database.query(QUERY.DELETE_PATIENT, [req.params.id], (error, results) => {
    if (results.affectedRows > 0) {
      res
          .status(HttpStatus.OK.code)
          .send(
              new Response(
                  HttpStatus.OK.code,
                  HttpStatus.OK.status,
                  `PATIENT DELETED!`,
                  results[0]
              )
          );
    } else {
      res
          .status(HttpStatus.NOT_FOUND.code)
          .send(
              new Response(
                  HttpStatus.NOT_FOUND.code,
                  HttpStatus.NOT_FOUND.status,
                  `PATIENT BY ID ${req.params.id} WAS NOT FOUND!`
              )
          );
    }
  });
};

export default HttpStatus;