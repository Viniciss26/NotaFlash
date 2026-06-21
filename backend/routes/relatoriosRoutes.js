import express from 'express';
import { obterDadosPainelFinanceiro } from '../controllers/relatorioController.js';

const router = express.Router();

router.get('/faturamento', obterDadosPainelFinanceiro);

export default router;