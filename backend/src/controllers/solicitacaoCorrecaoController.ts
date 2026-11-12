import { NextFunction, Request, Response } from 'express';
import * as service from '../services/solicitacaoCorrecaoService';
export const create = async (req: Request, res: Response, next: NextFunction) => { try { res.status(201).json(await service.create(req.doadorId as number, req.body)); } catch (e) { next(e); } };
export const finish = async (req: Request, res: Response, next: NextFunction) => { try { res.status(200).json(await service.finish(req.doadorId as number, Number(req.params.id), req.body.respostas_corrigidas)); } catch (e) { next(e); } };
export const mine = async (req: Request, res: Response, next: NextFunction) => { try { res.status(200).json(await service.latestForDoador(req.doadorId as number)); } catch (e) { next(e); } };
export const pending = async (_req: Request, res: Response, next: NextFunction) => { try { res.status(200).json(await service.pendingForIntegration()); } catch (e) { next(e); } };
export const resolve = async (req: Request, res: Response, next: NextFunction) => { try { res.status(200).json(await service.resolve(Number(req.params.id), req.body)); } catch (e) { next(e); } };
