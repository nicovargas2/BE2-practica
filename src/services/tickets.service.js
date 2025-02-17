import { ticketDao } from '../dao/mongo/ticket.dao.js';

class TicketsService {
    // amount es el precio del ticket con todos los productos
    // purchase es el email del usuario registrado
    async create(amount, purchase) {
        const code = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        const ticket = await ticketDao.create({ amount, code, purchase });

        return ticket;
    }

    async getAll() {
        return await ticketDao.getAll();
    }

}

export const ticketsService = new TicketsService();