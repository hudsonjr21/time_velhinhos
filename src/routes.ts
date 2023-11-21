import { Router } from 'express';
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
import { ListByPenaltyController } from './controllers/payment/ListByPenaltyController';
import { CreateGameController } from './controllers/game/CreateGameController';
import { ListGameController } from './controllers/game/ListGameController';
import { CreateAttendanceController } from './controllers/attendance/CreateAttendanceController';
import { CreateCashTransactionController } from './controllers/cashTransaction/CreateCashTransactionController ';
import { ListCashTransactionController } from './controllers/cashTransaction/ListCashTransactionController ';
import { CreateMembershipFeeController } from './controllers/membershipFee/CreateMembershipFeeController ';
import { ListMembershipFeeController } from './controllers/membershipFee/ListMembershipFeeController ';
import { ListAttendanceController } from './controllers/attendance/ListAttendanceController';

const router = Router();

const upload = multer(uploadConfig.upload("./tmp"));

//-- ROTAS USER --
router.post('/users', upload.single('file'), new CreateUserController().handle)
router.get('/users', new ListUserController().handle)
router.post('/session', new AuthUserController().handle)
router.get('/me', isAuthenticated,  new DetailuserController().handle )
router.put('/user', isAuthenticated, upload.single('file'), new UpdateUserController().handle )

//-- ROTAS MULTA --
router.post('/type-penalty', new CreatePenaltyTypeController().handle)
router.get('/type-penalty', new ListPenaltyTypeController().handle)

//-- ROTAS PAGAMENTO --
router.post('/payment', new CreatePaymentController().handle)
router.get('/payment', new ListPaymentController().handle)
router.get('/user/payment', new ListByUserController().handle)
router.get('/penalty/payment', new ListByPenaltyController().handle)

//-- ROTAS JOGO --
router.post('/game', new CreateGameController().handle)
router.get('/game', new ListGameController().handle)
router.post('/game/attendance', new CreateAttendanceController().handle)
router.get('/game/attendance', new ListAttendanceController().handle)

//-- ROTAS CAIXA --
router.post('/cash', new CreateCashTransactionController().handle)
router.get('/cash', new ListCashTransactionController().handle)

//-- ROTAS MENSALIDADE --
router.post('/membership-fee', new CreateMembershipFeeController().handle)
router.get('/membership-fee', new ListMembershipFeeController().handle)

export { router };