# DevTinder APIs

## authRouter

- POST /signup
- POST /login
- POST /logout

## profileRouter

- GET /profile/view
- PATCH /profile/edit
- pATCH /profile/password

## connectionsRequestRouter

- POST /request/send/interested/:userId
- POST /request/send/ignore/:userId
- POST /request/review/accepted/:rquestId
- POST /request/review/rejected/:requestId

## userRouter

- GET /user/connections
- GET /user/requests/recived
- Get /user/feed - Gets you the profiles

status: ignore, interested, accepted, rejected
