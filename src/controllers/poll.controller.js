import { db, collections } from '../database/database.js';
import dayjs from 'dayjs';

export async function pollController(req, res){
    // - [ ]  Deve receber pelo body da request, um parâmetro title, contendo o nome da enquete a ser cadastrada e expireAt, contendo a data e hora de expiração da enquete:
    const { title, expireAt } = req.body;
    const poll = { title, expireAt };
    //     {title: "Qual a sua linguagem favorita?",
    //     		expireAt: "2022-02-28 01:00" }
    // - [ ]  Se **expireAt** for vazio deve ser considerado 30 dias de enquete por padrão.
    // Adicione 30 dias à data atualconst dataComMais30Dias = dataAtual.add(30, 'day');
    if (!expireAt || expireAt === "" || dayjs(expireAt).isBefore(dayjs()) ) {
        poll.expireAt = dayjs().add(30, "day").format("YYYY-MM-DD HH:mm");
    }

    try{
        const createPoll = await db.collection(collections.polls).insertOne(poll);
        // - [ ]  Deve retornar a enquete criada em caso de sucesso com status 201.
        return res.status(201).send([poll]);
    }
    catch(e){
        return res.status(400).send(e);
    }
}

export async function getpollController(req, res){
    // Retorna a lista de todas as enquetes:
    // [
    //     {
    //         _id: "54759eb3c090d83494e2d222",
    //     title: "Qual a sua linguagem favorita?",
    //         expireAt: "2022-02-28 01:00" 
    //     },
    //     ...
    // ]
    try{
        const pollsList = await db.collection(collections.polls).find().toArray();
        return res.send(pollsList);

    } catch(e) {
        return res.status(500).send(e);
    }


}

