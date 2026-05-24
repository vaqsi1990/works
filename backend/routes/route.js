import { Router } from 'express'
import {
  gelAllWorks,
  getWorkTypes,
  createWork,
  updateWork,
  deleteWork,
} from '../controllers/Forms.js'

const router = Router();

router.get('/types', getWorkTypes);
router.get('/', gelAllWorks);
router.post('/add', createWork);
router.put('/:id', updateWork);
router.delete('/:id', deleteWork);

export default router;
