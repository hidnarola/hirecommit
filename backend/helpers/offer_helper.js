var ObjectId = require('mongodb').ObjectID;

var offer_helper = {};
offer_helper.get_all_offer = async (collection,search,start,length, recordsTotal, sort) => {

  try {

    const RE = { $regex: new RegExp(`${search.value}`, 'gi') };
      var aggregate = [
          {
            $match:{
              "is_del":false
            }
          },
          {
            $lookup:
              {
                from: "group",
                localField:"group",
                foreignField: "_id",
                as: "group"
              }
         },
         {
            $unwind:"$group",
          },
         {
            $lookup:
              {
                from: "user",
                localField:"employer_id" ,
                foreignField: "_id",
                as: "employer_id"
              }
         },
         {
            $unwind:"$employer_id",
          },
         {
            $lookup:
              {
                from: "location",
                localField:"location" ,
                foreignField: "_id",
                as: "location"
              }
         },
         {
            $unwind:"$location",
          },
         {
            $lookup:
              {
                from: "salary_bracket",
                localField:"salarybracket" ,
                foreignField: "_id",
                as: "salarybracket"
              }
         },
         {
            $unwind:"$salarybracket",
          }
         ]

      // if (search && search.value !='') {
          aggregate.push({
              "$match":
                  { $or: [{ "createdAt": RE }, { "title": RE}, { "salarytype": RE}, { "salarybracket.from": RE}, { "expirydate": RE}, { "joiningdate": RE}, { "status": RE}, { "offertype": RE}, { "group.name": RE}, { "commitstatus": RE}, { "customfeild1": RE}] }
          });
      // }
      if(sort){
        aggregate.push({
          "$sort":sort
      });
      }

      if(start){
        aggregate.push({
          "$skip":start
      });
      }
      if(length){
        aggregate.push({
          "$limit":length
      });
      }
      let offer = await collection.aggregate(aggregate);
      console.log(offer);

      if (offer) {
          return { "status": 1, "message": "offer list found", "offer": offer, "recordsTotal": recordsTotal };
      } else {
          return { "status": 2, "message": "offer not found" };
      }
  } catch (err) {
      return { "status": 0, "message": "Error occured while finding offer", "error": err }
  }
};

module.exports = offer_helper;
