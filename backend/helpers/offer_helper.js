var ObjectId = require('mongoose').Types.ObjectId;

var offer_helper = {};


offer_helper.get_all_offer = async (collection, id, search, start, length, recordsTotal, sort) => {

  try {

    const RE = { $regex: new RegExp(`${search.value}`, 'gi') };
    var aggregate = [
      {
        $match: {
          "is_del": false,
          $or: [{ "employer_id": new ObjectId(id) }, { "employer_id": new ObjectId(id) }],
        }
      },
      {
        $lookup:
        {
          from: "group",
          localField: "groups",
          foreignField: "_id",
          as: "group"
        }
      },
      {
        $unwind: {
          path: "$group",
          // preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup:
        {
          from: "user",
          localField: "employer_id",
          foreignField: "_id",
          as: "employer_id"
        }
      },
      {
        $unwind: {
          path: "$employer_id",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup:
        {
          from: "location",
          localField: "location",
          foreignField: "_id",
          as: "location"
        }
      },
      {
        $unwind: {
          path: "$location",
          preserveNullAndEmptyArrays: true
        }
      },
      // {
      //   $lookup:
      //   {
      //     from: "salary_bracket",
      //     localField: "salarybracket",
      //     foreignField: "_id",
      //     as: "salarybracket"
      //   }
      // },
      // {
      //   $unwind: {
      //     path: "$salarybracket",
      //     preserveNullAndEmptyArrays: true
      //   }
      // },
    ]

    if (search && search.value != '') {
      aggregate.push({
        "$match":
          { $or: [{ "createdAt": RE }, { "title": RE }, { "salarytype": RE }, { "salarybracket.from": RE }, { "expirydate": RE }, { "joiningdate": RE }, { "status": RE }, { "offertype": RE }, { "group.name": RE }, { "commitstatus": RE }, { "customfeild1": RE }] }
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
    let offer = await collection.aggregate(aggregate);

    if (offer) {
      return { "status": 1, "message": "offer list found", "offer": offer, "recordsTotal": recordsTotal };
    } else {
      return { "status": 2, "message": "offer not found" };
    }
  } catch (err) {
    return { "status": 0, "message": "Error occured while finding offer", "error": err }
  }
};

offer_helper.get_candidate_offer = async (collection, id, search, start, length, recordsTotal, sort) => {

  try {

    const RE = { $regex: new RegExp(`${search.value}`, 'gi') };
    var aggregate = [
      {
        $match: {
          "is_del": false,
          "user_id": new ObjectId(id)
        }
      },
      {
        $lookup:
        {
          from: "group",
          localField: "groups",
          foreignField: "_id",
          as: "group"
        }
      },
      {
        $unwind: {
          path: "$group",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup:
        {
          from: "user",
          localField: "employer_id",
          foreignField: "_id",
          as: "employer_id"
        }
      },
      {
        $unwind: {
          path: "$employer_id",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup:
        {
          from: "location",
          localField: "location",
          foreignField: "_id",
          as: "location"
        }
      },
      {
        $unwind: {
          path: "$location",
          preserveNullAndEmptyArrays: true
        }
      },
      // {
      //   $lookup:
      //   {
      //     from: "salary_bracket",
      //     localField: "salarybracket",
      //     foreignField: "_id",
      //     as: "salarybracket"
      //   }
      // },
      // {
      //   $unwind: {
      //     path: "$salarybracket",
      //     preserveNullAndEmptyArrays: true
      //   }
      // },
    ]

    if (search && search.value != '') {
      aggregate.push({
        "$match":
          { $or: [{ "createdAt": RE }, { "title": RE }, { "salarytype": RE }, { "salarybracket.from": RE }, { "expirydate": RE }, { "joiningdate": RE }, { "status": RE }, { "offertype": RE }, { "group.name": RE }, { "commitstatus": RE }, { "customfeild1": RE }] }
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
    let offer = await collection.aggregate(aggregate);

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
