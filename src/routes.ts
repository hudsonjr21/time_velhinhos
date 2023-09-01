import { Router } from 'express';
import express from 'express';
import { CreateUserController } from './controllers/user/CreateUserController'
import { AuthUserController } from './controllers/user/AuthUserController'
import { DetailuserController } from './controllers/user/DetailUserController'
import { isAuthenticated } from './middlewares/isAuthenticated'
import uploadConfig from './config/multer'
import multer from 'multer';
import { UpdateUserController } from './controllers/user/UpdateUserController';
import { CreatePenaltyTypeController } from './controllers/penalty/CreatePenaltyTypeController';
import { ListPenaltyTypeController } from './controllers/penalty/ListPenaltyTypeController';
import { CreatePaymentController } from './controllers/payment/CreatePaymentController';
import { ListPaymentController } from './controllers/payment/ListPaymentController';
import { ListByUserController } from './controllers/payment/ListByUserController';
import { ListUserController } from './controllers/user/ListUserController';

const router = Router();

const upload = multer(uploadConfig.upload("./tmp"));

//-- ROTAS USER --
router.post('/users', upload.single('file'), new CreateUserController().handle)
router.get('/users', new ListUserController().handle)
router.post('/session', new AuthUserController().handle)
router.get('/me', isAuthenticated,  new DetailuserController().handle )
router.put('/user', isAuthenticated, new UpdateUserController().handle )

//-- ROTAS MULTA --
router.post('/type-penalty', new CreatePenaltyTypeController().handle)
router.get('/type-penalty', new ListPenaltyTypeController().handle)

//-- ROTAS PAGAMENTO --
router.post('/payment', new CreatePaymentController().handle)
router.get('/payment', new ListPaymentController().handle)
router.get('/user/payment', new ListByUserController().handle)


export { router };