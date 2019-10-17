var ObjectId = require('mongodb').ObjectID;

var salary_helper = {};


salary_helper.get_all_salary_bracket = async (collection, id, search, start, length, recordsTotal, sort) => {
  try {
    // console.log(search);

    const RE = { $regex: new RegExp(`${search.value}`, 'gi') };
    var aggregate = [
      {
        $match: {
          "is_del": false,
          "emp_id": new ObjectId(id)
        }
      },
      // {
      //   $lookup:
      //   {
      //     from: "location",
      //     localField: "location",
      //     foreignField: "_id",
      //     as: "location"
      //   }
      // },
      // {
      //   $unwind: {
      //     path: "$location",
      //     preserveNullAndEmptyArrays: true
      //   }
      // },
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
        $unwind: {
          path: "$country",
          preserveNullAndEmptyArrays: false
        },
      }
    ]

    if (search && search != "") {
      aggregate.push({
        "$match":
          { $or: [{ "country": RE }, { "currency": RE }, { "from": RE }, { "to": RE }] }
      });
    }

    // console.log(aggregate);
    if (sort) {
      aggregate.push({
        "$sort": sort
      });
    }


    if (start) {
      aggregate.push({
        "$skip": start
      });
    }
    if (length) {
      aggregate.push({
        "$limit": length
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
