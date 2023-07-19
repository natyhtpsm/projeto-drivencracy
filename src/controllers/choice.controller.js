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
        return res.status(500).send(e.message);
    }
}   

