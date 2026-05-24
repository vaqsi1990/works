import { Router } from 'express'
import {
  getAllWorks,
  getWorkTypes,
  createWork,
  updateWork,
  deleteWork,
} from '../controllers/Forms.js'

const router = Router();

router.get('/types', getWorkTypes);
router.get('/', getAllWorks);
router.post('/add', createWork);
router.put('/:id', updateWork);
router.delete('/:id', deleteWork);

export default router;
