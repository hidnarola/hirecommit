var ObjectId = require('mongodb').ObjectID;

var salary_helper = {};
salary_helper.get_all_salary_bracket = async (collection,search,start,length, recordsTotal, sort) => {
  try {
    // console.log(search);

    const RE = { $regex: new RegExp(`${search.value}`, 'gi') };
      var aggregate = [
          {
            $match:{
              "is_del":false
            }
          }
         ]

         console.log(RE);

          aggregate.push({
              "$match":
                  { $or: [{ "country": RE}, { "currency": RE}, { "from": RE}, { "to": RE}] }
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
      let salary = await collection.aggregate(aggregate);


      if (salary) {
          return { "status": 1, "message": "salary bracket details found", "salary": salary, "recordsTotal": recordsTotal };
      } else {
          return { "status": 2, "message": "salary bracket not found" };
      }
  } catch (err) {
      return { "status": 0, "message": "Error occured while finding music", "error": err }
  }
};

module.exports = salary_helper;
