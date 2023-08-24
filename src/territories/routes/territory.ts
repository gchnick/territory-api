import { Router } from 'express';
import { TerritoryController } from '../controllers/territory';

export const territoryRouter = Router();

territoryRouter.get('/', TerritoryController.getAll);
territoryRouter.get('/:number', TerritoryController.getById);
territoryRouter.post('/', TerritoryController.create);
territoryRouter.patch('/:number', TerritoryController.update);
territoryRouter.delete('/:id', TerritoryController.delete);
