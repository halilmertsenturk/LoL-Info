import { Router } from 'express';
import {
  getPlayerProfile,
  getTftPlayerProfile,
  getSearchHistoryHandler,
} from '../controllers/playerController';

const router = Router();

// LoL profile: summoner + ranked + mastery + match history
router.get('/player/:region/:gameName/:tagLine', getPlayerProfile);

// TFT profile: ranked + match history
router.get('/player/:region/:gameName/:tagLine/tft', getTftPlayerProfile);

// Search history
router.get('/search/history', getSearchHistoryHandler);

export default router;
