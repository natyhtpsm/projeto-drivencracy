import { db, collections } from '../database/database.js';
import dayjs from 'dayjs';
import { ObjectId } from 'mongodb';

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
        console.log(e.message);
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
        console.log(e.message);
    }


}

export async function getResultController(req, res) {
    const id = req.params.id;
  
    try {
      const poll = await db.collection(collections.polls).findOne({ _id: new ObjectId(id) });
      if (!poll) {
        return res.status(404).send("This poll does not exist");
      }
  
      const choices = await db.collection(collections.choices).find({ pollId: id }).toArray();
  
      if (choices.length === 0) {
        return res.status(404).send("There are no choices for this poll");
      }

      const choiceIds = choices.map((choice) => choice._id);
      const voteCounts = await db.collection(collections.votes).aggregate([
        { $match: { choiceId: { $in: choiceIds } } }, 
        { $sortByCount: "$choiceId" }, 
      ]).toArray();
  
      if (voteCounts.length === 0) {
        return res.status(404).send("No votes have been cast for this poll");
      }

      const mostVotedChoiceId = voteCounts[0]._id;
      const mostVotedChoice = choices.find((choice) => choice._id.equals(mostVotedChoiceId));
  
      const result = {
        _id: poll._id,
        title: poll.title,
        expireAt: poll.expireAt,
        result: {
          title: mostVotedChoice.title,
          votes: voteCounts[0].count,
        },
      };
  
      return res.json(result);
    } catch (e) {
      console.log(e.message);
    }
}

// - **GET** `/poll/:id/result`
//     - [ ]  Retorna o resultado de uma enquete, ou seja, a opção de voto **mais votada** na enquete até o momento, seguindo o formato sugerido:
    
//     ```jsx
//     {
//     	_id: "54759eb3c090d83494e2d222",
//     	title: "Qual a sua linguagem de programação favorita?"
//     	expireAt: "2022-02-14 01:00",
//     	result : {
//     		title: "Javascript",
//     		votes: 487
//     	}
//     }
//     ```
    
//     - [ ]  Validação: caso a enquete não exista deve retornar status 404.