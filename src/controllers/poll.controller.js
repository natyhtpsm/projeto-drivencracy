import { db, collections } from '../database/database.js';
import dayjs from 'dayjs';
import { ObjectId } from 'mongodb';

export async function pollController(req, res){
    const poll = { title, expireAt };
    if (!expireAt || expireAt === "" || dayjs(expireAt).isBefore(dayjs()) ) {
        poll.expireAt = dayjs().add(30, "day").format("YYYY-MM-DD HH:mm");
    }
    try{
        const createPoll = await db.collection(collections.polls).insertOne(poll);
        return res.status(201).send([poll]);
    }
    catch(e){
        console.log(e.message);
    }
}

export async function getpollController(req, res){
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
      const choiceIds = choices.map((choice) => choice._id.toString());
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
