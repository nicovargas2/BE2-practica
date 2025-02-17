import { ticketsService } from "../services/tickets.service.js";

export class TicketsController {

    async getAll(req, res) {
        try {
            const tickets = await ticketsService.getAll();
            res.status(200).json({ status: "success", tickets });
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: "Erro", msg: "Error interno del servidor" });
        }
    }
}

export const ticketsController = new TicketsController();