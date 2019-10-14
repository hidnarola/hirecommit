var ObjectId = require('mongodb').ObjectID;

var location_helper = {};
location_helper.get_all_location = async (collection,search,start,length, recordsTotal, sort) => {
  try {
    const RE = { $regex: new RegExp(`${search.value}`, 'gi') };
    console.log(RE);
      var aggregate = [
          {
            $match:{
              "is_del":false
            }
          },
          {
            $lookup:
            {
              from: "country_datas",
              localField: "country",
              foreignField: "_id",
              as: "country"
            }
          },
          {
            $unwind: "$country",
          },
         ]

        //  console.log(RE);

          aggregate.push({
              "$match":
              { $or: [{ "city": RE }, { "country.country": RE}] }
          });
          // console.log(aggregate);
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
      let location = await collection.aggregate(aggregate);


      if (location) {
          return { "status": 1, "message": "salary bracket details found", "location": location, "recordsTotal": recordsTotal };
      } else {
          return { "status": 2, "message": "salary bracket not found" };
      }
  } catch (err) {
      return { "status": 0, "message": "Error occured while finding music", "error": err }
  }
};

module.exports = location_helper;
