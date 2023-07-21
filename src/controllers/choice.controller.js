import { db, collections } from '../database/database.js';
import dayjs from 'dayjs';
import { ObjectId } from 'mongodb';

export async function choiceController(req, res){
    // - [ ]  Deve receber pelo body da request, um parâmetro title, contendo o nome da opção a ser cadastrada e pollId.
    const {title, pollId} = req.body;
    const choice = {title, pollId};
    try{
        const pollExists = await db.collection(collections.polls).findOne({_id: new ObjectId(pollId)});
        const choiceExists =  await db.collection(collections.choices).findOne({title : title, pollId: pollId});
        
        if(!pollExists){
            //     - [ ]  Uma opção de voto não pode ser inserida sem uma enquete existente, retornar status 404.
            return res.status(404).send("Poll does not exist");
        }
        if(choiceExists){
            //     - [ ]  **Title** não pode ser repetido, retornar status 409.
            return res.status(409).send("Choice already exists");
        }
        const pollExpired = pollExists.expiredAt;
        if(dayjs(pollExpired).isBefore(dayjs())){
            //     - [ ]  Se a enquete já estiver expirado deve retornar erro com status 403.
            return res.status(403).send("Poll expired");
        }
        const choiceCreated = await db.collection(collections.choices).insertOne(choice);
        if(choiceCreated){
            // - [ ]  Deve retornar a opção de voto criada em caso de sucesso com status 201.
            return res.status(201).send("Choice created");
        }
    }catch(e){
        console.log(e.message);
    }
}   

export async function getchoiceController(req, res){
    const id = req.params.id;
    //Rota: /poll/:id/choice (params?)
    try{
        const pollExists = await db.collection(collections.polls).find({ _id: id }).toArray();
        // - [ ]  Validação: caso a enquete não exista deve retornar status 404.
        if (!pollExists) {
          // Caso a enquete não exista, retorna status 404
          return res.status(404).send("This poll does not exist");
        }    
        // - [ ]  Retorna a lista de opções de voto de uma enquete:
        const choices = await db.collection(collections.choices).find({pollId: id}).toArray();
        if(!choices){
            return res.status(404).send("There is no choices for this poll");
        }
        return res.send(choices);
    }
    catch(e){
        console.log(e.message);
    }
}

export async function voteController(req, res){
    // - [ ]  Não recebe nenhum dado do body da requisição. Deve registrar um voto na opção selecionada.
    // POST /choice/:id/vote
    const id = req.params.id;
    // - [ ]  O voto deve armazenar a data e hora que foi criado no back-end.
    const vote = {createdAt: dayjs().format('YYYY-MM-DD HH:mm'), choiceId: id};
    const currentDate = dayjs();
    try{
        const choiceExists = await db.collection(collections.choices).findOne({ _id: id });
        //     - [ ]  Verificar se é uma opção existente, se não existir retornar 404.
        if (!choiceExists) {
          return res.status(404).send("This choice does not exist");
        }  

        const poll = await db.collection(collections.polls).findOne({ _id: choiceExists.pollId });
        if (!poll) {
          return res.status(404).send("This poll does not exist");
        }
        //     - [ ]  Não pode ser registrado se a enquete já estiver expirado, retornar erro 403.
        const expirationDate = poll.expireAt;
        if (currentDate.isAfter(expirationDate)) {
          return res.status(403).send("This poll has expired");
        }
        const registerVote = await db.collection(collections.votes).insertOne(vote);
        if(!registerVote){
            return res.status(500);
        }
        return res.status(201).send("Vote registered");
    } catch(e){
        console.log(e.message);
    }
    // - [ ]  Retorna status 201 em caso de sucesso.
}

