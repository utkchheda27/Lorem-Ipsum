import express from "express"
import { isLoggedIn, isThisLoggedInUser } from "../middlewares.js";
import { getRequests, requestResponseHandler, sendRequest, getSentRequests, deleteARequest } from "../controllers/requests.js";

const router = express.Router({ mergeParams: true })

router.get('/', isLoggedIn, isThisLoggedInUser, getRequests)// sends all the requests recieved

router.post('/:fId', isLoggedIn, isThisLoggedInUser, sendRequest)// logged in user(id) sending request to a other user(fid)

router.post('/:fId/response', isLoggedIn, isThisLoggedInUser, requestResponseHandler)   // logged in user(id) responding to a particular request(fid)

router.get('/sent', isLoggedIn, isThisLoggedInUser, getSentRequests) // responds with all the requests made by user

router.delete('/sent/:fid', isLoggedIn, isThisLoggedInUser, deleteARequest)// deletes a request sent by a user(fid)

export default router;