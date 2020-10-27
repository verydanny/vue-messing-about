import { Router } from "express"
import { getRepository } from "typeorm"

import { Hospital } from "../entities/hospital"

export const hospitalRouter = Router()

hospitalRouter.get("/all", async (req, res, next) => {
  const hospitalRepo = getRepository(Hospital)

  try {
    const hospitals = await hospitalRepo.find()

    return res.send(hospitals)
  } catch (err) {
    return next(err)
  }
})
