var ObjectId = require('mongodb').ObjectID;

var user_helper = {};
user_helper.get_all_sub_user = async (collection, id, search, start, length, recordsTotal, sort) => {

  try {

    const RE = { $regex: new RegExp(`${search.value}`, 'gi') };
    var aggregate = [
      {
        $match: {
          "is_del": false,
          "emp_id": new ObjectId(id)
        }
      },
      {
        $lookup:
        {
          from: "user",
          localField: "user_id",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true
        }
      }
    ]

    // if (search && search.value !='') {
    aggregate.push({
      "$match":
      {
        $or: [{ "username": RE },
        { "user.email": RE }]
      }
    });
    // }
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
    let user = await collection.aggregate(aggregate);
    if (user) {
      return { "status": 1, "message": "user details found", "user": user, "recordsTotal": recordsTotal };
    } else {
      return { "status": 2, "message": "user not found" };
    }
  } catch (err) {
    return { "status": 0, "message": "Error occured while finding music", "error": err }
  }
};


user_helper.get_all_approved_employer = async (collection, search, start, length, recordsTotal, sort) => {
  try {

    const RE = { $regex: new RegExp(`${search.value}`, 'gi') };
    var aggregate = [
      {
        $match: {
          "is_del": false,
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
        $unwind: {
          path: "$country",
          preserveNullAndEmptyArrays: true
        },
      },
      {
        $lookup:
        {
          from: "user",
          localField: "user_id",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: {
          path: "$user",
          // preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup:
        {
          from: "business_type",
          localField: "businesstype",
          foreignField: "_id",
          as: "business"
        }
      },
      {
        $unwind:
        {
          path: "$business",
          // preserveNullAndEmptyArrays: true
        }

      },
      {
        $match: { "user.isAllow": true }
      }

    ]

    if (search && search.value != '') {
      aggregate.push({
        "$match":
        {
          $or: [{ "username": RE },
          { "user.email": RE }, { "business.country": RE }, { "companyname": RE }]
        }
      });
    }
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
    let user = await collection.aggregate(aggregate);
    if (user) {
      return { "status": 1, "message": "user details found", "user": user, "recordsTotal": recordsTotal };
    } else {
      return { "status": 2, "message": "user not found" };
    }
  } catch (err) {
    return { "status": 0, "message": "Error occured while finding music", "error": err }
  }
};

user_helper.get_all_new_employer = async (collection, search, start, length, recordsTotal, sort) => {
  try {

    const RE = { $regex: new RegExp(`${search.value}`, 'gi') };
    var aggregate = [
      {
        $match: {
          "is_del": false,
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
        $unwind: {
          path: "$country",
          preserveNullAndEmptyArrays: true
        },
      },
      {
        $lookup:
        {
          from: "user",
          localField: "user_id",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $lookup:
        {
          from: "business_type",
          localField: "businesstype",
          foreignField: "_id",
          as: "business"
        }
      },
      {
        $unwind:
        {
          path: "$business",
          // preserveNullAndEmptyArrays: true
        }

      },

      {
        $match: { "user.isAllow": false }
      }

    ]

    if (search && search.value != '') {
      aggregate.push({
        "$match":

        {
          $or: [{ "username": RE },
          { "user.email": RE }, { "business.country": RE }, { "companyname": RE }]
        }

      });
    }
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
    let user = await collection.aggregate(aggregate);
    if (user) {
      return { "status": 1, "message": "user details found", "user": user, "recordsTotal": recordsTotal };
    } else {
      return { "status": 2, "message": "user not found" };
    }
  } catch (err) {
    return { "status": 0, "message": "Error occured while finding music", "error": err }
  }
};


module.exports = user_helper;
