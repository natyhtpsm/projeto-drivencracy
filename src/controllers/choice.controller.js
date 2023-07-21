import { db, collections } from '../database/database.js';
import dayjs from 'dayjs';
import { ObjectId } from 'mongodb';

export async function choiceController(req, res){
    const {title, pollId} = req.body;
    const choice = {title, pollId};
    try{
        const pollExists = await db.collection(collections.polls).findOne({_id: new ObjectId(pollId)});
        const choiceExists =  await db.collection(collections.choices).findOne({title : title, pollId: pollId});
        
        if(!pollExists){
            return res.status(404).send("Poll does not exist");
        }
        if(choiceExists){
            return res.status(409).send("Choice already exists");
        }
        const pollExpired = pollExists.expiredAt;
        if(dayjs(pollExpired).isBefore(dayjs())){
            return res.status(403).send("Poll expired");
        }
        const choiceCreated = await db.collection(collections.choices).insertOne(choice);
        if(choiceCreated){
            return res.status(201).send("Choice created");
        }
    }catch(e){
        console.log(e.message);
    }
}   

export async function getchoiceController(req, res){
    const id = req.params.id;
    try{
        const pollExists = await db.collection(collections.polls).find({ _id: id }).toArray();
        if (!pollExists) {
          return res.status(404).send("This poll does not exist");
        }    
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
    const id = req.params.id;
    const vote = {createdAt: dayjs().format('YYYY-MM-DD HH:mm'), choiceId: id};
    const currentDate = dayjs();
    try{
        const choiceExists = await db.collection(collections.choices).findOne({ _id: new ObjectId(id) });
        console.log("CHOICE", choiceExists);
        if (!choiceExists) {
          return res.status(404).send("This choice does not exist");
        }  

        const poll = await db.collection(collections.polls).findOne({ _id: new ObjectId(choiceExists.pollId)});
        if (!poll) {
          return res.status(404).send("This poll does not exist");
        }
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
}

