import { Router } from "express"

export const apiRouter = Router()

apiRouter.get("/", (req, res, next) => {
  console.log("This is API Beginnings stupid")

  next()
})

apiRouter.use("/hospital", async (req, res, next) =>
  import("./hospital")
    .then(({ hospitalRouter }) => hospitalRouter(req, res, next))
    .catch(next)
)
