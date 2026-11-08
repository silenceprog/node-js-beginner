import { Segments, Joi } from "celebrate";
import { isValidObjectId } from "mongoose";
import { TAGS } from "../constants/tags.js";

const validateObjectId = (value, helpers) => {
  // isValidObjectId(value) true або false
  // якшо це валідний id то повернути value
  // якшо не валідний повернути helpers.message("повідомлення про помилка")

  if (isValidObjectId(value)) {
    return value;
  }
  return helpers.message("Invalid id format");
};

export const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1),
    perPage: Joi.number().integer().min(1).max(20),
  }),
};
export const noteIdSchema = {
  [Segments.HEADERS]: Joi.object({
    noteId: Joi.string().custom(validateObjectId),
  }),
};
export const createNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).required(),
    content: Joi.string(),
    tag: Joi.string().valid(...TAGS),
  }),
};
export const updateNoteSchema = {
  [Segments.QUERY]: Joi.object({
    title: Joi.string().min(1),
    content: Joi.string(),
    tag: Joi.string().valid(...TAGS),
  }),
};
